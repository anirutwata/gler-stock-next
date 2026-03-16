'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import StockPage from '@/components/stock/StockPage'

export default function Stock() {
  const { user } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (!user) router.replace('/login')
    else if (user.role === 'service') router.replace('/order')
  }, [user, router])
  if (!user || user.role === 'service') return null
  return <StockPage />
}
