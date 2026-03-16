'use client'
import { useMemo } from 'react'
import { useItems } from '@/hooks/useItems'
import { useSessions } from '@/hooks/useSessions'
import { useCategories } from '@/hooks/useCategories'
import { useLang } from '@/context/LangContext'
import { getStatus } from '@/lib/utils'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'

export default function DashboardPage() {
  const { items } = useItems()
  const { sessions } = useSessions()
  const { categories, getCatName } = useCategories()
  const { lang } = useLang()

  const stats = useMemo(() => {
    let ok = 0, low = 0, empty = 0, uncounted = 0
    items.forEach(item => {
      const s = getStatus(item)
      if (s === 'ok') ok++
      else if (s === 'low') low++
      else if (s === 'empty') empty++
      else uncounted++
    })
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const thisWeek = sessions.filter(s => s.created_at > weekAgo).length
    return { total: items.length, ok, low, empty, uncounted, thisWeek }
  }, [items, sessions])

  const catChartData = useMemo(() => {
    return categories.map(cat => {
      const catItems = items.filter(i => i.category === cat.id)
      const ok = catItems.filter(i => getStatus(i) === 'ok').length
      const low = catItems.filter(i => getStatus(i) === 'low').length
      const empty = catItems.filter(i => getStatus(i) === 'empty').length
      return { name: cat.emoji + ' ' + cat.name_th.slice(0, 6), ok, low, empty }
    }).filter(d => d.ok + d.low + d.empty > 0)
  }, [items, categories])

  const sessionChartData = useMemo(() => {
    const days: Record<string, { stock: number; order: number }> = {}
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const key = d.toLocaleDateString('th-TH', { month: 'numeric', day: 'numeric' })
      days[key] = { stock: 0, order: 0 }
    }
    sessions.forEach(s => {
      const d = new Date(s.created_at)
      const key = d.toLocaleDateString('th-TH', { month: 'numeric', day: 'numeric' })
      if (days[key]) days[key][s.type]++
    })
    return Object.entries(days).map(([date, v]) => ({ date, ...v }))
  }, [sessions])

  const recentSessions = sessions.slice(0, 5)

  // suppress unused variable warning
  void lang
  void getCatName

  return (
    <div className="app-shell">
      <AppHeader />
      <div className="page-content">
        <div className="page-title">📊 ภาพรวม</div>
        <div className="page-sub">สรุปข้อมูลสต็อกและการสั่งซื้อ</div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <div className="stat-card">
            <div className="stat-label">รายการทั้งหมด</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-sub">สินค้า</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">เช็คสัปดาห์นี้</div>
            <div className="stat-value">{stats.thisWeek}</div>
            <div className="stat-sub">ครั้ง</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid #f57c00' }}>
            <div className="stat-label">สต็อกต่ำ</div>
            <div className="stat-value" style={{ color: '#f57c00' }}>{stats.low}</div>
            <div className="stat-sub">รายการ</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid #d32f2f' }}>
            <div className="stat-label">หมดสต็อก</div>
            <div className="stat-value" style={{ color: '#d32f2f' }}>{stats.empty}</div>
            <div className="stat-sub">รายการ</div>
          </div>
        </div>

        {/* Bar chart */}
        {catChartData.length > 0 && (
          <div className="dash-chart-card">
            <div className="dash-chart-title">สต็อกตามหมวดหมู่</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={catChartData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="ok" fill="#388e3c" name="ปกติ" stackId="a" />
                <Bar dataKey="low" fill="#f57c00" name="ต่ำ" stackId="a" />
                <Bar dataKey="empty" fill="#d32f2f" name="หมด" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Line chart */}
        {sessionChartData.length > 0 && (
          <div className="dash-chart-card">
            <div className="dash-chart-title">กิจกรรม 14 วันล่าสุด</div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={sessionChartData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={1} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="stock" stroke="#992F18" name="สต็อก" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="order" stroke="#A3772F" name="สั่งซื้อ" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent sessions */}
        {recentSessions.length > 0 && (
          <div>
            <div className="section-title">กิจกรรมล่าสุด</div>
            {recentSessions.map(s => (
              <div key={s.id} className="session-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`session-badge ${s.type}`}>{s.type === 'stock' ? '📦 สต็อก' : '🛒 สั่งซื้อ'}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>👤 {s.person_name}</span>
                  <span style={{ fontSize: 11, color: 'var(--secondary)' }}>{new Date(s.created_at).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
