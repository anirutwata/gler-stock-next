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

export interface SopCategory {
  id: string
  name_th: string
  emoji: string
  has_checklist: boolean
  sort_order: number
}

export interface Sop {
  id: string
  category_id: string
  title_th: string
  description_th: string
  visible_roles: string[]
  created_at: string
}

export interface SopStep {
  id: string
  sop_id: string
  step_order: number
  text_th: string
  image: string | null
  note_th: string
}

export interface SopChecklistLog {
  id: string
  sop_id: string
  user_name: string
  user_role: string
  completed_at: string
}

export interface SopWithSteps extends Sop {
  steps: SopStep[]
}
