'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import ManagePage from '@/components/manage/ManagePage'

export default function Manage() {
  const { user } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (!user) router.replace('/login')
    else if (user.role !== 'super_admin') router.replace('/')
  }, [user, router])
  if (!user || user.role !== 'super_admin') return null
  return <ManagePage />
}
