'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Lang } from '@/lib/translations'

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
}

const LangContext = createContext<LangContextType>({ lang: 'th', setLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('th')

  useEffect(() => {
    const saved = localStorage.getItem('gler_lang') as Lang
    if (saved === 'th' || saved === 'shn') setLangState(saved)
  }, [])

  function setLang(l: Lang) {
    localStorage.setItem('gler_lang', l)
    setLangState(l)
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
