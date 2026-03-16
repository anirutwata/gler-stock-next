'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { useLang } from '@/context/LangContext'
import { T } from '@/lib/translations'

const navIcons = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  stock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
  order: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  history: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  manage: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>,
}

export default function BottomNav() {
  const { user } = useUser()
  const { lang } = useLang()
  const pathname = usePathname()
  const t = T[lang]

  if (!user) return null

  const allNavItems = [
    { href: '/dashboard', label: t.nav.dashboard, icon: navIcons.dashboard, roles: ['super_admin'] },
    { href: '/stock', label: t.nav.stock, icon: navIcons.stock, roles: ['kitchen', 'super_admin'] },
    { href: '/order', label: t.nav.order, icon: navIcons.order, roles: ['service', 'super_admin'] },
    { href: '/history', label: t.nav.history, icon: navIcons.history, roles: ['kitchen', 'service', 'super_admin'] },
    { href: '/manage', label: t.nav.manage, icon: navIcons.manage, roles: ['super_admin'] },
    { href: '/settings', label: t.nav.settings, icon: navIcons.settings, roles: ['super_admin'] },
  ]

  const navItems = allNavItems.filter(item => item.roles.includes(user.role))

  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <Link key={item.href} href={item.href} className={`nav-item ${pathname === item.href ? 'active' : ''}`}>
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
