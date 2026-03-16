'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import type { Role } from '@/lib/types'

const roles: { value: Role; label: string; emoji: string; desc: string }[] = [
  { value: 'kitchen', label: 'ครัว', emoji: '🍳', desc: 'เช็คสต็อกวัตถุดิบ' },
  { value: 'service', label: 'Service', emoji: '🫙', desc: 'สั่งซื้อวัตถุดิบ' },
  { value: 'super_admin', label: 'Super Admin', emoji: '👑', desc: 'ภาพรวมทั้งหมด' },
]

export default function LoginPage() {
  const { setUser } = useUser()
  const router = useRouter()
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role | null>(null)
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!name.trim()) { setError('กรุณากรอกชื่อ'); return }
    if (!role) { setError('กรุณาเลือกตำแหน่ง'); return }
    setUser({ name: name.trim(), role })
    if (role === 'kitchen') router.replace('/stock')
    else if (role === 'service') router.replace('/order')
    else router.replace('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
      maxWidth: 430,
      margin: '0 auto',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 72, height: 72,
          background: 'var(--primary)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: 32,
          boxShadow: '0 4px 16px rgba(153,47,24,0.3)',
        }}>🍖</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--primary)', margin: 0 }}>เกลอ ข้าวขาหมู</h1>
        <p style={{ fontSize: 13, color: 'var(--secondary)', marginTop: 4 }}>ระบบจัดการสต็อก</p>
      </div>

      <div style={{ width: '100%', background: 'white', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow-lg)' }}>
        <div className="form-group">
          <label className="form-label">ชื่อ / ชื่อเล่น</label>
          <input
            className="form-input"
            type="text"
            placeholder="กรอกชื่อของคุณ..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">ตำแหน่ง</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {roles.map(r => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${role === r.value ? 'var(--primary)' : 'var(--border)'}`,
                  background: role === r.value ? 'rgba(153,47,24,0.06)' : 'var(--bg-light)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 24 }}>{r.emoji}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: role === r.value ? 'var(--primary)' : 'var(--dark)' }}>{r.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{r.desc}</div>
                </div>
                {role === r.value && <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontSize: 18 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ color: '#c62828', fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <button className="btn-primary" onClick={handleSubmit}>
          เข้าใช้งาน
        </button>
      </div>
    </div>
  )
}
