'use client'
import { useUser } from '@/context/UserContext'
import { useLang } from '@/context/LangContext'
import { T } from '@/lib/translations'
import { useRouter } from 'next/navigation'

export default function AppHeader() {
  const { user, clearUser } = useUser()
  const { lang, setLang } = useLang()
  const router = useRouter()
  const t = T[lang]

  function handleLogout() {
    if (confirm('ออกจากระบบ?')) {
      clearUser()
      router.replace('/login')
    }
  }

  return (
    <header className="app-header">
      <div>
        <div className="brand-name">{t.appName}</div>
        <div className="brand-sub">{t.appSub}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {user && (
          <button className="user-chip" onClick={handleLogout} title="ออกจากระบบ">
            👤 <span>{user.name}</span>
          </button>
        )}
        <div className="lang-toggle">
          <button className={`lang-btn ${lang === 'th' ? 'active' : ''}`} onClick={() => setLang('th')}>TH</button>
          <button className={`lang-btn ${lang === 'shn' ? 'active' : ''}`} onClick={() => setLang('shn')}>SHN</button>
        </div>
      </div>
    </header>
  )
}
