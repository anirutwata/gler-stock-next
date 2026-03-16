'use client'
import { useState, useEffect, useRef } from 'react'
import { useSops } from '@/hooks/useSops'
import { useSopCategories } from '@/hooks/useSopCategories'
import { useLang } from '@/context/LangContext'
import { useToast } from '@/hooks/useToast'
import { T } from '@/lib/translations'
import { genId, compressImage } from '@/lib/utils'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import BottomSheet from '@/components/BottomSheet'
import ToastList from '@/components/Toast'
import type { Sop, SopStep } from '@/lib/types'

const ROLES = ['kitchen', 'service', 'super_admin'] as const
const ROLE_LABELS: Record<string, string> = { kitchen: '🍳 ครัว', service: '🛎️ Service', super_admin: '👑 Super Admin' }

export default function ManageSopPage() {
  const { sops, loading, loadAll, saveSop, deleteSop } = useSops()
  const { categories, addCategory, deleteCategory } = useSopCategories()
  const { lang } = useLang()
  const { toasts, showToast } = useToast()
  const t = T[lang]

  const [filterCat, setFilterCat] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [editing, setEditing] = useState<Sop | null>(null)
  const [saving, setSaving] = useState(false)

  // SOP form state
  const [fTitle, setFTitle] = useState('')
  const [fDesc, setFDesc] = useState('')
  const [fCatId, setFCatId] = useState('')
  const [fRoles, setFRoles] = useState<string[]>(['kitchen', 'service', 'super_admin'])
  const [fSteps, setFSteps] = useState<SopStep[]>([])

  // Category form state
  const [newCatName, setNewCatName] = useState('')
  const [newCatEmoji, setNewCatEmoji] = useState('')
  const [newCatChecklist, setNewCatChecklist] = useState(false)

  const imgRefs = useRef<Record<number, HTMLInputElement | null>>({})

  useEffect(() => { loadAll() }, [])

  const filtered = filterCat === 'all' ? sops : sops.filter(s => s.category_id === filterCat)

  function openAdd() {
    setEditing(null)
    setFTitle(''); setFDesc(''); setFCatId(categories[0]?.id || ''); setFRoles(['kitchen', 'service', 'super_admin'])
    setFSteps([])
    setModalOpen(true)
  }

  function openEdit(sop: Sop) {
    setEditing(sop)
    setFTitle(sop.title_th); setFDesc(sop.description_th); setFCatId(sop.category_id)
    setFRoles(sop.visible_roles)
    // Load steps
    import('@/lib/supabase/client').then(({ db }) => {
      db.from('sop_steps').select('*').eq('sop_id', sop.id).order('step_order').then(({ data }) => {
        setFSteps((data || []) as SopStep[])
      })
    })
    setModalOpen(true)
  }

  function toggleRole(role: string) {
    setFRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    )
  }

  function addStep() {
    setFSteps(prev => [...prev, { id: genId(), sop_id: '', step_order: prev.length, text_th: '', image: null, note_th: '' }])
  }

  function updateStep(index: number, field: keyof SopStep, value: string | null) {
    setFSteps(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  function deleteStep(index: number) {
    setFSteps(prev => prev.filter((_, i) => i !== index))
  }

  function moveStep(index: number, dir: -1 | 1) {
    const next = [...fSteps]
    const swap = index + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[index], next[swap]] = [next[swap], next[index]]
    setFSteps(next)
  }

  async function handleStepImage(index: number, file: File) {
    const compressed = await compressImage(file, 800)
    updateStep(index, 'image', compressed)
  }

  async function handleSave() {
    if (!fTitle.trim()) { showToast('กรุณากรอกชื่อ SOP', 'error'); return }
    if (!fCatId) { showToast('กรุณาเลือกหมวดหมู่', 'error'); return }
    if (fRoles.length === 0) { showToast('กรุณาเลือกตำแหน่งที่เห็น SOP นี้', 'error'); return }
    setSaving(true)
    await saveSop(
      { id: editing?.id ?? undefined, category_id: fCatId, title_th: fTitle.trim(), description_th: fDesc.trim(), visible_roles: fRoles },
      fSteps
    )
    await loadAll()
    showToast(editing ? 'แก้ไข SOP แล้ว ✓' : 'เพิ่ม SOP แล้ว ✓', 'success')
    setSaving(false)
    setModalOpen(false)
  }

  async function handleDelete() {
    if (!editing || !confirm(t.sop.delConfirm)) return
    await deleteSop(editing.id)
    showToast('ลบ SOP แล้ว', 'success')
    setModalOpen(false)
  }

  async function handleAddCat() {
    if (!newCatName.trim()) return
    await addCategory(newCatName.trim(), newCatEmoji.trim(), newCatChecklist)
    setNewCatName(''); setNewCatEmoji(''); setNewCatChecklist(false)
    showToast('เพิ่มหมวดหมู่แล้ว ✓', 'success')
  }

  async function handleDeleteCat(id: string) {
    if (!confirm(t.sop.catDelConfirm)) return
    await deleteCategory(id)
    showToast('ลบหมวดหมู่แล้ว', 'success')
  }

  return (
    <div className="app-shell">
      <AppHeader />
      <ToastList toasts={toasts} />
      <div className="page-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div className="page-title" style={{ marginBottom: 2 }}>{t.sop.manageTitle}</div>
            <div className="page-sub">{t.sop.manageSub}</div>
          </div>
          <button onClick={openAdd} className="btn-primary" style={{ flexShrink: 0, padding: '10px 14px', fontSize: 13 }}>
            + {t.sop.addSop}
          </button>
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
          <button
            onClick={() => setFilterCat('all')}
            style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${filterCat === 'all' ? 'var(--primary)' : 'var(--border)'}`, background: filterCat === 'all' ? 'rgba(153,47,24,0.08)' : 'var(--bg-light)', color: filterCat === 'all' ? 'var(--primary)' : 'var(--dark)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            ทั้งหมด
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setFilterCat(c.id)}
              style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${filterCat === c.id ? 'var(--primary)' : 'var(--border)'}`, background: filterCat === c.id ? 'rgba(153,47,24,0.08)' : 'var(--bg-light)', color: filterCat === c.id ? 'var(--primary)' : 'var(--dark)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {c.emoji} {c.name_th}
            </button>
          ))}
        </div>

        {/* Manage categories button */}
        <button
          onClick={() => setCatModalOpen(true)}
          style={{ width: '100%', marginBottom: 16, padding: '10px', border: '1.5px dashed var(--border)', borderRadius: 10, background: 'transparent', color: 'var(--secondary)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          ⚙️ {t.sop.manageCat}
        </button>

        {/* SOP list */}
        {loading && <p style={{ textAlign: 'center', color: 'var(--secondary)', padding: '40px 0' }}>กำลังโหลด...</p>}
        {!loading && filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--secondary)', padding: '40px 0' }}>{t.sop.noSops}</p>
        )}
        {filtered.map(sop => {
          const cat = categories.find(c => c.id === sop.category_id)
          return (
            <div
              key={sop.id}
              onClick={() => openEdit(sop)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--bg-light)', borderRadius: 12, marginBottom: 10, cursor: 'pointer', border: '1.5px solid transparent' }}
            >
              <span style={{ fontSize: 22 }}>{cat?.emoji || '📋'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>{sop.title_th}</div>
                <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{cat?.name_th || ''}{sop.description_th ? ` · ${sop.description_th}` : ''}</div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16, color: 'var(--secondary)' }}><polyline points="9 18 15 12 9 6" /></svg>
            </div>
          )
        })}
      </div>

      {/* SOP Edit BottomSheet */}
      <BottomSheet open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `แก้ไข: ${editing.title_th}` : t.sop.addSop}>
        <div className="form-group">
          <label className="form-label">{t.sop.sopTitle} *</label>
          <input className="form-input" value={fTitle} onChange={e => setFTitle(e.target.value)} placeholder="เช่น เปิดร้านเช้า" />
        </div>

        <div className="form-group">
          <label className="form-label">{t.sop.sopDesc}</label>
          <input className="form-input" value={fDesc} onChange={e => setFDesc(e.target.value)} placeholder="คำอธิบายสั้น ๆ..." />
        </div>

        <div className="form-group">
          <label className="form-label">{t.sop.sopCategory} *</label>
          <select className="form-input" value={fCatId} onChange={e => setFCatId(e.target.value)}>
            <option value="">-- เลือกหมวดหมู่ --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name_th}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">แสดงสำหรับตำแหน่ง *</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ROLES.map(role => (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                style={{ padding: '6px 12px', borderRadius: 8, border: `1.5px solid ${fRoles.includes(role) ? 'var(--primary)' : 'var(--border)'}`, background: fRoles.includes(role) ? 'rgba(153,47,24,0.08)' : 'var(--bg-light)', color: fRoles.includes(role) ? 'var(--primary)' : 'var(--dark)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {ROLE_LABELS[role]}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>ขั้นตอน ({fSteps.length})</div>
          {fSteps.map((step, i) => (
            <div key={step.id} style={{ background: 'var(--bg-light)', borderRadius: 10, padding: 12, marginBottom: 10, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                <span style={{ flex: 1, fontSize: 12, color: 'var(--secondary)' }}>ขั้นตอนที่ {i + 1}</span>
                <button onClick={() => moveStep(i, -1)} disabled={i === 0} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)', padding: '0 4px', fontSize: 14 }}>▲</button>
                <button onClick={() => moveStep(i, 1)} disabled={i === fSteps.length - 1} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)', padding: '0 4px', fontSize: 14 }}>▼</button>
                <button onClick={() => deleteStep(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c62828', padding: '0 4px', fontSize: 14, fontWeight: 700 }}>✕</button>
              </div>

              <textarea
                className="form-input"
                rows={2}
                style={{ resize: 'none', marginBottom: 8, fontSize: 13 }}
                value={step.text_th}
                onChange={e => updateStep(i, 'text_th', e.target.value)}
                placeholder={t.sop.stepText}
              />

              {step.image ? (
                <div style={{ position: 'relative', marginBottom: 8 }}>
                  <img src={step.image} alt="" style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover' }} />
                  <button
                    onClick={() => updateStep(i, 'image', null)}
                    style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', color: '#fff', width: 24, height: 24, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >✕</button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={el => { imgRefs.current[i] = el }}
                    style={{ display: 'none' }}
                    onChange={e => e.target.files?.[0] && handleStepImage(i, e.target.files[0])}
                  />
                  <button
                    onClick={() => imgRefs.current[i]?.click()}
                    style={{ width: '100%', padding: '8px', border: '1.5px dashed var(--border)', borderRadius: 8, background: 'transparent', color: 'var(--secondary)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 8 }}
                  >
                    📷 {t.sop.uploadImg}
                  </button>
                </>
              )}

              <input
                className="form-input"
                style={{ fontSize: 12 }}
                value={step.note_th}
                onChange={e => updateStep(i, 'note_th', e.target.value)}
                placeholder={t.sop.stepNote}
              />
            </div>
          ))}

          <button
            onClick={addStep}
            style={{ width: '100%', padding: '10px', border: '1.5px dashed var(--primary)', borderRadius: 10, background: 'rgba(153,47,24,0.04)', color: 'var(--primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 16 }}
          >
            {t.sop.addStep}
          </button>
        </div>

        <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ marginBottom: editing ? 10 : 0 }}>
          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
        {editing && (
          <button
            onClick={handleDelete}
            style={{ width: '100%', padding: 12, border: '1.5px solid #c62828', borderRadius: 10, background: 'transparent', color: '#c62828', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            🗑️ {t.sop.delSop}
          </button>
        )}
      </BottomSheet>

      {/* Category management BottomSheet */}
      <BottomSheet open={catModalOpen} onClose={() => setCatModalOpen(false)} title={t.sop.manageCat}>
        <div style={{ marginBottom: 16 }}>
          {categories.map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 20 }}>{c.emoji}</span>
              <span style={{ flex: 1, fontSize: 14 }}>{c.name_th}</span>
              {c.has_checklist && <span style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 700 }}>CHECKLIST</span>}
              <button onClick={() => handleDeleteCat(c.id)} style={{ background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: 18, padding: '4px 8px' }}>✕</button>
            </div>
          ))}
        </div>

        <div className="form-group">
          <label className="form-label">{t.sop.addCat}</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              className="form-input"
              style={{ width: 54, flexShrink: 0, textAlign: 'center', fontSize: 18, padding: '8px 4px' }}
              value={newCatEmoji}
              onChange={e => setNewCatEmoji(e.target.value)}
              placeholder="📋"
            />
            <input
              className="form-input"
              style={{ flex: 1 }}
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              placeholder="ชื่อหมวดหมู่..."
              onKeyDown={e => e.key === 'Enter' && handleAddCat()}
            />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--dark)', cursor: 'pointer', marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={newCatChecklist}
              onChange={e => setNewCatChecklist(e.target.checked)}
              style={{ accentColor: 'var(--primary)', width: 16, height: 16 }}
            />
            {t.sop.catChecklist}
          </label>
          <button
            onClick={handleAddCat}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            {t.sop.addCat}
          </button>
        </div>
      </BottomSheet>

      <BottomNav />
    </div>
  )
}
