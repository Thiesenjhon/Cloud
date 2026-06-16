'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, Clock, Globe, MapPin, Brain } from 'lucide-react'
import Link from 'next/link'

interface JobStatus {
  type: string
  status: 'idle' | 'running' | 'done' | 'error'
  progress: number
  total: number
  processed: number
  errors: number
  log: string[]
}

const defaultJob: JobStatus = {
  type: '',
  status: 'idle',
  progress: 0,
  total: 0,
  processed: 0,
  errors: 0,
  log: [],
}

export default function ColetaPage() {
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [providerName, setProviderName] = useState('')
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [jobs] = useState<Record<string, JobStatus>>({
    google_places: { ...defaultJob, type: 'Google Places' },
    website_scrape: { ...defaultJob, type: 'Website + IA' },
  })

  async function testWebsiteScrape() {
    if (!websiteUrl || !providerName) return
    setTestLoading(true)
    setTestResult(null)

    try {
      const res = await fetch('/api/enrich/website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl, providerName }),
      })
      const data = await res.json()
      setTestResult(JSON.stringify(data, null, 2))
    } catch (e) {
      setTestResult('Erro: ' + String(e))
    } finally {
      setTestLoading(false)
    }
  }

  async function testGooglePlaces() {
    if (!providerName) return
    setTestLoading(true)
    setTestResult(null)

    try {
      const res = await fetch('/api/enrich/google-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: providerName, municipio: 'São Paulo', uf: 'SP' }),
      })
      const data = await res.json()
      setTestResult(JSON.stringify(data, null, 2))
    } catch (e) {
      setTestResult('Erro: ' + String(e))
    } finally {
      setTestLoading(false)
    }
  }

  const statusIcon = (status: string) => {
    if (status === 'running') return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
    if (status === 'done') return <CheckCircle className="w-4 h-4 text-green-500" />
    if (status === 'error') return <XCircle className="w-4 h-4 text-red-500" />
    return <Clock className="w-4 h-4 text-slate-400" />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/anatel"><ArrowLeft className="w-4 h-4" /></Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Coleta de Dados</h1>
              <p className="text-sm text-slate-500">Pipeline de enriquecimento de provedores</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <Tabs defaultValue="test">
          <TabsList>
            <TabsTrigger value="test">Testar Extração</TabsTrigger>
            <TabsTrigger value="jobs">Jobs em Lote</TabsTrigger>
            <TabsTrigger value="config">Configuração</TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Teste de Extração Manual</CardTitle>
                <CardDescription>Teste a coleta em um provedor específico antes de rodar em lote</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Nome do Provedor</label>
                    <Input placeholder="Ex: Net Fibra Telecom" value={providerName} onChange={e => setProviderName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Site do Provedor</label>
                    <Input placeholder="Ex: https://netfibra.com.br" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={testGooglePlaces} disabled={testLoading || !providerName} variant="outline">
                    <MapPin className="w-4 h-4 mr-1" /> Testar Google Places
                  </Button>
                  <Button onClick={testWebsiteScrape} disabled={testLoading || !websiteUrl || !providerName}>
                    <Brain className="w-4 h-4 mr-1" /> Testar Scraping + IA
                  </Button>
                </div>

                {testLoading && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4 animate-spin" /> Processando...
                  </div>
                )}

                {testResult && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Resultado</label>
                    <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                      {testResult}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(jobs).map(([key, job]) => (
                <Card key={key}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {key === 'google_places' ? <Globe className="w-4 h-4 text-blue-500" /> : <Brain className="w-4 h-4 text-purple-500" />}
                        {job.type}
                      </CardTitle>
                      {statusIcon(job.status)}
                    </div>
                    <CardDescription>
                      {key === 'google_places' ? 'Busca endereço, telefone, avaliações e site no Google' : 'Scraping do site + extração de planos com Claude AI'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>{job.processed} / {job.total || '?'} processados</span>
                      <span>{job.errors} erros</span>
                    </div>
                    <Progress value={job.total ? (job.processed / job.total) * 100 : 0} className="h-2" />
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" disabled={job.status === 'running'}>
                        <Play className="w-3 h-3 mr-1" /> Iniciar
                      </Button>
                      <Button size="sm" variant="outline" disabled={job.status !== 'running'}>
                        <Pause className="w-3 h-3 mr-1" /> Pausar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm text-amber-800">
                  <strong>Nota:</strong> Para processar todos os ~19k provedores, recomendamos executar o pipeline em background usando um worker (Celery, BullMQ, etc.) com rate limiting para respeitar os limites das APIs. Configure as variáveis de ambiente primeiro.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Variáveis de Ambiente</CardTitle>
                <CardDescription>Configure no seu .env.local ou nas variáveis do ambiente de deploy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { key: 'DATABASE_URL', desc: 'PostgreSQL connection string (ex: Supabase, Neon, Railway)', required: true },
                    { key: 'GOOGLE_PLACES_API_KEY', desc: 'Google Cloud Console → APIs → Places API', required: true },
                    { key: 'ANTHROPIC_API_KEY', desc: 'console.anthropic.com → API Keys', required: true },
                  ].map(env => (
                    <div key={env.key} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <Badge variant={env.required ? 'destructive' : 'secondary'} className="text-xs mt-0.5">
                        {env.required ? 'obrigatório' : 'opcional'}
                      </Badge>
                      <div>
                        <code className="text-sm font-mono text-slate-900">{env.key}</code>
                        <p className="text-xs text-slate-500 mt-0.5">{env.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-slate-900 rounded-lg">
                  <pre className="text-xs text-green-400 whitespace-pre-wrap">{`# .env.local
DATABASE_URL="postgresql://user:pass@host:5432/anatel_db"
GOOGLE_PLACES_API_KEY="AIza..."
ANTHROPIC_API_KEY="sk-ant-..."`}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
