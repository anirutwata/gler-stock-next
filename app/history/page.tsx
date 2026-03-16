'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import HistoryPage from '@/components/history/HistoryPage'

export default function History() {
  const { user } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])
  if (!user) return null
  return <HistoryPage />
}
