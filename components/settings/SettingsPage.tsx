'use client'
import { useState } from 'react'
import { useSuppliers } from '@/hooks/useSuppliers'
import { useCategories } from '@/hooks/useCategories'
import { useLang } from '@/context/LangContext'
import { useUser } from '@/context/UserContext'
import { useToast } from '@/hooks/useToast'
import { T } from '@/lib/translations'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import ToastList from '@/components/Toast'

export default function SettingsPage() {
  const { suppliers, addSupplier, deleteSupplier } = useSuppliers()
  const { categories, addCategory, deleteCategory } = useCategories()
  const { lang, setLang } = useLang()
  const { user } = useUser()
  const { toasts, showToast } = useToast()
  const t = T[lang]

  const [newSupplier, setNewSupplier] = useState('')
  const [newCatName, setNewCatName] = useState('')
  const [newCatEmoji, setNewCatEmoji] = useState('')

  async function handleAddSupplier() {
    if (!newSupplier.trim()) return
    if (suppliers.find(s => s.name.toLowerCase() === newSupplier.trim().toLowerCase())) {
      showToast('มีผู้จำหน่ายนี้แล้ว', 'error'); return
    }
    await addSupplier(newSupplier.trim())
    setNewSupplier('')
    showToast('เพิ่มผู้จำหน่ายแล้ว ✓', 'success')
  }

  async function handleAddCategory() {
    if (!newCatName.trim()) return
    await addCategory(newCatName.trim(), newCatEmoji.trim())
    setNewCatName(''); setNewCatEmoji('')
    showToast('เพิ่มหมวดหมู่แล้ว ✓', 'success')
  }

  async function handleDeleteCategory(id: string) {
    await deleteCategory(id)
    showToast('ลบหมวดหมู่แล้ว', 'success')
  }

  return (
    <div className="app-shell">
      <AppHeader />
      <ToastList toasts={toasts} />
      <div className="page-content">
        <div className="page-title">{t.settings.title}</div>

        {/* Suppliers */}
        <div className="settings-section">
          <div className="settings-section-title">🏪 ผู้จำหน่าย</div>
          <div className="settings-card">
            <div style={{ marginBottom: 12 }}>
              {suppliers.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ flex: 1, fontSize: 14 }}>🏪 {s.name}</span>
                  {user?.role === 'super_admin' && <button onClick={() => deleteSupplier(s.id)} style={{ background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: 18, padding: '4px 8px' }}>✕</button>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-input" style={{ flex: 1 }} value={newSupplier} onChange={e => setNewSupplier(e.target.value)} placeholder="ชื่อผู้จำหน่ายใหม่..." onKeyDown={e => e.key === 'Enter' && handleAddSupplier()} />
              <button onClick={handleAddSupplier} style={{ flexShrink: 0, padding: '0 14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44, fontFamily: 'inherit' }}>เพิ่ม</button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="settings-section">
          <div className="settings-section-title">🗂️ หมวดหมู่</div>
          <div className="settings-card">
            <div style={{ marginBottom: 12 }}>
              {categories.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 18 }}>{c.emoji}</span>
                  <span style={{ flex: 1, fontSize: 14 }}>{c.name_th}</span>
                  {user?.role === 'super_admin' && <button onClick={() => handleDeleteCategory(c.id)} style={{ background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: 18, padding: '4px 8px' }}>✕</button>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-input" style={{ width: 54, flexShrink: 0, textAlign: 'center', fontSize: 18, padding: '8px 4px' }} value={newCatEmoji} onChange={e => setNewCatEmoji(e.target.value)} placeholder="📦" />
              <input className="form-input" style={{ flex: 1 }} value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="ชื่อหมวดหมู่ใหม่..." onKeyDown={e => e.key === 'Enter' && handleAddCategory()} />
              <button onClick={handleAddCategory} style={{ flexShrink: 0, padding: '0 14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44, fontFamily: 'inherit' }}>เพิ่ม</button>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="settings-section">
          <div className="settings-section-title">{t.settings.langSection}</div>
          <div className="settings-card">
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setLang('th')} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', border: `2px solid ${lang === 'th' ? 'var(--primary)' : 'var(--border)'}`, background: lang === 'th' ? 'rgba(153,47,24,0.06)' : 'var(--bg-light)', color: lang === 'th' ? 'var(--primary)' : 'var(--dark)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>🇹🇭 ภาษาไทย</button>
              <button onClick={() => setLang('mm')} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', border: `2px solid ${lang === 'mm' ? 'var(--primary)' : 'var(--border)'}`, background: lang === 'mm' ? 'rgba(153,47,24,0.06)' : 'var(--bg-light)', color: lang === 'mm' ? 'var(--primary)' : 'var(--dark)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>🇲🇲 မြန်မာဘာသာ</button>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
