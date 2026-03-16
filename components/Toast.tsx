'use client'
import type { Toast as ToastType } from '@/hooks/useToast'

export default function ToastList({ toasts }: { toasts: ToastType[] }) {
  if (toasts.length === 0) return null
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
      ))}
    </div>
  )
}
