'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import ManageSopPage from '@/components/manage-sop/ManageSopPage'

export default function ManageSopRoute() {
  const { user } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])
  if (!user) return null
  return <ManageSopPage />
}
