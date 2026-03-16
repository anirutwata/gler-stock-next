'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { db } from '@/lib/supabase/client'

interface TelegramConfig {
  botToken: string
  chatId: string
}

interface TelegramContextType extends TelegramConfig {
  refresh: () => Promise<void>
  save: (botToken: string, chatId: string) => Promise<void>
}

const TelegramContext = createContext<TelegramContextType>({
  botToken: '', chatId: '',
  refresh: async () => {},
  save: async () => {},
})

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<TelegramConfig>({ botToken: '', chatId: '' })

  async function refresh() {
    try {
      const { data } = await db.from('config').select('*')
      if (data) {
        const bot = data.find((r: { key: string }) => r.key === 'telegram_bot_token')
        const chat = data.find((r: { key: string }) => r.key === 'telegram_chat_id')
        setConfig({
          botToken: bot?.value || '',
          chatId: chat?.value || '',
        })
      }
    } catch {}
  }

  async function save(botToken: string, chatId: string) {
    await db.from('config').upsert([
      { key: 'telegram_bot_token', value: botToken },
      { key: 'telegram_chat_id', value: chatId },
    ])
    setConfig({ botToken, chatId })
  }

  useEffect(() => { refresh() }, [])

  return (
    <TelegramContext.Provider value={{ ...config, refresh, save }}>
      {children}
    </TelegramContext.Provider>
  )
}

export function useTelegram() {
  return useContext(TelegramContext)
}
