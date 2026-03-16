import { useState, useEffect } from 'react'
import { db } from '@/lib/supabase/client'
import { genId } from '@/lib/utils'
import { DEFAULT_SUPPLIERS } from '@/lib/defaultData'
import type { Supplier } from '@/lib/types'

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('gler_suppliers')
    if (saved) setSuppliers(JSON.parse(saved))

    db.from('suppliers').select('*').order('name').then(({ data, error }) => {
      if (!error && data) {
        let sups: Supplier[]
        if (data.length === 0) {
          sups = DEFAULT_SUPPLIERS.map(s => ({ ...s }))
          db.from('suppliers').insert(sups)
        } else {
          sups = data as Supplier[]
        }
        localStorage.setItem('gler_suppliers', JSON.stringify(sups))
        setSuppliers(sups)
      }
    })
  }, [])

  async function addSupplier(name: string) {
    const sup: Supplier = { id: genId(), name }
    const updated = [...suppliers, sup].sort((a, b) => a.name.localeCompare(b.name, 'th'))
    setSuppliers(updated)
    localStorage.setItem('gler_suppliers', JSON.stringify(updated))
    await db.from('suppliers').insert(sup)
    return sup
  }

  async function deleteSupplier(id: string) {
    const updated = suppliers.filter(s => s.id !== id)
    setSuppliers(updated)
    localStorage.setItem('gler_suppliers', JSON.stringify(updated))
    await db.from('suppliers').delete().eq('id', id)
  }

  return { suppliers, addSupplier, deleteSupplier }
}
