import type { Item } from './types'

export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function getStatus(item: Item): 'empty' | 'low' | 'ok' | 'unknown' {
  if (item.currentStock === null || item.currentStock === undefined) return 'unknown'
  const s = parseFloat(String(item.currentStock))
  if (s <= 0) return 'empty'
  if (s <= item.minStock) return 'low'
  return 'ok'
}

export function statusDotColor(status: string): string {
  if (status === 'empty') return 'dot-red'
  if (status === 'low') return 'dot-yellow'
  if (status === 'ok') return 'dot-green'
  return 'dot-grey'
}

export function compressImage(file: File, maxSize = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.72))
      }
      img.onerror = reject
      img.src = e.target!.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function itemToDb(item: Item) {
  return {
    id: item.id,
    name_th: item.name_th,
    name_mm: item.name_mm || '',
    category: item.category || '',
    supplier: item.supplier || '',
    unit_th: item.unit_th || '',
    unit_mm: item.unit_mm || '',
    min_stock: item.minStock || 0,
    current_stock: item.currentStock ?? null,
    image: item.image || null,
  }
}

export function itemFromDb(r: Record<string, unknown>): Item {
  return {
    id: r.id as string,
    name_th: r.name_th as string,
    name_mm: (r.name_mm as string) || '',
    category: (r.category as string) || '',
    supplier: (r.supplier as string) || '',
    unit_th: (r.unit_th as string) || '',
    unit_mm: (r.unit_mm as string) || '',
    minStock: (r.min_stock as number) || 0,
    currentStock: r.current_stock as number | null,
    image: (r.image as string) || null,
  }
}
