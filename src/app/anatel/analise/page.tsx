'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { ArrowLeft, TrendingUp, Wifi, DollarSign, Zap, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

const mockPriceBySpeed = [
  { speed: '50 Mbps', avgPrice: 59.90 },
  { speed: '100 Mbps', avgPrice: 79.90 },
  { speed: '200 Mbps', avgPrice: 99.90 },
  { speed: '300 Mbps', avgPrice: 119.90 },
  { speed: '500 Mbps', avgPrice: 149.90 },
  { speed: '1 Gbps', avgPrice: 199.90 },
]

const mockTechDistrib = [
  { technology: 'Fibra Óptica', count: 8200, percentage: 68 },
  { technology: 'Rádio', count: 2900, percentage: 24 },
  { technology: 'Cabo Coaxial', count: 600, percentage: 5 },
  { technology: 'DSL', count: 300, percentage: 3 },
]

const mockSVAsByRegion = [
  { regiao: 'Sudeste', streaming: 45, ipFixo: 28, camera: 12, telefone: 35 },
  { regiao: 'Sul', streaming: 38, ipFixo: 32, camera: 8, telefone: 42 },
  { regiao: 'Nordeste', streaming: 29, ipFixo: 18, camera: 6, telefone: 22 },
  { regiao: 'Centro-Oeste', streaming: 35, ipFixo: 24, camera: 9, telefone: 30 },
  { regiao: 'Norte', streaming: 22, ipFixo: 15, camera: 4, telefone: 18 },
]

const mockPriceByState = [
  { uf: 'SP', avgPrice: 89.90, minPrice: 49.90, maxPrice: 249.90 },
  { uf: 'RJ', avgPrice: 94.90, minPrice: 59.90, maxPrice: 299.90 },
  { uf: 'MG', avgPrice: 79.90, minPrice: 44.90, maxPrice: 199.90 },
  { uf: 'RS', avgPrice: 74.90, minPrice: 39.90, maxPrice: 179.90 },
  { uf: 'SC', avgPrice: 72.90, minPrice: 39.90, maxPrice: 169.90 },
  { uf: 'PR', avgPrice: 76.90, minPrice: 42.90, maxPrice: 189.90 },
]

type Tab = 'precos' | 'tecnologia' | 'svas' | 'estados'
const TABS: { id: Tab; label: string }[] = [
  { id: 'precos', label: 'Preços' },
  { id: 'tecnologia', label: 'Tecnologia' },
  { id: 'svas', label: 'SVAs' },
  { id: 'estados', label: 'Por Estado' },
]

const DarkTooltip = ({ active, payload, label, prefix = '' }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string; prefix?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">{p.name}: {prefix}{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</p>
      ))}
    </div>
  )
}

export default function AnalisePage() {
  const [tab, setTab] = useState<Tab>('precos')

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
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h1 className="text-base font-semibold text-white">Análise Comparativa</h1>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 ml-auto">Dados demonstrativos</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Preço médio nacional', value: 'R$ 89,90', icon: DollarSign, color: 'text-emerald-400', glow: 'bg-emerald-500' },
            { label: 'Velocidade mais popular', value: '100 Mbps', icon: Wifi, color: 'text-cyan-400', glow: 'bg-cyan-500' },
            { label: 'Provedores com fibra', value: '68%', icon: Zap, color: 'text-violet-400', glow: 'bg-violet-500' },
            { label: 'Inclui streaming', value: '37%', icon: TrendingUp, color: 'text-amber-400', glow: 'bg-amber-500' },
          ].map(kpi => (
            <div key={kpi.label} className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900 p-4">
              <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-10 ${kpi.glow}`} />
              <kpi.icon className={`w-4 h-4 ${kpi.color} mb-2`} />
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-900 border border-gray-800 rounded-lg w-fit">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${tab === t.id ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'precos' && (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h2 className="text-sm font-semibold text-white mb-0.5">Preço Médio por Velocidade</h2>
            <p className="text-xs text-gray-500 mb-5">Correlação entre velocidade e mensalidade média</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockPriceBySpeed}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="speed" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${v}`} />
                <Tooltip content={<DarkTooltip prefix="R$ " />} />
                <Bar dataKey="avgPrice" name="Preço médio" fill="url(#priceGrad)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === 'tecnologia' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <h2 className="text-sm font-semibold text-white mb-5">Distribuição por Tecnologia</h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={mockTechDistrib} dataKey="count" nameKey="technology" cx="50%" cy="50%" outerRadius={90} innerRadius={45}>
                    {mockTechDistrib.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Legend formatter={(v) => <span className="text-xs text-gray-400">{v}</span>} />
                  <Tooltip content={<DarkTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <h2 className="text-sm font-semibold text-white mb-5">Detalhamento</h2>
              <div className="space-y-4">
                {mockTechDistrib.map((t, i) => (
                  <div key={t.technology}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-300 font-medium">{t.technology}</span>
                      <span className="text-gray-500">{t.count.toLocaleString('pt-BR')} planos · <span className="font-bold" style={{ color: COLORS[i] }}>{t.percentage}%</span></span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${t.percentage}%`, backgroundColor: COLORS[i] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'svas' && (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h2 className="text-sm font-semibold text-white mb-0.5">SVAs por Região</h2>
            <p className="text-xs text-gray-500 mb-5">% de planos que incluem cada SVA por região do Brasil</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockSVAsByRegion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="regiao" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="streaming" name="Streaming" fill="#06b6d4" radius={[2, 2, 0, 0]} />
                <Bar dataKey="ipFixo" name="IP Fixo" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="camera" name="Câmera" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                <Bar dataKey="telefone" name="Telefone" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                <Legend formatter={(v) => <span className="text-xs text-gray-400">{v}</span>} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === 'estados' && (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h2 className="text-sm font-semibold text-white mb-0.5">Preço por Estado (top 6)</h2>
            <p className="text-xs text-gray-500 mb-5">Preço mínimo, médio e máximo por estado</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockPriceByState}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="uf" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${v}`} />
                <Tooltip content={<DarkTooltip prefix="R$ " />} />
                <Bar dataKey="minPrice" name="Mínimo" fill="#10b981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="avgPrice" name="Médio" fill="#06b6d4" radius={[2, 2, 0, 0]} />
                <Bar dataKey="maxPrice" name="Máximo" fill="#ef4444" radius={[2, 2, 0, 0]} />
                <Legend formatter={(v) => <span className="text-xs text-gray-400">{v}</span>} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
