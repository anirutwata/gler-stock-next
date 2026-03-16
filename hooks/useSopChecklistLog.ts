import { db } from '@/lib/supabase/client'
import { genId } from '@/lib/utils'
import type { SopChecklistLog } from '@/lib/types'

export function useSopChecklistLog() {
  async function saveLog(sopId: string, userName: string, userRole: string) {
    await db.from('sop_checklist_logs').insert({
      id: genId(),
      sop_id: sopId,
      user_name: userName,
      user_role: userRole,
      completed_at: new Date().toISOString(),
    })
  }

  async function getLastLog(sopId: string): Promise<SopChecklistLog | null> {
    const { data } = await db
      .from('sop_checklist_logs')
      .select('*')
      .eq('sop_id', sopId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single()
    return data as SopChecklistLog | null
  }

  return { saveLog, getLastLog }
}
