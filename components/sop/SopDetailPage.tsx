'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSops } from '@/hooks/useSops'
import { useSopCategories } from '@/hooks/useSopCategories'
import { useSopChecklistLog } from '@/hooks/useSopChecklistLog'
import { useUser } from '@/context/UserContext'
import { useLang } from '@/context/LangContext'
import { useToast } from '@/hooks/useToast'
import { T } from '@/lib/translations'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import ToastList from '@/components/Toast'
import type { SopWithSteps, SopChecklistLog } from '@/lib/types'

export default function SopDetailPage({ id }: { id: string }) {
  const { loadWithSteps } = useSops()
  const { getCat } = useSopCategories()
  const { saveLog, getLastLog } = useSopChecklistLog()
  const { user } = useUser()
  const { lang } = useLang()
  const { toasts, showToast } = useToast()
  const router = useRouter()
  const t = T[lang]

  const [sop, setSop] = useState<SopWithSteps | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastLog, setLastLog] = useState<SopChecklistLog | null>(null)
  const [checklistMode, setChecklistMode] = useState(false)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadWithSteps(id).then(data => {
      setSop(data)
      setLoading(false)
    })
    getLastLog(id).then(log => setLastLog(log))
  }, [id])

  const category = sop ? getCat(sop.category_id) : undefined
  const allChecked = sop ? checked.size === sop.steps.length && sop.steps.length > 0 : false

  function toggleCheck(stepId: string) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(stepId)) next.delete(stepId)
      else next.add(stepId)
      return next
    })
  }

  async function handleSaveChecklist() {
    if (!user || !sop) return
    setSaving(true)
    await saveLog(sop.id, user.name, user.role)
    showToast(t.sop.checklistSaved, 'success')
    setChecklistMode(false)
    setChecked(new Set())
    const log = await getLastLog(id)
    setLastLog(log)
    setSaving(false)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="app-shell">
        <AppHeader />
        <div className="page-content">
          <p style={{ textAlign: 'center', color: 'var(--secondary)', padding: '60px 0' }}>กำลังโหลด...</p>
        </div>
        <BottomNav />
      </div>
    )
  }

  if (!sop) {
    return (
      <div className="app-shell">
        <AppHeader />
        <div className="page-content">
          <p style={{ textAlign: 'center', color: 'var(--secondary)', padding: '60px 0' }}>ไม่พบ SOP นี้</p>
          <button className="btn-secondary" onClick={() => router.back()}>← กลับ</button>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <AppHeader />
      <ToastList toasts={toasts} />
      <div className="page-content" style={{ paddingBottom: checklistMode ? 100 : 80 }}>
        {/* Back + title */}
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', fontSize: 14, padding: '0 0 12px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><polyline points="15 18 9 12 15 6" /></svg>
          กลับ
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
          <div>
            {category && (
              <div style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 4 }}>{category.emoji} {category.name_th}</div>
            )}
            <div className="page-title" style={{ marginBottom: 4 }}>{sop.title_th}</div>
            {sop.description_th && (
              <div className="page-sub">{sop.description_th}</div>
            )}
          </div>
          {category?.has_checklist && (
            <button
              onClick={() => { setChecklistMode(m => !m); setChecked(new Set()) }}
              style={{ flexShrink: 0, fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 8, border: `1.5px solid ${checklistMode ? 'var(--primary)' : 'var(--border)'}`, background: checklistMode ? 'rgba(153,47,24,0.08)' : 'var(--bg-light)', color: checklistMode ? 'var(--primary)' : 'var(--secondary)', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              ☑️ ตรวจสอบ
            </button>
          )}
        </div>

        {/* Last log */}
        {lastLog && (
          <div style={{ fontSize: 11, color: 'var(--secondary)', background: 'var(--bg-light)', padding: '6px 10px', borderRadius: 8, marginBottom: 16 }}>
            {t.sop.lastDone} <strong>{lastLog.user_name}</strong> · {formatDate(lastLog.completed_at)}
          </div>
        )}

        {/* Steps */}
        <div style={{ marginTop: 8 }}>
          {sop.steps.map((step, i) => {
            const isChecked = checked.has(step.id)
            return (
              <div
                key={step.id}
                style={{
                  background: checklistMode && isChecked ? 'rgba(46,125,50,0.06)' : 'var(--bg-light)',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  border: checklistMode && isChecked ? '1.5px solid rgba(46,125,50,0.3)' : '1.5px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  {checklistMode && (
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCheck(step.id)}
                      style={{ width: 20, height: 20, accentColor: 'var(--primary)', flexShrink: 0, marginTop: 2, cursor: 'pointer' }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)', lineHeight: 1.5 }}>{step.text_th}</span>
                    </div>
                    {step.image && (
                      <img
                        src={step.image}
                        alt={`ขั้นตอนที่ ${i + 1}`}
                        style={{ width: '100%', borderRadius: 8, marginBottom: step.note_th ? 8 : 0, objectFit: 'cover', maxHeight: 260 }}
                      />
                    )}
                    {step.note_th && (
                      <div style={{ fontSize: 12, color: 'var(--secondary)', background: '#fff8e1', padding: '6px 10px', borderRadius: 6, borderLeft: '3px solid #f9a825' }}>
                        💡 {step.note_th}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {sop.steps.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--secondary)', padding: '40px 0' }}>ยังไม่มีขั้นตอน</p>
          )}
        </div>
      </div>

      {/* Sticky checklist save button */}
      {checklistMode && (
        <div className="bottom-btn-wrap">
          <button
            className="btn-primary"
            onClick={handleSaveChecklist}
            disabled={!allChecked || saving}
            style={{ opacity: allChecked ? 1 : 0.5 }}
          >
            {saving ? 'กำลังบันทึก...' : `${t.sop.checklistSave} (${checked.size}/${sop.steps.length})`}
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
