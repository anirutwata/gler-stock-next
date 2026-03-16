'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSops } from '@/hooks/useSops'
import { useSopCategories } from '@/hooks/useSopCategories'
import { useUser } from '@/context/UserContext'
import { useLang } from '@/context/LangContext'
import { T } from '@/lib/translations'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'

export default function SopListPage() {
  const { sops, loading, loadByRole } = useSops()
  const { categories } = useSopCategories()
  const { user } = useUser()
  const { lang } = useLang()
  const router = useRouter()
  const t = T[lang]

  const [openCats, setOpenCats] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (user) loadByRole(user.role)
  }, [user])

  function toggleCat(id: string) {
    setOpenCats(prev => ({ ...prev, [id]: prev[id] === false ? true : false }))
  }

  function isCatOpen(id: string) {
    return openCats[id] !== false
  }

  const visibleCats = categories.filter(c => sops.some(s => s.category_id === c.id))

  return (
    <div className="app-shell">
      <AppHeader />
      <div className="page-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div className="page-title" style={{ marginBottom: 0 }}>{t.sop.title}</div>
          {user?.role === 'super_admin' && (
            <button
              onClick={() => router.push('/manage-sop')}
              style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', background: 'rgba(153,47,24,0.08)', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
            >
              ✏️ {t.sop.manageSop}
            </button>
          )}
        </div>
        <div className="page-sub" style={{ marginBottom: 16 }}>{t.sop.sub}</div>

        {loading && (
          <p style={{ textAlign: 'center', color: 'var(--secondary)', padding: '40px 0' }}>กำลังโหลด...</p>
        )}

        {!loading && visibleCats.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--secondary)', padding: '60px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div>{t.sop.noSops}</div>
            {user?.role === 'super_admin' && (
              <button
                onClick={() => router.push('/manage-sop')}
                className="btn-primary"
                style={{ marginTop: 20, display: 'inline-block' }}
              >
                {t.sop.addSop}
              </button>
            )}
          </div>
        )}

        {visibleCats.map(cat => {
          const catSops = sops.filter(s => s.category_id === cat.id)
          const isOpen = isCatOpen(cat.id)
          return (
            <div key={cat.id} className="cat-group">
              <div className="cat-header" onClick={() => toggleCat(cat.id)}>
                <div className="cat-header-left">{cat.emoji} {cat.name_th}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {cat.has_checklist && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--primary)', background: 'rgba(153,47,24,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                      {t.sop.checklistBadge}
                    </span>
                  )}
                  <span className="cat-count">{catSops.length}</span>
                  <svg className={`cat-chevron ${isOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                </div>
              </div>
              {isOpen && (
                <div className="cat-body">
                  {catSops.map(sop => (
                    <div
                      key={sop.id}
                      onClick={() => router.push(`/sop/${sop.id}`)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>{sop.title_th}</div>
                        {sop.description_th && (
                          <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 2 }}>{sop.description_th}</div>
                        )}
                      </div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16, color: 'var(--secondary)', flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <BottomNav />
    </div>
  )
}
