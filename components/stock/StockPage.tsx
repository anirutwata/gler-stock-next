'use client'
import { useState } from 'react'
import { useItems } from '@/hooks/useItems'
import { useCategories } from '@/hooks/useCategories'
import { useSessions } from '@/hooks/useSessions'
import { useTelegram } from '@/context/TelegramContext'
import { useUser } from '@/context/UserContext'
import { useLang } from '@/context/LangContext'
import { useToast } from '@/hooks/useToast'
import { T } from '@/lib/translations'
import { getStatus, statusDotColor } from '@/lib/utils'
import { buildStockMessage } from '@/lib/messages'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import BottomSheet from '@/components/BottomSheet'
import ToastList from '@/components/Toast'
import type { Item } from '@/lib/types'

export default function StockPage() {
  const { items, updateStock } = useItems()
  const { categories, getCatName, getCatEmoji } = useCategories()
  const { saveSession } = useSessions()
  const { botToken, chatId } = useTelegram()
  const { user } = useUser()
  const { lang } = useLang()
  const { toasts, showToast } = useToast()
  const t = T[lang]

  const [search, setSearch] = useState('')
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({})
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const filtered = items.filter(item => {
    if (!search) return true
    const q = search.toLowerCase()
    return item.name_th.toLowerCase().includes(q) || item.name_mm.toLowerCase().includes(q)
  })

  const grouped: Record<string, Item[]> = {}
  filtered.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = []
    grouped[item.category].push(item)
  })

  const catOrder = categories.map(c => c.id)

  function toggleCat(id: string) {
    setOpenCats(prev => ({ ...prev, [id]: prev[id] === false ? true : false }))
  }

  function isCatOpen(id: string) {
    return openCats[id] !== false
  }

  const summaryMsg = buildStockMessage(items, categories, user?.name || '')
  const countedItems = items.filter(i => i.currentStock !== null)

  async function handleSave() {
    if (countedItems.length === 0) {
      showToast('ยังไม่ได้นับรายการใด', 'error')
      return
    }
    setSaving(true)
    await saveSession('stock', user?.name || 'ไม่ระบุ', user?.role || '', summaryMsg)
    if (botToken && chatId) {
      try {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: summaryMsg }),
        })
        showToast(res.ok ? 'บันทึกและส่ง Telegram แล้ว ✓' : 'บันทึกแล้ว (ส่ง Telegram ไม่สำเร็จ)', res.ok ? 'success' : 'info')
      } catch {
        showToast('บันทึกแล้ว', 'success')
      }
    } else {
      showToast('บันทึกข้อมูลแล้ว ✓', 'success')
    }
    setSaving(false)
    setShowModal(false)
  }

  return (
    <div className="app-shell">
      <AppHeader />
      <ToastList toasts={toasts} />
      <div className="page-content">
        <div className="page-title">{t.stock.title}</div>
        <div className="page-sub">{t.stock.sub}</div>

        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="search-input" placeholder={t.stock.search} value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {catOrder.map(catId => {
          const catItems = grouped[catId] || []
          if (catItems.length === 0) return null
          const isOpen = isCatOpen(catId)
          return (
            <div key={catId} className="cat-group">
              <div className="cat-header" onClick={() => toggleCat(catId)}>
                <div className="cat-header-left">{getCatEmoji(catId)} {getCatName(catId)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="cat-count">{catItems.length}</span>
                  <svg className={`cat-chevron ${isOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
              {isOpen && (
                <div className="cat-body">
                  {catItems.map(item => {
                    const status = getStatus(item)
                    const dotClass = statusDotColor(status)
                    const name = lang === 'mm' ? item.name_mm : item.name_th
                    const unit = lang === 'mm' ? item.unit_mm : item.unit_th
                    const emoji = getCatEmoji(item.category)
                    return (
                      <div key={item.id} className="stock-item">
                        {item.image
                          ? <img className="item-thumb" src={item.image} alt="" />
                          : <div className="item-thumb-empty">{emoji}</div>
                        }
                        <div className={`item-status ${dotClass}`} />
                        <div className="item-name">
                          <div>{name}</div>
                          {lang === 'mm' && <div className="item-name-mm">{item.name_th}</div>}
                        </div>
                        <input
                          className="stock-input"
                          type="number"
                          inputMode="decimal"
                          placeholder="0"
                          value={item.currentStock ?? ''}
                          onChange={e => {
                            const v = e.target.value === '' ? null : parseFloat(e.target.value)
                            updateStock(item.id, v)
                          }}
                        />
                        <span className="unit-label">{unit}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="bottom-btn-wrap">
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          {t.stock.btn}
        </button>
      </div>

      <BottomSheet open={showModal} onClose={() => setShowModal(false)} title={t.stock.confirmTitle}>
        {countedItems.length === 0 ? (
          <p style={{ color: 'var(--secondary)', textAlign: 'center', padding: '20px 0' }}>ยังไม่ได้นับรายการใด</p>
        ) : (
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13, background: 'var(--bg-light)', padding: 12, borderRadius: 'var(--radius-sm)', marginBottom: 16, maxHeight: '50vh', overflow: 'auto' }}>
            {summaryMsg}
          </pre>
        )}
        <button className="btn-primary" onClick={handleSave} disabled={saving || countedItems.length === 0}>
          {saving ? 'กำลังบันทึก...' : t.stock.sendBtn}
        </button>
      </BottomSheet>

      <BottomNav />
    </div>
  )
}
