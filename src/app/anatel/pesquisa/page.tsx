'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Search, MapPin, Star, Phone, Globe, Wifi, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react'
import Link from 'next/link'

interface Plan {
  id: string
  name: string
  technology: string
  downloadSpeed: number
  price: number
  hasStreaming: boolean
  hasFixedIp: boolean
  hasSecurity: boolean
  hasPhone: boolean
  hasTV: boolean
}

interface Provider {
  id: string
  razaoSocial: string
  nomeFantasia: string | null
  uf: string
  municipio: string
  porte: string | null
  googleRating: number | null
  googleReviews: number | null
  googlePhone: string | null
  googleWebsite: string | null
  googleAddress: string | null
  plans: Plan[]
}

const BRAZIL_STATES = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

const TECH_COLORS: Record<string, string> = {
  FIBRA: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  RADIO: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  CABO: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  DSL: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

function PlanBadge({ plan }: { plan: Plan }) {
  const tech = plan.technology?.toUpperCase() || 'OUTRO'
  const techKey = Object.keys(TECH_COLORS).find(k => tech.includes(k)) || 'DSL'
  const svas = [
    plan.hasStreaming && 'Streaming',
    plan.hasFixedIp && 'IP Fixo',
    plan.hasSecurity && 'Câmera',
    plan.hasPhone && 'Fone',
    plan.hasTV && 'TV',
  ].filter(Boolean)

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${TECH_COLORS[techKey]}`}>{plan.technology}</span>
        <span className="text-sm font-bold text-emerald-400">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
      </div>
      <div className="flex items-center gap-1">
        <Wifi className="w-3 h-3 text-cyan-400" />
        <span className="text-xs font-semibold text-white">{plan.downloadSpeed >= 1000 ? `${plan.downloadSpeed / 1000} Gbps` : `${plan.downloadSpeed} Mbps`}</span>
      </div>
      {svas.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {svas.map(s => (
            <span key={s as string} className="text-xs px-1 py-0.5 rounded bg-gray-700 text-gray-400">{s}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function ProviderCard({ provider }: { provider: Provider }) {
  const name = provider.nomeFantasia || provider.razaoSocial
  const hasPlans = provider.plans.length > 0
  const minPrice = hasPlans ? Math.min(...provider.plans.map(p => p.price)) : null

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 hover:border-gray-700 transition-all p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{name}</h3>
          {provider.nomeFantasia && (
            <p className="text-xs text-gray-500 truncate">{provider.razaoSocial}</p>
          )}
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <span className="text-xs text-gray-400 truncate">{provider.municipio} · {provider.uf}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {provider.googleRating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-amber-400">{provider.googleRating.toFixed(1)}</span>
              {provider.googleReviews && <span className="text-xs text-gray-500">({provider.googleReviews})</span>}
            </div>
          )}
          {minPrice !== null && (
            <span className="text-xs text-emerald-400 font-medium">a partir de R$ {minPrice.toFixed(2).replace('.', ',')}</span>
          )}
        </div>
      </div>

      {(provider.googlePhone || provider.googleWebsite) && (
        <div className="flex gap-3">
          {provider.googlePhone && (
            <a href={`tel:${provider.googlePhone}`} className="flex items-center gap-1 text-xs text-gray-400 hover:text-cyan-400 transition-colors">
              <Phone className="w-3 h-3" />{provider.googlePhone}
            </a>
          )}
          {provider.googleWebsite && (
            <a href={provider.googleWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-400 hover:text-cyan-400 transition-colors">
              <Globe className="w-3 h-3" />Site
            </a>
          )}
        </div>
      )}

      {hasPlans ? (
        <div>
          <p className="text-xs text-gray-500 mb-2">{provider.plans.length} plano{provider.plans.length > 1 ? 's' : ''} disponíve{provider.plans.length > 1 ? 'is' : 'l'}</p>
          <div className="grid grid-cols-1 gap-2">
            {provider.plans.slice(0, 3).map(plan => <PlanBadge key={plan.id} plan={plan} />)}
          </div>
          {provider.plans.length > 3 && (
            <p className="text-xs text-gray-500 mt-2">+{provider.plans.length - 3} planos</p>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-700 p-3 text-center">
          <p className="text-xs text-gray-600">Planos ainda não coletados</p>
        </div>
      )}
    </div>
  )
}

export default function PesquisaPage() {
  const [uf, setUf] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [search, setSearch] = useState('')
  const [providers, setProviders] = useState<Provider[]>([])
  const [municipios, setMunicipios] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const fetchProviders = useCallback(async (p = 1) => {
    if (!uf) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: '24' })
      if (municipio) params.set('municipio', municipio)
      if (search) params.set('search', search)
      const res = await fetch(`/api/states/${uf}/providers?${params}`)
      const data = await res.json()
      setProviders(data.providers || [])
      setTotal(data.total || 0)
      setPages(data.pages || 0)
      setMunicipios(data.municipios || [])
      setPage(p)
    } finally { setLoading(false) }
  }, [uf, municipio, search])

  useEffect(() => {
    if (uf) { setMunicipio(''); setSearch(''); fetchProviders(1) }
  }, [uf])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchProviders(1) }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/anatel" className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-px h-5 bg-gray-800" />
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <h1 className="text-base font-semibold text-white">Pesquisar Provedores</h1>
            </div>
            <span className="text-xs text-gray-500">Encontre provedores de internet na sua cidade</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Search controls */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex gap-3">
            <select value={uf} onChange={e => setUf(e.target.value)}
              className="px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 transition-all w-36">
              <option value="">Estado...</option>
              {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {uf && municipios.length > 0 && (
              <select value={municipio} onChange={e => setMunicipio(e.target.value)}
                className="px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 transition-all flex-1 max-w-xs">
                <option value="">Todas as cidades</option>
                {municipios.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            )}

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                placeholder="Buscar provedor por nome..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-gray-500 hover:text-white" />
                </button>
              )}
            </div>

            <button type="submit" disabled={!uf || loading}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm text-white rounded-lg transition-all font-medium">
              Buscar
            </button>
          </div>
        </form>

        {!uf && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-12 text-center">
            <MapPin className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-400 font-medium">Selecione um estado para começar</p>
            <p className="text-xs text-gray-600 mt-1">Você poderá filtrar por cidade e buscar por nome do provedor</p>
          </div>
        )}

        {uf && loading && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-12 text-center">
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Buscando provedores...</p>
          </div>
        )}

        {uf && !loading && providers.length === 0 && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-12 text-center">
            <Search className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-400 font-medium">Nenhum provedor encontrado</p>
            <p className="text-xs text-gray-600 mt-1">Tente importar os dados da ANATEL primeiro na área de Coleta</p>
          </div>
        )}

        {providers.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-white">{total.toLocaleString('pt-BR')}</span> provedores em <span className="font-semibold text-white">{uf}</span>
                {municipio && <> · <span className="text-cyan-400">{municipio}</span></>}
              </p>
              <span className="text-xs text-gray-500">Página {page} de {pages}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.map(p => <ProviderCard key={p.id} provider={p} />)}
            </div>

            {pages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => fetchProviders(page - 1)} disabled={page === 1 || loading}
                  className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400 px-3">{page} / {pages}</span>
                <button onClick={() => fetchProviders(page + 1)} disabled={page === pages || loading}
                  className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
