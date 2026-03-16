import type { Item, Category } from './types'
import { getStatus } from './utils'

export function buildStockMessage(items: Item[], categories: Category[], userName: string): string {
  const now = new Date()
  const dateStr = now.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
  const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })

  let msg = `📦 สรุปสต็อก เกลอ ข้าวขาหมู\n📅 ${dateStr} | ${timeStr} น.`
  if (userName) msg += `\n👤 ผู้นับ: ${userName}`
  msg += `\n━━━━━━━━━━━━━━━━\n`

  let totalCounted = 0, okCount = 0, lowCount = 0, emptyCount = 0

  categories.sort((a, b) => a.sort_order - b.sort_order).forEach(cat => {
    const catItems = items.filter(i => i.category === cat.id && i.currentStock !== null && i.currentStock !== undefined)
    if (catItems.length === 0) return
    msg += `\n${cat.emoji} ${cat.name_th}\n`
    catItems.forEach(item => {
      const s = parseFloat(String(item.currentStock))
      const status = getStatus(item)
      let icon = '✅'
      if (status === 'empty') { icon = '❌'; emptyCount++ }
      else if (status === 'low') { icon = '⚠️'; lowCount++ }
      else { okCount++ }
      const statusLabel = status === 'empty' ? ' (หมด!)' : status === 'low' ? ' (ต่ำ)' : ''
      msg += `• ${item.name_th}: ${s} ${item.unit_th} ${icon}${statusLabel}\n`
      totalCounted++
    })
  })

  if (totalCounted === 0) return ''

  msg += `\n━━━━━━━━━━━━━━━━\n`
  msg += `✅ ปกติ: ${okCount} | ⚠️ ต่ำ: ${lowCount} | ❌ หมด: ${emptyCount}`
  msg += `\nนับแล้ว ${totalCounted} รายการ`
  return msg
}

export function buildOrderMessage(
  items: Item[],
  checked: Record<string, { checked: boolean; qty: string }>,
  note: string,
  userName: string
): string {
  const now = new Date()
  const dateStr = now.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
  const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })

  let msg = `🛒 ใบสั่งซื้อ เกลอ ข้าวขาหมู\n📅 ${dateStr} | ${timeStr} น.`
  if (userName) msg += `\n👤 ผู้สั่ง: ${userName}`
  msg += `\n━━━━━━━━━━━━━━━━\n`

  const suppliers: Record<string, { item: Item; qty: string }[]> = {}
  items.forEach(item => {
    const c = checked[item.id]
    if (!c?.checked) return
    const sup = item.supplier || 'ไม่ระบุ'
    if (!suppliers[sup]) suppliers[sup] = []
    suppliers[sup].push({ item, qty: c.qty })
  })

  Object.keys(suppliers).sort().forEach(sup => {
    msg += `\n🏪 ${sup}\n`
    suppliers[sup].forEach(({ item, qty }) => {
      msg += `• ${item.name_th}: ${qty || '?'} ${item.unit_th}\n`
    })
  })

  if (note?.trim()) msg += `\n📝 หมายเหตุ: ${note.trim()}`
  return msg
}
