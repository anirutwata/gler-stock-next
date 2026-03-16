export type Role = 'kitchen' | 'service' | 'super_admin'

export interface User {
  name: string
  role: Role
}

export interface Item {
  id: string
  name_th: string
  name_mm: string
  category: string
  supplier: string
  unit_th: string
  unit_mm: string
  minStock: number
  currentStock: number | null
  image: string | null
}

export interface Category {
  id: string
  name_th: string
  emoji: string
  sort_order: number
}

export interface Supplier {
  id: string
  name: string
}

export interface Session {
  id: string
  type: 'stock' | 'order'
  person_name: string
  role: string | null
  created_at: string
  message: string
}
