import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ANATEL ISP Research',
  description: 'Pesquisa e análise de provedores de internet homologados pela ANATEL',
}

const navLinks = [
  { href: '/anatel', label: 'Dashboard' },
  { href: '/anatel/crm', label: 'CRM' },
  { href: '/anatel/coleta', label: 'Coleta' },
  { href: '/anatel/pesquisa', label: 'Pesquisa' },
]

export default function AnatelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800 bg-gray-950 px-4 flex items-center gap-1 h-11 sticky top-0 z-40">
        <span className="text-cyan-400 font-bold text-sm mr-4">ANATEL ISP</span>
        {navLinks.map(l => (
          <Link key={l.href} href={l.href} className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors">
            {l.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  )
}
