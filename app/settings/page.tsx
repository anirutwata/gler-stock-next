'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import SettingsPage from '@/components/settings/SettingsPage'

export default function Settings() {
  const { user } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])
  if (!user) return null
  return <SettingsPage />
}
