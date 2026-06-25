import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ANATEL ISP Research',
  description: 'Pesquisa e análise de provedores de internet homologados pela ANATEL',
}

export default function AnatelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {children}
    </div>
  )
}
