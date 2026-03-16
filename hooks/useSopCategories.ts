import { useState, useEffect } from 'react'
import { db } from '@/lib/supabase/client'
import { genId } from '@/lib/utils'
import type { SopCategory } from '@/lib/types'

export function useSopCategories() {
  const [categories, setCategories] = useState<SopCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    db.from('sop_categories').select('*').order('sort_order').then(({ data, error }) => {
      if (!error && data) setCategories(data as SopCategory[])
      setLoading(false)
    })
  }, [])

  async function addCategory(name_th: string, emoji: string, has_checklist: boolean) {
    const cat: SopCategory = {
      id: genId(),
      name_th,
      emoji: emoji || '📋',
      has_checklist,
      sort_order: categories.length,
    }
    setCategories(prev => [...prev, cat])
    await db.from('sop_categories').insert(cat)
    return cat
  }

  async function updateCategory(id: string, data: Partial<SopCategory>) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
    await db.from('sop_categories').update(data).eq('id', id)
  }

  async function deleteCategory(id: string) {
    setCategories(prev => prev.filter(c => c.id !== id))
    await db.from('sop_categories').delete().eq('id', id)
  }

  function getCat(id: string) {
    return categories.find(c => c.id === id)
  }

  return { categories, loading, addCategory, updateCategory, deleteCategory, getCat }
}
