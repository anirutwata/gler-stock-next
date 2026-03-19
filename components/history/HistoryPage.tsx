'use client'
import { useState } from 'react'
import { useSessions } from '@/hooks/useSessions'
import { useLang } from '@/context/LangContext'
import { T } from '@/lib/translations'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'

const roleLabel: Record<string, string> = {
  kitchen: 'ครัว',
  service: 'Service',
  super_admin: 'Super Admin',
}

export default function HistoryPage() {
  const { sessions } = useSessions()
  const { lang } = useLang()
  const t = T[lang]
  const [filter, setFilter] = useState<'all' | 'stock' | 'order'>('all')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.type === filter)

  function toggleExpand(id: string) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="app-shell">
      <AppHeader />
      <div className="page-content">
        <div className="page-title">{lang === 'shn' ? 'ဝၢင်ႈၵၢၼ်' : 'ประวัติการทำงาน'}</div>
        <div className="page-sub">{lang === 'shn' ? 'ဝၢင်ႈၵၢၼ်ၸႅတ်ႈၶပ်ႉမၢႆလႄႈသင်ႈသိုဝ်ႈ' : 'บันทึกการเช็คสต็อกและสั่งซื้อ'}</div>

        <div className="filter-tabs">
          {(['all', 'stock', 'order'] as const).map(f => (
            <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? t.common.all : f === 'stock' ? '📦 ตรวจนับสต็อก' : '🛒 สั่งซื้อ'}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <p>ยังไม่มีประวัติ</p>
          </div>
        ) : (
          filtered.map(session => (
            <div key={session.id} className="session-card" onClick={() => toggleExpand(session.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className={`session-badge ${session.type}`}>
                  {session.type === 'stock' ? '📦 ตรวจนับสต็อก' : '🛒 สั่งซื้อ'}
                </span>
                {session.role && (
                  <span style={{ fontSize: 11, color: 'var(--secondary)', background: 'var(--bg-light)', padding: '2px 6px', borderRadius: 8 }}>
                    {roleLabel[session.role] || session.role}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>👤 {session.person_name}</div>
              <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 2 }}>🕐 {formatDate(session.created_at)}</div>
              {expanded[session.id] && (
                <pre className="session-message">{session.message}</pre>
              )}
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  )
}
