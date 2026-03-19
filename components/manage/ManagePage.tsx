'use client'
import { useState } from 'react'
import { useItems } from '@/hooks/useItems'
import { useCategories } from '@/hooks/useCategories'
import { useSuppliers } from '@/hooks/useSuppliers'
import { useUser } from '@/context/UserContext'
import { useLang } from '@/context/LangContext'
import { useToast } from '@/hooks/useToast'
import { T } from '@/lib/translations'
import { genId, compressImage } from '@/lib/utils'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import BottomSheet from '@/components/BottomSheet'
import ToastList from '@/components/Toast'
import type { Item } from '@/lib/types'

export default function ManagePage() {
  const { items, saveItem, deleteItem } = useItems()
  const { categories, getCatName, getCatEmoji } = useCategories()
  const { suppliers, addSupplier } = useSuppliers()
  const { user } = useUser()
  const { lang } = useLang()
  const { toasts, showToast } = useToast()
  const t = T[lang]

  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Item | null>(null)

  // Form state
  const [fNameTh, setFNameTh] = useState('')
  const [fNameMm, setFNameMm] = useState('')
  const [fCat, setFCat] = useState('')
  const [fSupplier, setFSupplier] = useState('')
  const [fUnitTh, setFUnitTh] = useState('')
  const [fUnitMm, setFUnitMm] = useState('')
  const [fMinStock, setFMinStock] = useState('')
  const [fImage, setFImage] = useState<string | null>(null)
  const [newSupplierName, setNewSupplierName] = useState('')
  const [showAddSupplier, setShowAddSupplier] = useState(false)

  const filtered = items.filter(item => {
    if (filterCat !== 'all' && item.category !== filterCat) return false
    if (!search) return true
    const q = search.toLowerCase()
    return item.name_th.toLowerCase().includes(q) || item.name_mm.toLowerCase().includes(q)
  })

  function openAdd() {
    setEditing(null)
    setFNameTh(''); setFNameMm(''); setFCat(categories[0]?.id || ''); setFSupplier(suppliers[0]?.name || '')
    setFUnitTh(''); setFUnitMm(''); setFMinStock(''); setFImage(null)
    setModalOpen(true)
  }

  function openEdit(item: Item) {
    setEditing(item)
    setFNameTh(item.name_th); setFNameMm(item.name_mm); setFCat(item.category)
    setFSupplier(item.supplier); setFUnitTh(item.unit_th); setFUnitMm(item.unit_mm)
    setFMinStock(String(item.minStock)); setFImage(item.image)
    setModalOpen(true)
  }

  async function handleSave() {
    if (!fNameTh.trim()) { showToast('กรุณากรอกชื่อ (ไทย)', 'error'); return }
    const item: Item = {
      id: editing?.id || genId(),
      name_th: fNameTh.trim(),
      name_mm: fNameMm.trim(),
      category: fCat,
      supplier: fSupplier,
      unit_th: fUnitTh.trim(),
      unit_mm: fUnitMm.trim(),
      minStock: parseFloat(fMinStock) || 0,
      currentStock: editing?.currentStock ?? null,
      image: fImage,
    }
    await saveItem(item)
    showToast(editing ? 'แก้ไขแล้ว ✓' : 'เพิ่มรายการแล้ว ✓', 'success')
    setModalOpen(false)
  }

  async function handleDelete() {
    if (!editing) return
    if (!confirm(t.manage.delConfirm)) return
    await deleteItem(editing.id)
    showToast('ลบแล้ว', 'success')
    setModalOpen(false)
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const compressed = await compressImage(file)
      setFImage(compressed)
    } catch {
      showToast('โหลดรูปไม่สำเร็จ', 'error')
    }
  }

  async function handleAddSupplier() {
    if (!newSupplierName.trim()) return
    const sup = await addSupplier(newSupplierName.trim())
    setFSupplier(sup.name)
    setNewSupplierName('')
    setShowAddSupplier(false)
    showToast('เพิ่มผู้จำหน่ายแล้ว ✓', 'success')
  }

  return (
    <div className="app-shell">
      <AppHeader />
      <ToastList toasts={toasts} />
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div>
            <div className="page-title">{t.manage.title}</div>
            <div className="page-sub">{t.manage.sub}</div>
          </div>
          <button onClick={openAdd} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
            + {t.manage.addBtn}
          </button>
        </div>

        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="search-input" placeholder={t.manage.search} value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="filter-tabs">
          <button className={`filter-tab ${filterCat === 'all' ? 'active' : ''}`} onClick={() => setFilterCat('all')}>{t.common.all}</button>
          {categories.map(c => (
            <button key={c.id} className={`filter-tab ${filterCat === c.id ? 'active' : ''}`} onClick={() => setFilterCat(c.id)}>
              {c.emoji} {c.name_th}
            </button>
          ))}
        </div>

        {filtered.map(item => (
          <div key={item.id} className="manage-item" onClick={() => openEdit(item)}>
            {item.image
              ? <img className="item-thumb" src={item.image} alt="" />
              : <div className="item-thumb-empty">{getCatEmoji(item.category)}</div>
            }
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{lang === 'shn' ? item.name_mm : item.name_th}</div>
              <div className="manage-meta">{getCatName(item.category)} · {item.supplier}</div>
            </div>
            <svg style={{ width: 16, height: 16, color: 'var(--secondary)', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        ))}
      </div>

      <BottomSheet open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t.manage.editTitle : t.manage.addBtn}>
        {/* Image */}
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label className="image-upload-wrap" style={{ cursor: 'pointer' }}>
            {fImage
              ? <img src={fImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div className="image-upload-placeholder">📷<span>เพิ่มรูป</span></div>
            }
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
          </label>
          {fImage && <button onClick={() => setFImage(null)} style={{ background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: 13 }}>ลบรูป</button>}
        </div>

        <div className="form-group">
          <label className="form-label">{t.manage.name_th}</label>
          <input className="form-input" value={fNameTh} onChange={e => setFNameTh(e.target.value)} placeholder="ชื่อภาษาไทย" />
        </div>
        <div className="form-group">
          <label className="form-label">{t.manage.name_mm}</label>
          <input className="form-input" value={fNameMm} onChange={e => setFNameMm(e.target.value)} placeholder="ชื่อภาษาพม่า" />
        </div>
        <div className="form-group">
          <label className="form-label">{t.manage.category}</label>
          <select className="form-select" value={fCat} onChange={e => setFCat(e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name_th}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">{t.manage.supplier}</label>
          <select className="form-select" value={fSupplier} onChange={e => setFSupplier(e.target.value)}>
            {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
          <button onClick={() => setShowAddSupplier(!showAddSupplier)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4, padding: 0 }}>
            + เพิ่มผู้จำหน่ายใหม่
          </button>
          {showAddSupplier && (
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <input className="form-input" style={{ flex: 1 }} value={newSupplierName} onChange={e => setNewSupplierName(e.target.value)} placeholder="ชื่อผู้จำหน่าย" onKeyDown={e => e.key === 'Enter' && handleAddSupplier()} />
              <button onClick={handleAddSupplier} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '0 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>เพิ่ม</button>
            </div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">{t.manage.unit_th}</label>
            <input className="form-input" value={fUnitTh} onChange={e => setFUnitTh(e.target.value)} placeholder="กก., ขวด..." />
          </div>
          <div className="form-group">
            <label className="form-label">{t.manage.unit_mm}</label>
            <input className="form-input" value={fUnitMm} onChange={e => setFUnitMm(e.target.value)} placeholder="ကီလို..." />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t.manage.minStock}</label>
          <input className="form-input" type="number" value={fMinStock} onChange={e => setFMinStock(e.target.value)} placeholder="0" />
        </div>
        <button className="btn-primary" onClick={handleSave} style={{ marginBottom: 8 }}>{t.manage.save}</button>
        {editing && user?.role === 'super_admin' && <button className="btn-danger" style={{ width: '100%' }} onClick={handleDelete}>{t.manage.del}</button>}
      </BottomSheet>

      <BottomNav />
    </div>
  )
}
