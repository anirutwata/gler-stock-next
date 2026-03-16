'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User } from '@/lib/types'

interface UserContextType {
  user: User | null
  setUser: (u: User) => void
  clearUser: () => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  clearUser: () => {},
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('gler_session')
    if (saved) {
      try { setUserState(JSON.parse(saved)) } catch {}
    }
  }, [])

  function setUser(u: User) {
    sessionStorage.setItem('gler_session', JSON.stringify(u))
    setUserState(u)
  }

  function clearUser() {
    sessionStorage.removeItem('gler_session')
    setUserState(null)
  }

  return <UserContext.Provider value={{ user, setUser, clearUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext)
}
