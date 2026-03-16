import type { Metadata } from 'next'
import { IBM_Plex_Sans_Thai } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/context/UserContext'
import { LangProvider } from '@/context/LangContext'
import { TelegramProvider } from '@/context/TelegramContext'

const ibmPlex = IBM_Plex_Sans_Thai({
  subsets: ['thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'เกลอ ข้าวขาหมู - ระบบสต็อก',
  description: 'ระบบจัดการสต็อก เกลอ ข้าวขาหมู',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={ibmPlex.variable}>
        <UserProvider>
          <LangProvider>
            <TelegramProvider>
              {children}
            </TelegramProvider>
          </LangProvider>
        </UserProvider>
      </body>
    </html>
  )
}
