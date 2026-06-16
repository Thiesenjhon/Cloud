'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, Building2, Globe, Wifi, TrendingUp, Search, Database, BarChart3 } from 'lucide-react'
import Link from 'next/link'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16']

interface Stats {
  totalProviders: number
  enrichedProviders: number
  totalPlans: number
  avgPrice: number
  byState: { uf: string; count: number }[]
  byTechnology: { technology: string; count: number }[]
  byPorte: { porte: string; count: number }[]
  priceRanges: { range: string; count: number }[]
  topSVAs: { sva: string; count: number; percentage: number }[]
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

  const statCards = [
    { title: 'Provedores ANATEL', value: stats?.totalProviders.toLocaleString('pt-BR') || '0', icon: Building2, description: 'Homologados SCM', color: 'text-blue-600' },
    { title: 'Enriquecidos', value: stats?.enrichedProviders.toLocaleString('pt-BR') || '0', icon: Globe, description: 'Com dados completos', color: 'text-green-600' },
    { title: 'Planos Coletados', value: stats?.totalPlans.toLocaleString('pt-BR') || '0', icon: Wifi, description: 'Planos mapeados', color: 'text-purple-600' },
    { title: 'Preço Médio', value: stats?.avgPrice ? `R$ ${stats.avgPrice.toFixed(2)}` : 'N/D', icon: TrendingUp, description: 'Mensalidade média', color: 'text-orange-600' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">ANATEL ISP Research</h1>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">Beta</Badge>
              </div>
              <p className="text-slate-500 text-sm ml-11">Pesquisa e análise de provedores de internet homologados pela ANATEL</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/anatel/provedores"><Search className="w-4 h-4 mr-1" /> Provedores</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/anatel/coleta"><Database className="w-4 h-4 mr-1" /> Coleta de Dados</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/anatel/analise"><BarChart3 className="w-4 h-4 mr-1" /> Análise</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(card => (
            <Card key={card.title}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">{card.title}</p>
                    {loading ? <Skeleton className="h-8 w-20" /> : (
                      <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">{card.description}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100">
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Provedores por Estado</CardTitle>
              <CardDescription>Distribuição geográfica dos provedores homologados</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-64 w-full" /> : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={stats?.byState.slice(0, 15)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="uf" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [v, 'Provedores']} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Porte da Empresa</CardTitle>
              <CardDescription>Classificação por tamanho</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-64 w-full" /> : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={stats?.byPorte}
                      dataKey="count"
                      nameKey="porte"
                      cx="50%"
                      cy="45%"
                      outerRadius={80}
                      label={({ porte, percent }: { porte: string; percent: number }) => `${porte} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {stats?.byPorte.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [v, 'Provedores']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-base text-blue-800">Como funciona</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-700 space-y-2">
              <div className="flex gap-2"><span className="font-bold">1.</span><span>Importa a lista oficial de provedores da ANATEL (SCM)</span></div>
              <div className="flex gap-2"><span className="font-bold">2.</span><span>Enriquece com Google Places: endereço, avaliações, telefone</span></div>
              <div className="flex gap-2"><span className="font-bold">3.</span><span>Scraping dos sites + extração de planos com IA (Claude)</span></div>
              <div className="flex gap-2"><span className="font-bold">4.</span><span>Gera dashboards e relatórios comparativos</span></div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-base text-green-800">Dados coletados</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-green-700 space-y-1">
              <p>✓ Velocidade de download e upload</p>
              <p>✓ Preços e mensalidades</p>
              <p>✓ Tecnologia (Fibra / Rádio / Cabo)</p>
              <p>✓ SVAs: streaming, IP fixo, câmera</p>
              <p>✓ Avaliações Google</p>
              <p>✓ Localização e cobertura</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-base text-purple-800">Configurar coleta</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-purple-700 space-y-3">
              <p>Configure as APIs para iniciar a coleta automática:</p>
              <div className="space-y-1 font-mono text-xs bg-purple-100 p-2 rounded">
                <p>GOOGLE_PLACES_API_KEY=...</p>
                <p>ANTHROPIC_API_KEY=...</p>
                <p>DATABASE_URL=...</p>
              </div>
              <Button asChild size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                <Link href="/anatel/coleta">Iniciar Coleta</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
