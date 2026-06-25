
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ReVitaliza Fitness',
  description: 'Acompanhamento de saúde e bem-estar'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" className="dark">
      <body className="font-sans antialiased">{children}<Analytics /></body>
    </html>
  )
}
