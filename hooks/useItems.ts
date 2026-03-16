'use client'
import { useState, useEffect, useCallback } from 'react'
import { db } from '@/lib/supabase/client'
import { itemFromDb, itemToDb, genId } from '@/lib/utils'
import { DEFAULT_ITEMS } from '@/lib/defaultData'
import type { Item } from '@/lib/types'

export function useItems() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    // Load from localStorage first
    const saved = localStorage.getItem('gler_items')
    if (saved) {
      const parsed = JSON.parse(saved) as Item[]
      DEFAULT_ITEMS.forEach(di => {
        if (!parsed.find(i => i.id === di.id)) parsed.push({ ...di })
      })
      setItems(parsed)
    } else {
      setItems(DEFAULT_ITEMS.map(i => ({ ...i })))
    }
    setLoading(false)

    // Sync with Supabase
    try {
      const { data, error } = await db.from('items').select('*')
      if (!error && data) {
        let synced: Item[]
        if (data.length === 0) {
          synced = DEFAULT_ITEMS.map(i => ({ ...i }))
          await db.from('items').insert(synced.map(itemToDb))
        } else {
          synced = data.map(itemFromDb)
          DEFAULT_ITEMS.forEach(di => {
            if (!synced.find(i => i.id === di.id)) {
              const newItem = { ...di }
              synced.push(newItem)
              db.from('items').insert(itemToDb(newItem))
            }
          })
        }
        localStorage.setItem('gler_items', JSON.stringify(synced))
        setItems(synced)
      }
    } catch {}
  }, [])

  useEffect(() => {
    load()
    const channel = db.channel('items-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, (payload) => {
        setItems(prev => {
          let updated: Item[]
          if (payload.eventType === 'DELETE') {
            updated = prev.filter(i => i.id !== (payload.old as { id: string }).id)
          } else {
            const newItem = itemFromDb(payload.new as Record<string, unknown>)
            const idx = prev.findIndex(i => i.id === newItem.id)
            updated = idx >= 0 ? prev.map((it, i) => i === idx ? newItem : it) : [...prev, newItem]
          }
          localStorage.setItem('gler_items', JSON.stringify(updated))
          return updated
        })
      })
      .subscribe()
    return () => { db.removeChannel(channel) }
  }, [load])

  async function saveItem(item: Item) {
    const existing = items.find(i => i.id === item.id)
    const dbItem = itemToDb(item)
    if (existing) {
      await db.from('items').update(dbItem).eq('id', item.id)
      setItems(prev => {
        const updated = prev.map(i => i.id === item.id ? item : i)
        localStorage.setItem('gler_items', JSON.stringify(updated))
        return updated
      })
    } else {
      await db.from('items').insert(dbItem)
      setItems(prev => {
        const updated = [...prev, item]
        localStorage.setItem('gler_items', JSON.stringify(updated))
        return updated
      })
    }
  }

  async function deleteItem(id: string) {
    await db.from('items').delete().eq('id', id)
    setItems(prev => {
      const updated = prev.filter(i => i.id !== id)
      localStorage.setItem('gler_items', JSON.stringify(updated))
      return updated
    })
  }

  async function updateStock(id: string, value: number | null) {
    const item = items.find(i => i.id === id)
    if (!item) return
    const updated = { ...item, currentStock: value }
    await db.from('items').update({ current_stock: value }).eq('id', id)
    setItems(prev => {
      const next = prev.map(i => i.id === id ? updated : i)
      localStorage.setItem('gler_items', JSON.stringify(next))
      return next
    })
  }

  return { items, loading, saveItem, deleteItem, updateStock, reload: load }
}
