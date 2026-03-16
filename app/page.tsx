'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'

export default function Home() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.replace('/login')
    } else if (user.role === 'kitchen') {
      router.replace('/stock')
    } else if (user.role === 'service') {
      router.replace('/order')
    } else {
      router.replace('/dashboard')
    }
  }, [user, router])

  return null
}
