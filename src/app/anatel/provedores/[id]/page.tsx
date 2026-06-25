'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Star, MapPin, Phone, Globe, Wifi, DollarSign, CheckCircle, Clock, ExternalLink, Building2, BarChart3, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Plan {
  id: string; name: string; technology: string; downloadSpeed: number; uploadSpeed: number
  price: number; hasStreaming: boolean; hasFixedIp: boolean; hasSecurity: boolean
  hasPhone: boolean; hasTV: boolean; svaDetails: string | null
  contractMonths: number | null; installationFee: number | null; confidence: number | null
}

interface Provider {
  id: string; cnpj: string; razaoSocial: string; nomeFantasia: string | null
  uf: string; municipio: string; porte: string | null; situacao: string | null
  googlePlaceId: string | null; googleRating: number | null; googleReviews: number | null
  googleAddress: string | null; googlePhone: string | null; googleWebsite: string | null
  websiteUrl: string | null; enrichedAt: string | null; scrapedAt: string | null
  createdAt: string; plans: Plan[]
}

const PORTE_COLORS: Record<string, string> = {
  GRANDE: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  MEDIO: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  PEQUENO: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  MICRO: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

const TECH_COLORS: Record<string, string> = {
  FIBRA: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  RADIO: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  CABO: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

function formatSpeed(mbps: number) {
  return mbps >= 1000 ? `${mbps / 1000} Gbps` : `${mbps} Mbps`
}

function DataField({ label, value, mono = false }: { label: string; value: string | null | undefined; mono?: boolean }) {
  if (!value) return (
    <div>
      <p className="text-xs text-gray-600 mb-0.5">{label}</p>
      <p className="text-xs text-gray-700 italic">Não coletado</p>
    </div>
  )
  return (
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className={`text-sm text-gray-200 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  )
}

export default function ProviderPage() {
  const params = useParams()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/providers/${params.id}`)
      .then(r => r.json())
      .then(data => { setProvider(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!provider || provider.cnpj === undefined) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-500">Provedor não encontrado</p>
    </div>
  )

  const name = provider.nomeFantasia || provider.razaoSocial
  const isEnriched = !!provider.enrichedAt
  const hasPlans = provider.plans.length > 0
  const minPrice = hasPlans ? Math.min(...provider.plans.map(p => p.price)) : null
  const maxSpeed = hasPlans ? Math.max(...provider.plans.map(p => p.downloadSpeed)) : null
  const website = provider.googleWebsite || provider.websiteUrl

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/anatel/provedores" className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-px h-5 bg-gray-800" />
          <Building2 className="w-4 h-4 text-cyan-400" />
          <h1 className="text-base font-semibold text-white truncate">{name}</h1>
          {provider.porte && (
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PORTE_COLORS[provider.porte] || PORTE_COLORS['MICRO']}`}>
              {provider.porte}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            {isEnriched
              ? <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle className="w-3 h-3" /> Enriquecido</span>
              : <span className="flex items-center gap-1 text-xs text-gray-600"><AlertCircle className="w-3 h-3" /> Sem enriquecimento</span>
            }
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">

        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex items-center gap-1 mb-1">
              {provider.googleRating ? (
                <>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <p className="text-2xl font-bold text-amber-400">{provider.googleRating.toFixed(1)}</p>
                </>
              ) : <p className="text-2xl font-bold text-gray-700">N/D</p>}
            </div>
            <p className="text-xs text-gray-500">
              {provider.googleReviews ? `${provider.googleReviews.toLocaleString('pt-BR')} avaliações` : 'Google rating'}
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-2xl font-bold text-emerald-400">{hasPlans ? `R$ ${minPrice!.toFixed(0)}` : 'N/D'}</p>
            <p className="text-xs text-gray-500">A partir de</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-2xl font-bold text-cyan-400">{maxSpeed ? formatSpeed(maxSpeed) : 'N/D'}</p>
            <p className="text-xs text-gray-500">Velocidade máxima</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-2xl font-bold text-violet-400">{provider.plans.length}</p>
            <p className="text-xs text-gray-500">Planos mapeados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left: identity + contact */}
          <div className="space-y-4">
            {/* Identity */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-3">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Identificação</h2>
              <DataField label="Razão Social" value={provider.razaoSocial} />
              {provider.nomeFantasia && <DataField label="Nome Fantasia" value={provider.nomeFantasia} />}
              <DataField label="CNPJ" value={provider.cnpj?.replace(/^XLSX/, 'Ranking #')?.replace(/^0+/, '') || provider.cnpj} mono />
              <DataField label="Situação ANATEL" value={provider.situacao} />
              <DataField label="Porte" value={provider.porte} />
            </div>

            {/* Location */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-3">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Localização</h2>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  {provider.googleAddress ? (
                    <p className="text-sm text-gray-200">{provider.googleAddress}</p>
                  ) : (
                    <p className="text-sm text-gray-200">{[provider.municipio, provider.uf].filter(Boolean).join(', ') || 'Não mapeado'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-3">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contato</h2>
              {provider.googlePhone ? (
                <a href={`tel:${provider.googlePhone}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-cyan-400 transition-colors">
                  <Phone className="w-4 h-4 text-gray-500" />{provider.googlePhone}
                </a>
              ) : <p className="text-xs text-gray-700 italic">Telefone não coletado</p>}
              {website ? (
                <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                  <Globe className="w-4 h-4" />{website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : <p className="text-xs text-gray-700 italic">Site não coletado</p>}
            </div>

            {/* Data metadata */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Coleta de Dados</h2>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Google Places</span>
                {provider.enrichedAt
                  ? <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {new Date(provider.enrichedAt).toLocaleDateString('pt-BR')}</span>
                  : <span className="text-gray-700">Pendente</span>}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Scraping do site</span>
                {provider.scrapedAt
                  ? <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {new Date(provider.scrapedAt).toLocaleDateString('pt-BR')}</span>
                  : <span className="text-gray-700">Pendente</span>}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Planos coletados</span>
                <span className={provider.plans.length > 0 ? 'text-emerald-400' : 'text-gray-700'}>
                  {provider.plans.length > 0 ? `${provider.plans.length} planos` : 'Pendente'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: plans */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Planos de Internet</h2>
                {hasPlans && <span className="text-xs text-gray-500">{provider.plans.length} plano{provider.plans.length !== 1 ? 's' : ''}</span>}
              </div>

              {!hasPlans ? (
                <div className="rounded-lg border border-dashed border-gray-700 p-8 text-center">
                  <Wifi className="w-6 h-6 text-gray-700 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Planos ainda não coletados</p>
                  <p className="text-xs text-gray-700 mt-1">Execute o scraping do site para extrair os planos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {provider.plans.map(plan => {
                    const techKey = Object.keys(TECH_COLORS).find(k => plan.technology?.toUpperCase().includes(k)) || 'OUTROS'
                    const svas = [
                      plan.hasStreaming && 'Streaming',
                      plan.hasFixedIp && 'IP Fixo',
                      plan.hasSecurity && 'Câmera',
                      plan.hasPhone && 'Fone',
                      plan.hasTV && 'TV',
                    ].filter(Boolean) as string[]

                    return (
                      <div key={plan.id} className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-sm font-semibold text-white">{plan.name}</p>
                            <span className={`text-xs px-1.5 py-0.5 rounded border ${TECH_COLORS[techKey] || 'bg-gray-700 text-gray-400 border-gray-600'}`}>
                              {plan.technology}
                            </span>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-lg font-bold text-emerald-400">R$ {plan.price.toFixed(2).replace('.', ',')}</p>
                            {plan.contractMonths && <p className="text-xs text-gray-500">{plan.contractMonths} meses</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Wifi className="w-3 h-3 text-cyan-400" />
                            <span>Download: <span className="text-white font-medium">{formatSpeed(plan.downloadSpeed)}</span></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Wifi className="w-3 h-3 text-violet-400" style={{ transform: 'rotate(180deg)' }} />
                            <span>Upload: <span className="text-white font-medium">{formatSpeed(plan.uploadSpeed)}</span></span>
                          </div>
                          {plan.installationFee !== null && plan.installationFee !== undefined && (
                            <div className="flex items-center gap-1.5 text-gray-400">
                              <DollarSign className="w-3 h-3" />
                              <span>Instalação: <span className="text-white font-medium">R$ {plan.installationFee.toFixed(0)}</span></span>
                            </div>
                          )}
                          {plan.confidence !== null && plan.confidence !== undefined && (
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <BarChart3 className="w-3 h-3" />
                              <span>Confiança: {Math.round((plan.confidence) * 100)}%</span>
                            </div>
                          )}
                        </div>
                        {svas.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {svas.map(s => (
                              <span key={s} className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-400">{s}</span>
                            ))}
                          </div>
                        )}
                        {plan.svaDetails && (
                          <p className="text-xs text-gray-500 mt-1 italic">{plan.svaDetails}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
