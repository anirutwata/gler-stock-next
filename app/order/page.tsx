'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import OrderPage from '@/components/order/OrderPage'

export default function Order() {
  const { user } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (!user) router.replace('/login')
    else if (user.role === 'kitchen') router.replace('/stock')
  }, [user, router])
  if (!user || user.role === 'kitchen') return null
  return <OrderPage />
}
