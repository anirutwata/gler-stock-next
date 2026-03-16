import { useState, useEffect } from 'react'
import { db } from '@/lib/supabase/client'
import { genId } from '@/lib/utils'
import { DEFAULT_CATEGORIES } from '@/lib/defaultData'
import type { Category } from '@/lib/types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('gler_categories')
    if (saved) setCategories(JSON.parse(saved))

    db.from('categories').select('*').order('sort_order').then(({ data, error }) => {
      if (!error && data) {
        let cats: Category[]
        if (data.length === 0) {
          cats = DEFAULT_CATEGORIES.map(c => ({ ...c }))
          db.from('categories').insert(cats)
        } else {
          cats = data as Category[]
        }
        localStorage.setItem('gler_categories', JSON.stringify(cats))
        setCategories(cats)
      } else if (categories.length === 0) {
        setCategories(DEFAULT_CATEGORIES.map(c => ({ ...c })))
      }
    })
  }, [])

  async function addCategory(name_th: string, emoji: string) {
    const cat: Category = { id: genId(), name_th, emoji: emoji || '📦', sort_order: categories.length }
    const updated = [...categories, cat]
    setCategories(updated)
    localStorage.setItem('gler_categories', JSON.stringify(updated))
    await db.from('categories').insert(cat)
    return cat
  }

  async function deleteCategory(id: string) {
    const updated = categories.filter(c => c.id !== id)
    setCategories(updated)
    localStorage.setItem('gler_categories', JSON.stringify(updated))
    await db.from('categories').delete().eq('id', id)
  }

  function getCatName(id: string) {
    return categories.find(c => c.id === id)?.name_th || id
  }

  function getCatEmoji(id: string) {
    return categories.find(c => c.id === id)?.emoji || '📦'
  }

  return { categories, addCategory, deleteCategory, getCatName, getCatEmoji }
}
