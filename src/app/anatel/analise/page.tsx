'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, TrendingUp, Wifi, DollarSign, Zap } from 'lucide-react'
import Link from 'next/link'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const mockPriceBySpeed = [
  { speed: '50 Mbps', avgPrice: 59.90, count: 1200 },
  { speed: '100 Mbps', avgPrice: 79.90, count: 3400 },
  { speed: '200 Mbps', avgPrice: 99.90, count: 2800 },
  { speed: '300 Mbps', avgPrice: 119.90, count: 1900 },
  { speed: '500 Mbps', avgPrice: 149.90, count: 980 },
  { speed: '1 Gbps', avgPrice: 199.90, count: 420 },
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

export default function AnalisePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/anatel"><ArrowLeft className="w-4 h-4" /></Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Análise Comparativa</h1>
              <p className="text-sm text-slate-500">Insights sobre planos, preços e tecnologias</p>
            </div>
            <Badge variant="outline" className="ml-auto text-amber-700 border-amber-300 bg-amber-50">Dados demonstrativos</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Preço médio nacional', value: 'R$ 89,90', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Velocidade mais popular', value: '100 Mbps', icon: Wifi, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Provedores com fibra', value: '68%', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Inclui streaming', value: '37%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map(kpi => (
            <Card key={kpi.label}>
              <CardContent className="pt-5 pb-5">
                <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center mb-3`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="precos">
          <TabsList>
            <TabsTrigger value="precos">Preços</TabsTrigger>
            <TabsTrigger value="tecnologia">Tecnologia</TabsTrigger>
            <TabsTrigger value="svas">SVAs</TabsTrigger>
            <TabsTrigger value="estados">Por Estado</TabsTrigger>
          </TabsList>

          <TabsContent value="precos" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preço Médio por Velocidade</CardTitle>
                <CardDescription>Correlação entre velocidade do plano e mensalidade média</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockPriceBySpeed}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="speed" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R$${v}`} />
                    <Tooltip formatter={(v, name) => [name === 'avgPrice' ? `R$ ${Number(v).toFixed(2)}` : v, name === 'avgPrice' ? 'Preço médio' : 'Qtd planos']} />
                    <Bar dataKey="avgPrice" fill="#3b82f6" radius={[4, 4, 0, 0]} name="avgPrice" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tecnologia" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Distribuição por Tecnologia</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={mockTechDistrib} dataKey="count" nameKey="technology" cx="50%" cy="50%" outerRadius={90} label={({ percentage }: { percentage: number }) => `${percentage}%`}>
                        {mockTechDistrib.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(v) => [v, 'Planos']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Detalhamento por Tecnologia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTechDistrib.map((t, i) => (
                      <div key={t.technology} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{t.technology}</span>
                            <span className="text-slate-500">{t.count.toLocaleString('pt-BR')} planos</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full" style={{ width: `${t.percentage}%`, backgroundColor: COLORS[i] }} />
                          </div>
                        </div>
                        <span className="text-sm font-bold text-slate-700 w-10 text-right">{t.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="svas" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">SVAs por Região</CardTitle>
                <CardDescription>Percentual de planos que incluem cada SVA por região do Brasil</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockSVAsByRegion}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="regiao" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
                    <Tooltip formatter={v => [`${v}%`, '']} />
                    <Bar dataKey="streaming" name="Streaming" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="ipFixo" name="IP Fixo" fill="#10b981" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="camera" name="Câmera/Segurança" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="telefone" name="Telefone" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="estados" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preço por Estado (top 6)</CardTitle>
                <CardDescription>Preço médio, mínimo e máximo por estado</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockPriceByState}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="uf" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R$${v}`} />
                    <Tooltip formatter={v => [`R$ ${Number(v).toFixed(2)}`, '']} />
                    <Bar dataKey="minPrice" name="Preço mínimo" fill="#10b981" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="avgPrice" name="Preço médio" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="maxPrice" name="Preço máximo" fill="#ef4444" radius={[2, 2, 0, 0]} />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
