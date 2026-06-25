'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Download, CheckCircle, Clock, AlertCircle, BarChart3, Database, Play, Search, MapPin, Sparkles, Globe, Pause, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

interface StateData {
  uf: string
  status: 'pending' | 'running' | 'done' | 'error'
  totalProviders: number
  enrichedCount: number
  scrapedCount: number
  plansCount: number
}

interface EnrichResult {
  name: string
  found: boolean
  uf: string | null
  municipio: string | null
  rating: number | null
  website: string | null
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

export default function ColetaPage() {
  const [states, setStates] = useState<StateData[]>([])
  const [selectedUf, setSelectedUf] = useState<string | null>(null)

  // Import state
  const [importing, setImporting] = useState(false)
  const [importProg, setImportProg] = useState<{ processed: number; total: number } | null>(null)
  const [importMsg, setImportMsg] = useState<string | null>(null)

  // Enrich state
  const [enriching, setEnriching] = useState(false)
  const [enrichPaused, setEnrichPaused] = useState(false)
  const [enrichStats, setEnrichStats] = useState<{ enriched: number; total: number; remaining: number } | null>(null)
  const [enrichLog, setEnrichLog] = useState<EnrichResult[]>([])
  const [enrichUf, setEnrichUf] = useState('')
  const [showLog, setShowLog] = useState(false)
  const enrichRunning = useRef(false)

  async function loadStates() {
    try {
      const res = await fetch('/api/states/research')
      const data = await res.json()
      setStates(data.states || [])
    } catch { /* ignore */ }
  }

  async function loadEnrichStats() {
    try {
      const res = await fetch('/api/enrich/batch')
      const data = await res.json()
      setEnrichStats(data)
    } catch { /* ignore */ }
  }

  useEffect(() => { loadStates(); loadEnrichStats() }, [])

  // ── IMPORT ──
  async function importFromData(clean = false) {
    setImporting(true); setImportMsg(null); setImportProg(null)
    const BATCH = 500
    let offset = 0
    let totalImported = 0
    let totalSkipped = 0
    let grandTotal = 8950
    try {
      // If clean reimport, delete old XLSX* records first
      if (clean) {
        setImportMsg('Limpando registros antigos...')
        await fetch('/api/import/from-data', { method: 'DELETE' })
      }

      const meta = await fetch('/api/import/from-data').then(r => r.json()).catch(() => ({ total: 8950 }))
      grandTotal = meta.total || 8950
      setImportProg({ processed: 0, total: grandTotal })

      while (offset < grandTotal) {
        const res = await fetch('/api/import/from-data', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ offset, limit: BATCH }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        totalImported += data.imported || 0
        totalSkipped += data.skipped || 0
        offset += BATCH
        setImportProg({ processed: Math.min(offset, grandTotal), total: grandTotal })
        if (data.done) break
      }
      setImportMsg(`✓ ${totalImported.toLocaleString('pt-BR')} importados · ${totalSkipped.toLocaleString('pt-BR')} já existiam`)
      await loadStates(); await loadEnrichStats()
    } catch {
      setImportMsg(`Erro após ${totalImported.toLocaleString('pt-BR')} importados — tente novamente`)
    } finally { setImporting(false); setImportProg(null) }
  }

  // ── ENRICH ──
  async function startEnrich() {
    if (enriching) { setEnrichPaused(!enrichPaused); return }
    setEnriching(true); setEnrichPaused(false); setShowLog(true)
    enrichRunning.current = true
    setEnrichLog([])

    const BATCH = 5 // small batches to show live results
    let round = 0

    while (enrichRunning.current) {
      if (enrichPaused) { await new Promise(r => setTimeout(r, 500)); continue }
      try {
        const res = await fetch('/api/enrich/batch', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: BATCH, uf: enrichUf || undefined }),
        })
        const data = await res.json()
        if (data.error) { enrichRunning.current = false; break }

        setEnrichLog(prev => [...data.results, ...prev].slice(0, 100))
        setEnrichStats({ enriched: data.enrichedTotal, total: data.grandTotal, remaining: data.remaining })

        if (data.processed === 0 || data.remaining === 0) {
          enrichRunning.current = false; break
        }

        round++
        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 1200))
      } catch {
        await new Promise(r => setTimeout(r, 3000))
      }
    }

    setEnriching(false); enrichRunning.current = false
    await loadStates()
  }

  function stopEnrich() {
    enrichRunning.current = false
    setEnriching(false)
    setEnrichPaused(false)
  }

  const totalDone = states.filter(s => s.status === 'done').length
  const totalProviders = enrichStats?.total || states.reduce((a, s) => a + s.totalProviders, 0)
  const totalEnriched = enrichStats?.enriched || 0
  const enrichPct = totalProviders > 0 ? Math.round((totalEnriched / totalProviders) * 100) : 0
  const selected = states.find(s => s.uf === selectedUf)

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/anatel" className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-px h-5 bg-gray-800" />
          <Database className="w-4 h-4 text-cyan-400" />
          <h1 className="text-base font-semibold text-white">Coleta de Dados</h1>
          <span className="text-xs text-gray-500">Pipeline de enriquecimento</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Provedores na base', value: totalProviders.toLocaleString('pt-BR'), color: 'text-white' },
            { label: 'Enriquecidos Google', value: totalEnriched.toLocaleString('pt-BR'), color: 'text-cyan-400' },
            { label: 'Cobertura atual', value: `${enrichPct}%`, color: enrichPct > 50 ? 'text-emerald-400' : 'text-amber-400' },
            { label: 'Estados mapeados', value: `${totalDone}/27`, color: 'text-violet-400' },
          ].map(k => (
            <div key={k.label} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>

        {/* STEP 1 — Import */}
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">01</span>
                <h3 className="text-sm font-semibold text-white">Importar base de provedores</h3>
                <span className="text-xs text-gray-500">8.950 empresas · ranking por acessos</span>
              </div>
              <p className="text-xs text-gray-500">Popula o banco com todos os ISPs. Se já importou, re-executar é seguro (ignora duplicatas).</p>
              {importProg && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-cyan-400">Importando...</span>
                    <span className="text-gray-500">{importProg.processed.toLocaleString('pt-BR')} / {importProg.total.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                      style={{ width: `${(importProg.processed / importProg.total) * 100}%` }} />
                  </div>
                </div>
              )}
              {importMsg && !importProg && (
                <p className={`mt-2 text-xs ${importMsg.startsWith('✓') ? 'text-emerald-400' : 'text-red-400'}`}>{importMsg}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <button onClick={() => importFromData(false)} disabled={importing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-white disabled:opacity-40 transition-all whitespace-nowrap">
                {importing ? <Clock className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {importing ? 'Importando...' : 'Importar / Atualizar'}
              </button>
              <button onClick={() => importFromData(true)} disabled={importing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-amber-500/30 text-xs text-amber-400 hover:bg-amber-500/10 disabled:opacity-40 transition-all whitespace-nowrap">
                <Download className="w-3 h-3" /> Limpar e reimportar (corrige erros)
              </button>
            </div>
          </div>
        </div>

        {/* STEP 2 — AI Enrichment */}
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">02</span>
                <h3 className="text-sm font-semibold text-white">Buscar informações com Google + IA</h3>
              </div>
              <p className="text-xs text-gray-400">
                Para cada provedor, a IA busca no Google Places: cidade, estado, telefone, site e avaliação.
                Depois usa o site para extrair planos e preços.
              </p>

              {/* Enrichment progress bar */}
              {enrichStats && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Progresso de enriquecimento</span>
                    <span className="text-cyan-400 font-medium">{enrichStats.enriched.toLocaleString('pt-BR')} / {enrichStats.total.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${enrichStats.total > 0 ? (enrichStats.enriched / enrichStats.total) * 100 : 0}%` }} />
                  </div>
                  <p className="text-xs text-gray-500">{enrichStats.remaining.toLocaleString('pt-BR')} restantes</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
              <div className="flex gap-2">
                <select value={enrichUf} onChange={e => setEnrichUf(e.target.value)}
                  className="px-2 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 focus:outline-none focus:border-cyan-500/50">
                  <option value="">Todos estados</option>
                  {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={startEnrich} disabled={!enriching && enrichStats?.remaining === 0}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white transition-all whitespace-nowrap ${
                    enriching
                      ? enrichPaused ? 'bg-amber-600 hover:bg-amber-500' : 'bg-cyan-700 hover:bg-cyan-600'
                      : 'bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40'
                  }`}>
                  {enriching ? (
                    enrichPaused ? <><Play className="w-4 h-4" /> Retomar</> : <><Pause className="w-4 h-4" /> Pausar</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Iniciar Busca</>
                  )}
                </button>
                {enriching && (
                  <button onClick={stopEnrich}
                    className="px-3 py-2 rounded-lg border border-red-500/30 text-xs text-red-400 hover:bg-red-500/10 transition-all">
                    Parar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Live log */}
          {enrichLog.length > 0 && (
            <div className="border-t border-gray-800 pt-3">
              <button onClick={() => setShowLog(!showLog)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 mb-2">
                {showLog ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {enrichLog.length} resultados recentes
              </button>
              {showLog && (
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {enrichLog.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs py-1 border-b border-gray-800/50">
                      {r.found
                        ? <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        : <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />}
                      <span className="text-gray-300 truncate flex-1">{r.name}</span>
                      {r.found && (
                        <>
                          {r.uf && <span className="text-gray-500 flex-shrink-0">{r.municipio ? `${r.municipio}/${r.uf}` : r.uf}</span>}
                          {r.rating && <span className="text-amber-400 flex-shrink-0">★ {r.rating}</span>}
                          {r.website && <Globe className="w-3 h-3 text-cyan-400 flex-shrink-0" />}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Brazil state grid */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Passo 3 — Ver por Estado</h2>
              <p className="text-xs text-gray-500 mt-0.5">Após enriquecer, os estados vão aparecer com contagem de provedores</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-700 inline-block" />Vazio</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-cyan-500/30 inline-block" />Com dados</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500/30 inline-block" />Completo</span>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
            {BRAZIL_STATES.map(uf => {
              const st = states.find(s => s.uf === uf)
              const status = st?.status || 'pending'
              const isSelected = selectedUf === uf
              return (
                <button key={uf} onClick={() => setSelectedUf(isSelected ? null : uf)}
                  className={`rounded-lg border p-2 text-center transition-all ${STATUS_COLORS[status]} ${isSelected ? 'ring-2 ring-cyan-500' : 'hover:border-gray-600'}`}>
                  <div className="text-xs font-bold">{uf}</div>
                  {st?.totalProviders ? <div className="text-xs opacity-60 mt-0.5">{st.totalProviders}</div> : null}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected state */}
        {selectedUf && (
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">{STATE_NAMES[selectedUf]} ({selectedUf})</h3>
                <p className="text-xs text-gray-500 mt-0.5">{selected?.totalProviders?.toLocaleString('pt-BR') || 0} provedores mapeados</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/anatel/pesquisa?uf=${selectedUf}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 text-xs text-gray-300 hover:bg-gray-800 transition-all">
                  <Search className="w-3 h-3" /> Ver Provedores
                </Link>
                <button onClick={() => { setEnrichUf(selectedUf); startEnrich() }}
                  disabled={enriching}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs text-white disabled:opacity-40 transition-all">
                  <Sparkles className="w-3 h-3" /> Buscar {selectedUf} com IA
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
          </div>
        )}

        {/* Info */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 flex items-start gap-3">
          <BarChart3 className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500">
            Após enriquecer os provedores, acesse <Link href="/anatel/analise" className="text-cyan-400 hover:underline">Análise Comparativa</Link> para ver gráficos reais de preços e tecnologias. Use <Link href="/anatel/pesquisa" className="text-cyan-400 hover:underline">Pesquisar</Link> para buscar por cidade/estado.
          </p>
        </div>

      </div>
    </div>
  )
}
