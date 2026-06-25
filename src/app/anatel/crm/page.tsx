'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

interface Plan {
  id: string; name: string; technology: string
  downloadSpeed: number; uploadSpeed: number; price: number; currency: string
}
interface Provider {
  id: string; nomeFantasia: string | null; razaoSocial: string
  cnpj: string | null; uf: string; municipio: string; porte: string | null
  situacao: string | null; crmColumnId: string | null; crmOrder: number; crmNotes: string | null
  googleRating: number | null; googleReviews: number | null; googleAddress: string | null
  googlePhone: string | null; googleWebsite: string | null; googleCategory: string | null
  websiteUrl: string | null; instagramUrl: string | null; facebookUrl: string | null
  enrichedAt: string | null; plans: Plan[]
}
interface Column {
  id: string; name: string; order: number; color: string
  _count?: { providers: number }
}
interface EnrichJob { id: string; type: string; status: string; processed: number; total: number }

const COLORS = ['#6b7280','#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#8b5cf6','#ec4899']

function StatusDot({ provider }: { provider: Provider }) {
  if (provider.enrichedAt && provider.googleRating) return <span className="w-2 h-2 rounded-full bg-green-400 inline-block" title="Enriquecido" />
  if (provider.enrichedAt) return <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" title="Pesquisado sem dados" />
  return <span className="w-2 h-2 rounded-full bg-gray-600 inline-block" title="Sem dados" />
}

function ProviderCard({ provider, onOpen, onDragStart }: {
  provider: Provider
  onOpen: (p: Provider) => void
  onDragStart: (e: React.DragEvent, p: Provider) => void
}) {
  const name = provider.nomeFantasia || provider.razaoSocial
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, provider)}
      onClick={() => onOpen(provider)}
      className="bg-gray-900 border border-gray-800 rounded-lg p-3 cursor-pointer hover:border-gray-600 transition-colors select-none"
    >
      <div className="flex items-start gap-2">
        <StatusDot provider={provider} />
        <div className="flex-1 min-w-0">
          <p className="text-gray-100 text-sm font-medium truncate">{name}</p>
          <p className="text-gray-500 text-xs mt-0.5">{provider.municipio}/{provider.uf}</p>
          {provider.plans.length > 0 && (
            <p className="text-cyan-500 text-xs mt-1">{provider.plans.length} plano{provider.plans.length !== 1 ? 's' : ''} · R$ {Math.min(...provider.plans.map(p => p.price)).toFixed(0)}/mês</p>
          )}
        </div>
      </div>
    </div>
  )
}

function ColumnPanel({ column, providers, total, pages, page, loading, onLoadMore, onDrop, onDragOver, onOpen, onDragStart, onRename, onDelete, onAddColumn }: {
  column: { id: string; name: string; color: string; count: number } | null // null = inbox
  providers: Provider[]
  total: number; pages: number; page: number; loading: boolean
  onLoadMore: () => void
  onDrop: (e: React.DragEvent, columnId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onOpen: (p: Provider) => void
  onDragStart: (e: React.DragEvent, p: Provider) => void
  onRename?: (id: string, name: string) => void
  onDelete?: (id: string) => void
  onAddColumn?: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(column?.name || '')
  const [over, setOver] = useState(false)
  const colId = column?.id || 'inbox'
  const colColor = column?.color || '#06b6d4'
  const colName = column?.name || 'Inbox'
  const count = column?.count ?? total

  return (
    <div
      className={`flex-shrink-0 w-72 flex flex-col rounded-xl border ${over ? 'border-gray-500' : 'border-gray-800'} bg-gray-950 transition-colors`}
      style={{ borderTopColor: colColor, borderTopWidth: 2 }}
      onDragOver={(e) => { e.preventDefault(); setOver(true); onDragOver(e) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { setOver(false); onDrop(e, colId) }}
    >
      {/* header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-800">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: colColor }} />
        {editing && column ? (
          <input
            autoFocus
            className="flex-1 bg-gray-800 text-gray-100 text-sm rounded px-1 py-0.5 outline-none"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onBlur={() => { setEditing(false); if (editName.trim() && onRename) onRename(column.id, editName.trim()) }}
            onKeyDown={e => { if (e.key === 'Enter') { setEditing(false); if (editName.trim() && onRename) onRename(column.id, editName.trim()) } }}
          />
        ) : (
          <span
            className={`flex-1 text-sm font-semibold text-gray-200 truncate ${column ? 'cursor-pointer hover:text-white' : ''}`}
            onClick={() => { if (column) { setEditing(true); setEditName(column.name) } }}
          >{colName}</span>
        )}
        <span className="text-xs text-gray-500 flex-shrink-0">{count}</span>
        {column && onDelete && (
          <button onClick={() => onDelete(column.id)} className="text-gray-600 hover:text-red-400 text-xs ml-1" title="Excluir coluna">✕</button>
        )}
        {onAddColumn && (
          <button onClick={onAddColumn} className="text-gray-600 hover:text-cyan-400 text-sm font-bold ml-1" title="Nova coluna">+</button>
        )}
      </div>

      {/* cards */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-24 max-h-[calc(100vh-220px)]">
        {providers.map(p => (
          <ProviderCard key={p.id} provider={p} onOpen={onOpen} onDragStart={onDragStart} />
        ))}
        {loading && <p className="text-center text-gray-600 text-xs py-2">Carregando…</p>}
        {!loading && page < pages && (
          <button onClick={onLoadMore} className="w-full text-xs text-gray-500 hover:text-gray-300 py-2 border border-dashed border-gray-800 rounded-lg">
            Carregar mais
          </button>
        )}
        {!loading && providers.length === 0 && (
          <p className="text-center text-gray-700 text-xs py-6">Arraste provedores aqui</p>
        )}
      </div>
    </div>
  )
}

function FichaModal({ provider, onClose, onSaveNotes }: {
  provider: Provider
  onClose: () => void
  onSaveNotes: (id: string, notes: string) => void
}) {
  const [notes, setNotes] = useState(provider.crmNotes || '')
  const [saving, setSaving] = useState(false)
  const saveTimeout = useRef<NodeJS.Timeout>()
  const name = provider.nomeFantasia || provider.razaoSocial

  const handleNotes = (v: string) => {
    setNotes(v)
    clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(async () => {
      setSaving(true)
      await fetch('/api/crm/providers', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ providerId: provider.id, crmNotes: v }) })
      onSaveNotes(provider.id, v)
      setSaving(false)
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div className="w-[480px] bg-gray-950 border-l border-gray-800 flex flex-col overflow-hidden">
        {/* header */}
        <div className="px-5 py-4 border-b border-gray-800 flex items-start justify-between">
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">{name}</h2>
            {provider.nomeFantasia && <p className="text-gray-500 text-xs mt-0.5">{provider.razaoSocial}</p>}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none mt-0.5">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Identidade */}
          <Section title="Identidade">
            <Row label="CNPJ" value={provider.cnpj || <span className="text-yellow-500 text-xs">Não encontrado</span>} />
            <Row label="UF" value={provider.uf} />
            <Row label="Município" value={provider.municipio} />
            <Row label="Porte" value={provider.porte} />
            <Row label="Situação" value={provider.situacao} />
          </Section>

          {/* Google */}
          {provider.enrichedAt && (
            <Section title="Google Meu Negócio">
              {provider.googleRating ? (
                <Row label="Avaliação" value={`⭐ ${provider.googleRating} (${provider.googleReviews?.toLocaleString('pt-BR')} avaliações)`} />
              ) : <p className="text-gray-600 text-xs">Não encontrado no Google</p>}
              <Row label="Endereço" value={provider.googleAddress} />
              <Row label="Telefone" value={provider.googlePhone} />
              <Row label="Website" value={provider.googleWebsite ? <a href={provider.googleWebsite} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline truncate block">{provider.googleWebsite}</a> : null} />
              <Row label="Categoria" value={provider.googleCategory} />
            </Section>
          )}

          {/* Contato */}
          {(provider.websiteUrl || provider.instagramUrl || provider.facebookUrl) && (
            <Section title="Contato">
              <Row label="Site" value={provider.websiteUrl ? <a href={provider.websiteUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">{provider.websiteUrl}</a> : null} />
              <Row label="Instagram" value={provider.instagramUrl ? <a href={provider.instagramUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">{provider.instagramUrl}</a> : null} />
              <Row label="Facebook" value={provider.facebookUrl ? <a href={provider.facebookUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">{provider.facebookUrl}</a> : null} />
            </Section>
          )}

          {/* Planos */}
          {provider.plans.length > 0 && (
            <Section title={`Planos (${provider.plans.length})`}>
              <div className="space-y-2">
                {provider.plans.map(pl => (
                  <div key={pl.id} className="bg-gray-900 rounded-lg px-3 py-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200 font-medium">{pl.name}</span>
                      <span className="text-cyan-400 font-bold">R$ {pl.price.toFixed(2)}</span>
                    </div>
                    <div className="text-gray-500 mt-0.5">{pl.technology} · {pl.downloadSpeed} Mbps ↓ / {pl.uploadSpeed} Mbps ↑</div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Notas */}
          <Section title="Notas">
            <textarea
              className="w-full bg-gray-900 border border-gray-800 rounded-lg text-gray-200 text-sm p-3 resize-none outline-none focus:border-gray-600 min-h-28"
              placeholder="Adicione observações sobre este provedor…"
              value={notes}
              onChange={e => handleNotes(e.target.value)}
            />
            {saving && <p className="text-gray-600 text-xs mt-1">Salvando…</p>}
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null
  return (
    <div className="flex gap-3">
      <span className="text-gray-500 text-xs w-24 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-gray-200 text-xs flex-1">{value}</span>
    </div>
  )
}

export default function CrmPage() {
  const [columns, setColumns] = useState<Column[]>([])
  const [inboxCount, setInboxCount] = useState(0)
  const [columnProviders, setColumnProviders] = useState<Record<string, Provider[]>>({})
  const [columnPages, setColumnPages] = useState<Record<string, { page: number; pages: number; total: number }>>({})
  const [loadingCols, setLoadingCols] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>()
  const [openProvider, setOpenProvider] = useState<Provider | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [jobs, setJobs] = useState<EnrichJob[]>([])
  const [addingCol, setAddingCol] = useState(false)
  const [newColName, setNewColName] = useState('')

  const loadColumns = useCallback(async () => {
    const res = await fetch('/api/crm/columns')
    const data = await res.json()
    setColumns(data.columns || [])
    setInboxCount(data.inbox || 0)
  }, [])

  const loadProviders = useCallback(async (colId: string, page = 1, s = search) => {
    setLoadingCols(prev => new Set(prev).add(colId))
    const res = await fetch(`/api/crm/providers?columnId=${colId}&page=${page}&search=${encodeURIComponent(s)}`)
    const data = await res.json()
    setColumnProviders(prev => ({
      ...prev,
      [colId]: page === 1 ? (data.providers || []) : [...(prev[colId] || []), ...(data.providers || [])],
    }))
    setColumnPages(prev => ({ ...prev, [colId]: { page, pages: data.pages || 1, total: data.total || 0 } }))
    setLoadingCols(prev => { const s = new Set(prev); s.delete(colId); return s })
  }, [search])

  const loadJobs = useCallback(async () => {
    const res = await fetch('/api/enrich/job')
    const data = await res.json()
    if (Array.isArray(data)) setJobs(data)
  }, [])

  useEffect(() => {
    loadColumns()
    loadJobs()
    const interval = setInterval(loadJobs, 5000)
    return () => clearInterval(interval)
  }, [loadColumns, loadJobs])

  useEffect(() => {
    if (columns.length === 0) return
    const allIds = ['inbox', ...columns.map(c => c.id)]
    allIds.forEach(id => loadProviders(id, 1, search))
  }, [columns]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (v: string) => {
    setSearch(v)
    clearTimeout(searchTimeout)
    setSearchTimeout(setTimeout(() => {
      const allIds = ['inbox', ...columns.map(c => c.id)]
      allIds.forEach(id => loadProviders(id, 1, v))
    }, 400))
  }

  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    if (!dragId) return
    const provider = Object.values(columnProviders).flat().find(p => p.id === dragId)
    if (!provider) return
    const sourceColId = provider.crmColumnId || 'inbox'
    if (sourceColId === targetColumnId) return

    await fetch('/api/crm/move', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ providerId: dragId, columnId: targetColumnId === 'inbox' ? null : targetColumnId }) })
    await Promise.all([loadProviders(sourceColId, 1), loadProviders(targetColumnId, 1)])
    await loadColumns()
    setDragId(null)
  }

  const handleRename = async (id: string, name: string) => {
    await fetch(`/api/crm/columns/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name }) })
    setColumns(prev => prev.map(c => c.id === id ? { ...c, name } : c))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir coluna? Os provedores voltam para o Inbox.')) return
    await fetch(`/api/crm/columns/${id}`, { method: 'DELETE' })
    await loadColumns()
    await loadProviders('inbox', 1)
  }

  const handleAddColumn = async () => {
    if (!newColName.trim()) return
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    await fetch('/api/crm/columns', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: newColName.trim(), color }) })
    setNewColName(''); setAddingCol(false)
    await loadColumns()
  }

  const toggleJob = async (type: string, currentStatus: string) => {
    const action = currentStatus === 'running' ? 'pause' : 'start'
    await fetch('/api/enrich/job', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type, action }) })
    loadJobs()
  }

  const googleJob = jobs.find(j => j.type === 'google_places')
  const cnpjJob = jobs.find(j => j.type === 'cnpj')

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Job status bar */}
      {(googleJob || cnpjJob) && (
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex gap-6 items-center text-xs">
          {googleJob && googleJob.status !== 'idle' && (
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${googleJob.status === 'running' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
              <span className="text-gray-400">Google: <span className="text-gray-200">{googleJob.status === 'running' ? 'Rodando' : 'Pausado'}</span> · {googleJob.processed.toLocaleString('pt-BR')} processados</span>
              <button onClick={() => toggleJob('google_places', googleJob.status)} className="text-cyan-400 hover:text-cyan-300 ml-1">
                {googleJob.status === 'running' ? 'Pausar' : 'Retomar'}
              </button>
            </div>
          )}
          {cnpjJob && cnpjJob.status !== 'idle' && (
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${cnpjJob.status === 'running' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
              <span className="text-gray-400">CNPJ: <span className="text-gray-200">{cnpjJob.status === 'running' ? 'Rodando' : 'Pausado'}</span> · {cnpjJob.processed.toLocaleString('pt-BR')} verificados</span>
              <button onClick={() => toggleJob('cnpj', cnpjJob.status)} className="text-cyan-400 hover:text-cyan-300 ml-1">
                {cnpjJob.status === 'running' ? 'Pausar' : 'Retomar'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-4">
        <h1 className="text-white font-bold text-lg">CRM Provedores</h1>
        <input
          type="search"
          placeholder="Buscar provedor…"
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="flex-1 max-w-sm bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-gray-600"
        />
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => { setAddingCol(true); setTimeout(() => document.getElementById('new-col-input')?.focus(), 50) }}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm px-3 py-1.5 rounded-lg border border-gray-700"
          >+ Nova coluna</button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-3 p-4 min-w-max min-h-full">
          {/* Inbox */}
          <ColumnPanel
            column={null}
            providers={columnProviders['inbox'] || []}
            total={inboxCount}
            pages={columnPages['inbox']?.pages || 1}
            page={columnPages['inbox']?.page || 1}
            loading={loadingCols.has('inbox')}
            onLoadMore={() => loadProviders('inbox', (columnPages['inbox']?.page || 1) + 1)}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onOpen={setOpenProvider}
            onDragStart={(e, p) => { e.dataTransfer.effectAllowed = 'move'; setDragId(p.id) }}
          />

          {/* User columns */}
          {columns.map((col, idx) => (
            <ColumnPanel
              key={col.id}
              column={{ id: col.id, name: col.name, color: col.color, count: col._count?.providers ?? (columnPages[col.id]?.total || 0) }}
              providers={columnProviders[col.id] || []}
              total={columnPages[col.id]?.total || 0}
              pages={columnPages[col.id]?.pages || 1}
              page={columnPages[col.id]?.page || 1}
              loading={loadingCols.has(col.id)}
              onLoadMore={() => loadProviders(col.id, (columnPages[col.id]?.page || 1) + 1)}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onOpen={setOpenProvider}
              onDragStart={(e, p) => { e.dataTransfer.effectAllowed = 'move'; setDragId(p.id) }}
              onRename={handleRename}
              onDelete={handleDelete}
              onAddColumn={idx === columns.length - 1 ? () => { setAddingCol(true); setTimeout(() => document.getElementById('new-col-input')?.focus(), 50) } : undefined}
            />
          ))}

          {/* Add column inline */}
          {addingCol && (
            <div className="flex-shrink-0 w-72 bg-gray-900 border border-gray-700 rounded-xl p-3 flex flex-col gap-2 self-start">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Nova coluna</p>
              <input
                id="new-col-input"
                className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-200 outline-none focus:border-gray-500"
                placeholder="Nome da coluna"
                value={newColName}
                onChange={e => setNewColName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddColumn(); if (e.key === 'Escape') setAddingCol(false) }}
              />
              <div className="flex gap-2">
                <button onClick={handleAddColumn} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg py-1.5">Criar</button>
                <button onClick={() => setAddingCol(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm rounded-lg py-1.5">Cancelar</button>
              </div>
            </div>
          )}

          {/* "+" button if no columns yet */}
          {columns.length === 0 && !addingCol && (
            <button
              onClick={() => { setAddingCol(true) }}
              className="flex-shrink-0 w-72 h-24 border border-dashed border-gray-800 rounded-xl text-gray-600 hover:text-gray-400 hover:border-gray-600 transition-colors self-start"
            >+ Nova coluna</button>
          )}
        </div>
      </div>

      {/* Ficha modal */}
      {openProvider && (
        <FichaModal
          provider={openProvider}
          onClose={() => setOpenProvider(null)}
          onSaveNotes={(id, notes) => {
            setOpenProvider(prev => prev?.id === id ? { ...prev, crmNotes: notes } : prev)
          }}
        />
      )}
    </div>
  )
}
