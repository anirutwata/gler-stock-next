import { useState } from 'react'
import { db } from '@/lib/supabase/client'
import { genId } from '@/lib/utils'
import type { Sop, SopStep, SopWithSteps } from '@/lib/types'

export function useSops() {
  const [sops, setSops] = useState<Sop[]>([])
  const [loading, setLoading] = useState(true)

  async function loadAll() {
    const { data } = await db.from('sops').select('*').order('created_at', { ascending: false })
    if (data) setSops(data as Sop[])
    setLoading(false)
  }

  async function loadByRole(role: string) {
    const { data } = await db.from('sops').select('*').order('created_at', { ascending: false })
    if (data) setSops((data as Sop[]).filter(s => s.visible_roles.includes(role)))
    setLoading(false)
  }

  async function loadWithSteps(id: string): Promise<SopWithSteps | null> {
    const [{ data: sop }, { data: steps }] = await Promise.all([
      db.from('sops').select('*').eq('id', id).single(),
      db.from('sop_steps').select('*').eq('sop_id', id).order('step_order'),
    ])
    if (!sop) return null
    return { ...(sop as Sop), steps: (steps || []) as SopStep[] }
  }

  async function saveSop(sopData: Omit<Sop, 'created_at' | 'id'> & { id?: string }, steps: SopStep[]): Promise<string> {
    const id = sopData.id || genId()
    const record = { ...sopData, id }
    await db.from('sops').upsert(record)
    await db.from('sop_steps').delete().eq('sop_id', id)
    if (steps.length > 0) {
      await db.from('sop_steps').insert(
        steps.map((s, i) => ({ ...s, id: s.id || genId(), sop_id: id, step_order: i }))
      )
    }
    return id
  }

  async function deleteSop(id: string) {
    await db.from('sops').delete().eq('id', id)
    setSops(prev => prev.filter(s => s.id !== id))
  }

  return { sops, loading, loadAll, loadByRole, loadWithSteps, saveSop, deleteSop }
}
