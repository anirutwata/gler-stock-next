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
    else if (user.role !== 'super_admin') router.replace('/sop')
  }, [user, router])
  if (!user || user.role !== 'super_admin') return null
  return <ManageSopPage />
}
