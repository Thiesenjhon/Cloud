'use client'

import { useState } from 'react'
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, Clock, Globe, MapPin, Brain, Database, Zap, Download } from 'lucide-react'
import Link from 'next/link'

interface ImportResult {
  imported: number
  skipped: number
  source: string
  total: number
}

interface JobStatus {
  type: string
  status: 'idle' | 'running' | 'done' | 'error'
  progress: number
  total: number
  processed: number
  errors: number
  log: string[]
}

const defaultJob: JobStatus = { type: '', status: 'idle', progress: 0, total: 0, processed: 0, errors: 0, log: [] }

const TABS = ['test', 'jobs', 'config'] as const
type Tab = typeof TABS[number]
const TAB_LABELS: Record<Tab, string> = { test: 'Testar Extração', jobs: 'Jobs em Lote', config: 'Configuração' }

export default function ColetaPage() {
  const [tab, setTab] = useState<Tab>('test')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
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
    setTestLoading(true); setTestResult(null)
    try {
      const res = await fetch('/api/enrich/website', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ websiteUrl, providerName }) })
      setTestResult(JSON.stringify(await res.json(), null, 2))
    } catch (e) { setTestResult('Erro: ' + String(e)) }
    finally { setTestLoading(false) }
  }

  async function testGooglePlaces() {
    if (!providerName) return
    setTestLoading(true); setTestResult(null)
    try {
      const res = await fetch('/api/enrich/google-places', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ companyName: providerName, municipio: 'São Paulo', uf: 'SP' }) })
      setTestResult(JSON.stringify(await res.json(), null, 2))
    } catch (e) { setTestResult('Erro: ' + String(e)) }
    finally { setTestLoading(false) }
  }

  async function importAnatel() {
    setImporting(true); setImportResult(null)
    try {
      const res = await fetch('/api/import/anatel', { method: 'POST' })
      setImportResult(await res.json())
    } catch (e) { setImportResult({ imported: 0, skipped: 0, source: 'error', total: 0 }) }
    finally { setImporting(false) }
  }

  const statusIcon = (status: string) => {
    if (status === 'running') return <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
    if (status === 'done') return <CheckCircle className="w-4 h-4 text-emerald-400" />
    if (status === 'error') return <XCircle className="w-4 h-4 text-red-400" />
    return <Clock className="w-4 h-4 text-gray-600" />
  }

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
              <Database className="w-4 h-4 text-cyan-400" />
              <h1 className="text-base font-semibold text-white">Coleta de Dados</h1>
            </div>
            <span className="text-xs text-gray-500">Pipeline de enriquecimento de provedores</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-900 border border-gray-800 rounded-lg w-fit">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${tab === t ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {tab === 'test' && (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-white mb-0.5">Teste de Extração Manual</h2>
              <p className="text-xs text-gray-500">Teste a coleta em um provedor específico antes de rodar em lote</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Nome do Provedor</label>
                <input placeholder="Ex: Net Fibra Telecom" value={providerName} onChange={e => setProviderName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Site do Provedor</label>
                <input placeholder="Ex: https://netfibra.com.br" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={testGooglePlaces} disabled={testLoading || !providerName}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-700 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <MapPin className="w-4 h-4" /> Testar Google Places
              </button>
              <button onClick={testWebsiteScrape} disabled={testLoading || !websiteUrl || !providerName}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <Brain className="w-4 h-4" /> Testar Scraping + IA
              </button>
            </div>
            {testLoading && (
              <div className="flex items-center gap-2 text-sm text-cyan-400">
                <Clock className="w-4 h-4 animate-spin" /> Processando...
              </div>
            )}
            {testResult && (
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Resultado</label>
                <pre className="bg-gray-950 border border-gray-800 text-emerald-400 p-4 rounded-lg text-xs overflow-auto max-h-96 whitespace-pre-wrap font-mono">{testResult}</pre>
              </div>
            )}
          </div>
        )}

        {tab === 'jobs' && (
          <div className="space-y-4">
            {/* ANATEL Import */}
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-white">Importar Provedores ANATEL</h3>
                  </div>
                  <p className="text-xs text-gray-400">Busca os dados oficiais do dados.gov.br e salva no banco de dados. Execute isso primeiro.</p>
                  {importResult && (
                    <div className="mt-2 text-xs">
                      {importResult.source === 'error' ? (
                        <span className="text-red-400">Erro na importação</span>
                      ) : (
                        <span className="text-emerald-400">
                          ✓ {importResult.imported} importados · {importResult.skipped} ignorados · fonte: {importResult.source}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button onClick={importAnatel} disabled={importing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap">
                  {importing ? <Clock className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {importing ? 'Importando...' : 'Importar Agora'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(jobs).map(([key, job]) => (
                <div key={key} className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {key === 'google_places' ? <Globe className="w-4 h-4 text-cyan-400" /> : <Brain className="w-4 h-4 text-violet-400" />}
                      <span className="text-sm font-semibold text-white">{job.type}</span>
                    </div>
                    {statusIcon(job.status)}
                  </div>
                  <p className="text-xs text-gray-500">
                    {key === 'google_places' ? 'Busca endereço, telefone, avaliações e site no Google' : 'Scraping do site + extração de planos com Claude AI'}
                  </p>
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>{job.processed} / {job.total || '?'} processados</span>
                      <span>{job.errors} erros</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                        style={{ width: `${job.total ? (job.processed / job.total) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button disabled={job.status === 'running'}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs text-white disabled:opacity-40 transition-all">
                      <Play className="w-3 h-3" /> Iniciar
                    </button>
                    <button disabled={job.status !== 'running'}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 text-xs text-gray-400 hover:text-white disabled:opacity-40 transition-all">
                      <Pause className="w-3 h-3" /> Pausar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-300">
                  Para processar todos os ~19k provedores, recomendamos executar o pipeline em background com rate limiting para respeitar os limites das APIs.
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === 'config' && (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-white mb-0.5">Variáveis de Ambiente</h2>
              <p className="text-xs text-gray-500">Configure no Vercel → Environment Variables</p>
            </div>
            <div className="space-y-2">
              {[
                { key: 'DATABASE_URL', desc: 'PostgreSQL connection string (Neon, Supabase, Railway)', required: true },
                { key: 'GOOGLE_PLACES_API_KEY', desc: 'Google Cloud Console → APIs → Places API', required: true },
                { key: 'ANTHROPIC_API_KEY', desc: 'console.anthropic.com → API Keys', required: true },
              ].map(env => (
                <div key={env.key} className="flex items-start gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium mt-0.5 whitespace-nowrap">✓ ativo</span>
                  <div>
                    <code className="text-sm font-mono text-cyan-300">{env.key}</code>
                    <p className="text-xs text-gray-500 mt-0.5">{env.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <pre className="text-xs text-emerald-400 font-mono whitespace-pre-wrap">{`# .env.local
DATABASE_URL="postgresql://user:pass@host:5432/db"
GOOGLE_PLACES_API_KEY="AIza..."
ANTHROPIC_API_KEY="sk-ant-..."`}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
