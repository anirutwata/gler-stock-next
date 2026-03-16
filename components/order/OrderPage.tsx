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
import { getStatus } from '@/lib/utils'
import { buildOrderMessage } from '@/lib/messages'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import BottomSheet from '@/components/BottomSheet'
import ToastList from '@/components/Toast'
import type { Item } from '@/lib/types'

export default function OrderPage() {
  const { items } = useItems()
  const { getCatEmoji } = useCategories()
  const { saveSession } = useSessions()
  const { botToken, chatId } = useTelegram()
  const { user } = useUser()
  const { lang } = useLang()
  const { toasts, showToast } = useToast()
  const t = T[lang]

  const [search, setSearch] = useState('')
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const [checked, setChecked] = useState<Record<string, { checked: boolean; qty: string }>>({})
  const [note, setNote] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [sending, setSending] = useState(false)

  const filtered = items.filter(item => {
    if (!search) return true
    const q = search.toLowerCase()
    return item.name_th.toLowerCase().includes(q) || item.name_mm.toLowerCase().includes(q)
  })

  // Group by supplier
  const grouped: Record<string, Item[]> = {}
  filtered.forEach(item => {
    const sup = item.supplier || 'ไม่ระบุ'
    if (!grouped[sup]) grouped[sup] = []
    grouped[sup].push(item)
  })
  const supplierKeys = Object.keys(grouped).sort()

  function toggleGroup(key: string) {
    setOpenGroups(prev => ({ ...prev, [key]: prev[key] === false }))
  }

  function toggleItem(id: string, val: boolean) {
    setChecked(prev => ({ ...prev, [id]: { checked: val, qty: prev[id]?.qty || '' } }))
  }

  function setQty(id: string, qty: string) {
    setChecked(prev => ({ ...prev, [id]: { checked: prev[id]?.checked || false, qty } }))
  }

  const selectedItems = items.filter(i => checked[i.id]?.checked)

  async function handleSend() {
    if (selectedItems.length === 0) {
      showToast(t.order.noItems, 'error')
      return
    }
    setSending(true)
    const msg = buildOrderMessage(items, checked, note, user?.name || '')
    await saveSession('order', user?.name || 'ไม่ระบุ', user?.role || '', msg)
    if (botToken && chatId) {
      try {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: msg }),
        })
        showToast(res.ok ? 'ส่งใบสั่งซื้อแล้ว ✓' : 'บันทึกแล้ว (ส่ง Telegram ไม่สำเร็จ)', res.ok ? 'success' : 'info')
      } catch {
        showToast('บันทึกแล้ว', 'success')
      }
    } else {
      showToast('บันทึกใบสั่งซื้อแล้ว ✓', 'success')
    }
    setSending(false)
    setShowModal(false)
    setChecked({})
    setNote('')
  }

  return (
    <div className="app-shell">
      <AppHeader />
      <ToastList toasts={toasts} />
      <div className="page-content">
        <div className="page-title">{t.order.title}</div>
        <div className="page-sub">{t.order.sub}</div>

        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="search-input" placeholder={t.order.search} value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {supplierKeys.map(sup => {
          const supItems = grouped[sup]
          const isOpen = openGroups[sup] !== false
          return (
            <div key={sup} className="cat-group">
              <div className="cat-header" onClick={() => toggleGroup(sup)}>
                <div className="cat-header-left">🏪 {sup}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="cat-count">{supItems.length}</span>
                  <svg className={`cat-chevron ${isOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
              {isOpen && (
                <div className="cat-body">
                  {supItems.map(item => {
                    const isChecked = checked[item.id]?.checked || false
                    const qty = checked[item.id]?.qty || ''
                    const name = lang === 'mm' ? item.name_mm : item.name_th
                    const unit = lang === 'mm' ? item.unit_mm : item.unit_th
                    const status = getStatus(item)
                    const isLow = status === 'low' || status === 'empty'
                    const emoji = getCatEmoji(item.category)
                    return (
                      <div key={item.id} className="order-item">
                        <input type="checkbox" className="order-check" checked={isChecked} onChange={e => toggleItem(item.id, e.target.checked)} />
                        {item.image
                          ? <img className="item-thumb" src={item.image} alt="" style={{ width: 36, height: 36 }} />
                          : <div className="item-thumb-empty" style={{ width: 36, height: 36, fontSize: 16 }}>{emoji}</div>
                        }
                        <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>
                          {name}{isLow && <span style={{ color: '#e65100', marginLeft: 4 }}>⚠️</span>}
                          {lang === 'mm' && <div style={{ fontSize: 11, color: 'var(--secondary)' }}>{item.name_th}</div>}
                        </div>
                        <input
                          className="qty-input"
                          type="number"
                          inputMode="decimal"
                          placeholder="0"
                          value={qty}
                          onChange={e => setQty(item.id, e.target.value)}
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
          {t.order.btn} {selectedItems.length > 0 && `(${selectedItems.length})`}
        </button>
      </div>

      <BottomSheet open={showModal} onClose={() => setShowModal(false)} title={t.order.confirmTitle}>
        {selectedItems.length === 0 ? (
          <p style={{ color: 'var(--secondary)', textAlign: 'center', padding: '20px 0' }}>{t.order.noItems}</p>
        ) : (
          <div style={{ marginBottom: 16 }}>
            {selectedItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                <span>{item.name_th}</span>
                <span style={{ color: 'var(--secondary)' }}>{checked[item.id]?.qty || '?'} {item.unit_th}</span>
              </div>
            ))}
          </div>
        )}
        <div className="form-group">
          <label className="form-label">{t.order.note}</label>
          <textarea
            className="form-input"
            placeholder={t.order.notePH}
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            style={{ resize: 'none' }}
          />
        </div>
        <button className="btn-primary" onClick={handleSend} disabled={sending || selectedItems.length === 0}>
          {sending ? 'กำลังส่ง...' : t.order.sendBtn}
        </button>
      </BottomSheet>

      <BottomNav />
    </div>
  )
}
