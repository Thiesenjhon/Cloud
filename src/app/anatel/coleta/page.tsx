'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Download, CheckCircle, Clock, AlertCircle, BarChart3, Database, Play, Search, MapPin } from 'lucide-react'
import Link from 'next/link'

interface StateData {
  uf: string
  status: 'pending' | 'running' | 'done' | 'error'
  totalProviders: number
  enrichedCount: number
  scrapedCount: number
  plansCount: number
  startedAt: string | null
  finishedAt: string | null
}

interface ImportResult {
  imported: number
  skipped: number
  source: string
  total: number
}

const BRAZIL_STATES = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

const STATE_NAMES: Record<string, string> = {
  AC:'Acre', AL:'Alagoas', AM:'Amazonas', AP:'Amapá', BA:'Bahia', CE:'Ceará', DF:'Distrito Federal',
  ES:'Espírito Santo', GO:'Goiás', MA:'Maranhão', MG:'Minas Gerais', MS:'Mato Grosso do Sul',
  MT:'Mato Grosso', PA:'Pará', PB:'Paraíba', PE:'Pernambuco', PI:'Piauí', PR:'Paraná',
  RJ:'Rio de Janeiro', RN:'Rio Grande do Norte', RO:'Rondônia', RR:'Roraima', RS:'Rio Grande do Sul',
  SC:'Santa Catarina', SE:'Sergipe', SP:'São Paulo', TO:'Tocantins',
}

const STATUS_COLORS = {
  pending: 'bg-gray-800 border-gray-700 text-gray-400',
  running: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
  done: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  error: 'bg-red-500/10 border-red-500/30 text-red-400',
}

const STATUS_ICONS = {
  pending: <Clock className="w-3 h-3" />,
  running: <Clock className="w-3 h-3 animate-spin" />,
  done: <CheckCircle className="w-3 h-3" />,
  error: <AlertCircle className="w-3 h-3" />,
}

export default function ColetaPage() {
  const [states, setStates] = useState<StateData[]>([])
  const [selectedUf, setSelectedUf] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [researchingUf, setResearchingUf] = useState<string | null>(null)

  async function loadStates() {
    try {
      const res = await fetch('/api/states/research')
      const data = await res.json()
      setStates(data.states || [])
    } catch { /* ignore */ }
  }

  useEffect(() => { loadStates() }, [])

  async function importFromData() {
    setImporting(true); setImportResult(null)
    try {
      const res = await fetch('/api/import/from-data', { method: 'POST' })
      const data = await res.json()
      setImportResult(data)
      await loadStates()
    } catch { setImportResult({ imported: 0, skipped: 0, source: 'error', total: 0 }) }
    finally { setImporting(false) }
  }

  async function importAnatel() {
    setImporting(true); setImportResult(null)
    try {
      const res = await fetch('/api/import/anatel', { method: 'POST' })
      const data = await res.json()
      setImportResult(data)
      await loadStates()
    } catch { setImportResult({ imported: 0, skipped: 0, source: 'error', total: 0 }) }
    finally { setImporting(false) }
  }

  async function startResearch(uf: string) {
    setResearchingUf(uf)
    try {
      await fetch(`/api/states/${uf}/research`, { method: 'POST' })
      await loadStates()
    } finally { setResearchingUf(null) }
  }

  const selected = states.find(s => s.uf === selectedUf)
  const totalDone = states.filter(s => s.status === 'done').length
  const totalProviders = states.reduce((a, s) => a + s.totalProviders, 0)
  const totalPlans = states.reduce((a, s) => a + s.plansCount, 0)

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
            <span className="text-xs text-gray-500">Pesquisa estado por estado · Progresso do Brasil</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Estados pesquisados', value: `${totalDone}/27`, color: 'text-cyan-400' },
            { label: 'Provedores no banco', value: totalProviders.toLocaleString('pt-BR'), color: 'text-emerald-400' },
            { label: 'Planos coletados', value: totalPlans.toLocaleString('pt-BR'), color: 'text-violet-400' },
            { label: 'Progresso geral', value: `${Math.round((totalDone / 27) * 100)}%`, color: 'text-amber-400' },
          ].map(k => (
            <div key={k.label} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Import base lista */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Download className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Passo 1 — Importar lista de 8.950 provedores</h3>
              </div>
              <p className="text-xs text-gray-400">Importa a base de provedores com ranking por número de acessos (fonte: ANATEL). Execute uma vez para popular o banco.</p>
              {importResult && (
                <p className={`mt-2 text-xs ${importResult.source === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {importResult.source === 'error' ? 'Erro na importação.' : `✓ ${importResult.imported.toLocaleString('pt-BR')} provedores importados · fonte: ${importResult.source}`}
                </p>
              )}
            </div>
            <button onClick={importFromData} disabled={importing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap">
              {importing ? <><Clock className="w-4 h-4 animate-spin" /> Importando...</> : <><Download className="w-4 h-4" /> Importar Lista</>}
            </button>
          </div>
        </div>

        {/* Brazil Map Grid */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Passo 2 — Pesquisar por Estado</h2>
              <p className="text-xs text-gray-500 mt-0.5">Clique em um estado para ver detalhes e iniciar a coleta</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-700 inline-block" />Pendente</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-cyan-500/30 inline-block" />Em andamento</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500/30 inline-block" />Concluído</span>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
            {BRAZIL_STATES.map(uf => {
              const st = states.find(s => s.uf === uf)
              const status = st?.status || 'pending'
              const isSelected = selectedUf === uf
              return (
                <button key={uf} onClick={() => setSelectedUf(isSelected ? null : uf)}
                  className={`relative rounded-lg border p-2 text-center transition-all ${STATUS_COLORS[status]} ${isSelected ? 'ring-2 ring-cyan-500' : 'hover:border-gray-600'}`}>
                  <div className="text-xs font-bold">{uf}</div>
                  {st?.totalProviders ? <div className="text-xs opacity-60 mt-0.5">{st.totalProviders}</div> : null}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected State Detail */}
        {selectedUf && selected !== undefined && (
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white">{STATE_NAMES[selectedUf]} ({selectedUf})</h3>
                <div className="flex items-center gap-2 mt-1">
                  {STATUS_ICONS[selected?.status || 'pending']}
                  <span className="text-xs text-gray-400 capitalize">{selected?.status === 'done' ? 'Pesquisa concluída' : selected?.status === 'running' ? 'Em andamento' : 'Não pesquisado'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/anatel/pesquisa?uf=${selectedUf}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 text-xs text-gray-300 hover:bg-gray-800 transition-all">
                  <Search className="w-3 h-3" /> Ver Provedores
                </Link>
                <button onClick={() => startResearch(selectedUf)} disabled={researchingUf === selectedUf}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs text-white disabled:opacity-40 transition-all">
                  {researchingUf === selectedUf ? <Clock className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                  Iniciar Pesquisa
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Provedores', value: selected?.totalProviders || 0, color: 'text-white' },
                { label: 'Enriquecidos', value: selected?.enrichedCount || 0, color: 'text-cyan-400' },
                { label: 'Planos coletados', value: selected?.plansCount || 0, color: 'text-emerald-400' },
              ].map(m => (
                <div key={m.label} className="rounded-lg bg-gray-800 p-3 text-center">
                  <p className={`text-xl font-bold ${m.color}`}>{m.value.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>

            {(selected?.totalProviders || 0) > 0 && (
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Enriquecimento Google</span>
                    <span>{selected?.enrichedCount || 0} / {selected?.totalProviders || 0}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                      style={{ width: `${selected?.totalProviders ? ((selected.enrichedCount / selected.totalProviders) * 100) : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Scraping de sites</span>
                    <span>{selected?.scrapedCount || 0} / {selected?.totalProviders || 0}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all"
                      style={{ width: `${selected?.totalProviders ? ((selected.scrapedCount / selected.totalProviders) * 100) : 0}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tip */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 flex items-start gap-3">
          <BarChart3 className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500">
            Depois de importar e pesquisar cada estado, acesse <Link href="/anatel/analise" className="text-cyan-400 hover:underline">Análise Comparativa</Link> para ver gráficos de preços, tecnologias e SVAs por estado e região. Ou use <Link href="/anatel/pesquisa" className="text-cyan-400 hover:underline">Pesquisar Provedores</Link> para buscar por cidade.
          </p>
        </div>
      </div>
    </div>
  )
}
