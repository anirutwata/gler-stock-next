import { useState, useEffect } from 'react'
import { db } from '@/lib/supabase/client'
import { genId } from '@/lib/utils'
import type { Session } from '@/lib/types'

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    db.from('sessions').select('*').order('created_at', { ascending: false }).limit(100).then(({ data }) => {
      if (data) setSessions(data as Session[])
    })
  }, [])

  async function saveSession(type: 'stock' | 'order', personName: string, role: string, message: string) {
    const session: Session = {
      id: genId(),
      type,
      person_name: personName,
      role,
      created_at: new Date().toISOString(),
      message,
    }
    setSessions(prev => [session, ...prev])
    await db.from('sessions').insert(session)
    return session
  }

  return { sessions, saveSession }
}
