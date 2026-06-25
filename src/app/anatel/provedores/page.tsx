'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, MapPin, ChevronLeft, ChevronRight, ArrowLeft, Building2, Signal, Star, Globe, Phone } from 'lucide-react'
import Link from 'next/link'
import type { AnatelProvider } from '@/types/provider'

const STATES = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

const PORTE_STYLES: Record<string, string> = {
  MICRO: 'bg-gray-800 text-gray-400 border-gray-700',
  PEQUENO: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  MEDIO: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  GRANDE: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
}

export default function ProvedoresPage() {
  const [providers, setProviders] = useState<AnatelProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [uf, setUf] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchProviders = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) params.set('search', search)
    if (uf && uf !== 'all') params.set('uf', uf)
    try {
      const res = await fetch(`/api/providers?${params}`)
      const data = await res.json()
      setProviders(data.data || [])
      setTotalPages(data.pages || 1)
      setTotal(data.total || 0)
    } finally {
      setLoading(false)
    }
  }, [search, uf, page])

  useEffect(() => { fetchProviders() }, [fetchProviders])

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/anatel" className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-px h-5 bg-gray-800" />
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <h1 className="text-base font-semibold text-white">Provedores Homologados</h1>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
              {total.toLocaleString('pt-BR')} encontrados
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nome, cidade..."
              className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <select
            value={uf}
            onChange={e => { setUf(e.target.value); setPage(1) }}
            className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 transition-all"
          >
            <option value="">Todos os estados</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-gray-900 border border-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {providers.map(provider => (
              <Link
                key={provider.cnpj}
                href={`/anatel/provedores/${(provider as any).id || provider.cnpj}`}
                className="group block rounded-xl border border-gray-800 bg-gray-900 p-4 hover:border-cyan-500/30 hover:bg-gray-900/80 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="font-semibold text-white truncate text-sm">
                        {provider.nomeFantasia || provider.razaoSocial}
                      </h3>
                      {provider.porte && (
                        <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${PORTE_STYLES[provider.porte] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                          {provider.porte}
                        </span>
                      )}
                      {(provider as any).googleRating && (
                        <span className="flex items-center gap-0.5 text-xs text-amber-400 ml-auto">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {((provider as any).googleRating as number).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Enrichment dot */}
                  <div className="flex-shrink-0 mt-1">
                    {(provider as any).enrichedAt
                      ? <span className="w-2 h-2 rounded-full bg-emerald-400 block" title="Enriquecido" />
                      : <span className="w-2 h-2 rounded-full bg-gray-700 block" title="Sem enriquecimento" />
                    }
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-600" />
                    {provider.municipio}, {provider.uf}
                  </span>
                  {(provider as any).enrichedAt && (
                    <span className="text-emerald-600 text-xs">Enriquecido</span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
                  {(provider as any).googlePhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {(provider as any).googlePhone}
                    </span>
                  )}
                  {((provider as any).googleWebsite || (provider as any).websiteUrl) && (
                    <span className="flex items-center gap-1 text-cyan-700 truncate max-w-[160px]">
                      <Globe className="w-3 h-3 flex-shrink-0" />
                      {((provider as any).googleWebsite || (provider as any).websiteUrl)
                        .replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </span>
                  )}
                  {(provider as any)._count?.plans !== undefined
                    ? <span className="ml-auto text-gray-600">{(provider as any)._count.plans} planos</span>
                    : (provider as any).scrapedAt
                      ? <span className="ml-auto text-gray-600">Planos coletados</span>
                      : <span className="ml-auto text-gray-700 italic">Sem planos ainda</span>
                  }
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-600">Página {page} de {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-800 text-gray-500 hover:text-white hover:border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-gray-800 text-gray-500 hover:text-white hover:border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
