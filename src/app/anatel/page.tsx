'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Activity, Building2, Globe, Wifi, TrendingUp, Search, Database, BarChart3, Zap, Shield, Signal } from 'lucide-react'
import Link from 'next/link'

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#f97316', '#84cc16']

interface Stats {
  totalProviders: number
  enrichedProviders: number
  totalPlans: number
  avgPrice: number
  byState: { uf: string; count: number }[]
  byTechnology: { technology: string; count: number }[]
  byPorte: { porte: string; count: number }[]
}

function StatCard({ title, value, icon: Icon, description, color, glow }: {
  title: string; value: string; icon: React.ElementType; description: string; color: string; glow: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900 p-5 transition-all hover:border-gray-700`}>
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 ${glow}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        </div>
        <div className={`p-2.5 rounded-lg bg-gray-800 border border-gray-700`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-gray-400">{label}</p>
        <p className="text-cyan-400 font-bold">{payload[0].value} provedores</p>
      </div>
    )
  }
  return null
}

const PieTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-gray-400">{payload[0].name}</p>
        <p className="text-cyan-400 font-bold">{payload[0].value} provedores</p>
      </div>
    )
  }
  return null
}

export default function AnatelDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/providers/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Signal className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-white tracking-tight">ANATEL ISP Research</h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">BETA</span>
                </div>
                <p className="text-xs text-gray-500">Provedores SCM homologados</p>
              </div>
            </div>
            <nav className="flex items-center gap-2">
              <Link href="/anatel/crm" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all">
                <Building2 className="w-3.5 h-3.5" /> CRM
              </Link>
              <Link href="/anatel/pesquisa" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <Search className="w-3.5 h-3.5" /> Pesquisar
              </Link>
              <Link href="/anatel/coleta" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <Database className="w-3.5 h-3.5" /> Coleta
              </Link>
              <Link href="/anatel/analise" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <BarChart3 className="w-3.5 h-3.5" /> Análise
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Provedores ANATEL"
            value={loading ? '...' : (stats?.totalProviders.toLocaleString('pt-BR') || '0')}
            icon={Building2}
            description="Homologados SCM"
            color="text-cyan-400"
            glow="bg-cyan-500"
          />
          <StatCard
            title="Enriquecidos"
            value={loading ? '...' : (stats?.enrichedProviders.toLocaleString('pt-BR') || '0')}
            icon={Globe}
            description="Com dados completos"
            color="text-emerald-400"
            glow="bg-emerald-500"
          />
          <StatCard
            title="Planos Coletados"
            value={loading ? '...' : (stats?.totalPlans.toLocaleString('pt-BR') || '0')}
            icon={Wifi}
            description="Planos mapeados"
            color="text-violet-400"
            glow="bg-violet-500"
          />
          <StatCard
            title="Preço Médio"
            value={loading ? '...' : (stats?.avgPrice ? `R$ ${stats.avgPrice.toFixed(2)}` : 'N/D')}
            icon={TrendingUp}
            description="Mensalidade média"
            color="text-amber-400"
            glow="bg-amber-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-gray-800 bg-gray-900 p-5">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-white">Provedores por Estado</h2>
              <p className="text-xs text-gray-500 mt-0.5">Distribuição geográfica dos homologados SCM</p>
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-gray-600">Carregando...</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats?.byState.slice(0, 15)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="uf" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-white">Porte das Empresas</h2>
              <p className="text-xs text-gray-500 mt-0.5">Classificação por tamanho</p>
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-gray-600">Carregando...</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={stats?.byPorte} dataKey="count" nameKey="porte" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                      {stats?.byPorte.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-1.5">
                  {stats?.byPorte.map((item, i) => (
                    <div key={item.porte} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-gray-400">{item.porte}</span>
                      </div>
                      <span className="text-gray-300 font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-cyan-300">Como funciona</h3>
            </div>
            <ol className="space-y-2 text-xs text-gray-400">
              <li className="flex gap-2"><span className="text-cyan-500 font-bold">01</span><span>Importa provedores da ANATEL (SCM)</span></li>
              <li className="flex gap-2"><span className="text-cyan-500 font-bold">02</span><span>Enriquece com Google Places</span></li>
              <li className="flex gap-2"><span className="text-cyan-500 font-bold">03</span><span>Scraping + extração de planos via IA</span></li>
              <li className="flex gap-2"><span className="text-cyan-500 font-bold">04</span><span>Dashboards e relatórios comparativos</span></li>
            </ol>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-emerald-300">Dados coletados</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-gray-400">
              {['Velocidade de download e upload', 'Preços e mensalidades', 'Tecnologia (Fibra / Rádio / Cabo)', 'SVAs: streaming, IP fixo, câmera', 'Avaliações Google', 'Localização e cobertura'].map(item => (
                <li key={item} className="flex gap-2"><span className="text-emerald-500">✓</span>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-violet-300">Iniciar coleta</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">APIs configuradas e prontas para iniciar a coleta automática de dados.</p>
            <div className="space-y-2 mb-4">
              {['GOOGLE_PLACES_API_KEY', 'ANTHROPIC_API_KEY', 'DATABASE_URL'].map(key => (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="font-mono text-gray-500">{key}</span>
                </div>
              ))}
            </div>
            <Link href="/anatel/coleta" className="block w-full text-center py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors">
              Iniciar Coleta →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
