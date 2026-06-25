'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

interface Plan {
  id: string
  name: string
  technology: string
  downloadSpeed: number
  uploadSpeed: number
  price: number
  currency: string
}

interface Provider {
  id: string
  nomeFantasia: string | null
  razaoSocial: string
  cnpj: string | null
  uf: string
  municipio: string
  porte: string | null
  situacao: string | null
  crmOrder: number
  crmNotes: string | null
  crmColumnId: string | null
  googleRating: number | null
  googleReviews: number | null
  googleAddress: string | null
  googlePhone: string | null
  googleWebsite: string | null
  googleCategory: string | null
  websiteUrl: string | null
  instagramUrl: string | null
  facebookUrl: string | null
  enrichedAt: string | null
  plans: Plan[]
}

interface CrmColumn {
  id: string
  name: string
  order: number
  color: string
  _count: { providers: number }
}

interface EnrichJob {
  id: string
  type: string
  status: string
  processed: number
  total: number
}

// ── Enrichment status dot ────────────────────────────────────────────────────

function EnrichDot({ provider }: { provider: Provider }) {
  if (provider.enrichedAt && provider.googleRating) {
    return <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" title="Enriched with rating" />
  }
  if (provider.enrichedAt) {
    return <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" title="Enriched, no rating" />
  }
  return <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="Not enriched" />
}

// ── Provider card ─────────────────────────────────────────────────────────────

function ProviderCard({
  provider,
  onDragStart,
  onClick,
}: {
  provider: Provider
  onDragStart: (e: React.DragEvent, providerId: string, sourceColumnId: string) => void
  onClick: (provider: Provider) => void
}) {
  const displayName = provider.nomeFantasia || provider.razaoSocial

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, provider.id, provider.crmColumnId ?? 'inbox')}
      onClick={() => onClick(provider)}
      className="bg-gray-900 border border-gray-800 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-gray-700 transition-colors select-none"
    >
      <div className="flex items-start gap-2">
        <EnrichDot provider={provider} />
        <div className="flex-1 min-w-0">
          <p className="text-gray-100 text-sm font-medium truncate">{displayName}</p>
          <p className="text-gray-400 text-xs truncate">{provider.municipio}, {provider.uf}</p>
          {provider.googleRating && (
            <p className="text-yellow-400 text-xs mt-1">★ {provider.googleRating} ({provider.googleReviews})</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Column ────────────────────────────────────────────────────────────────────

function KanbanColumn({
  id,
  name,
  color,
  count,
  providers,
  isInbox,
  onDragStart,
  onDrop,
  onCardClick,
  onRename,
  onDelete,
}: {
  id: string
  name: string
  color: string
  count: number
  providers: Provider[]
  isInbox: boolean
  onDragStart: (e: React.DragEvent, providerId: string, sourceColumnId: string) => void
  onDrop: (e: React.DragEvent, targetColumnId: string) => void
  onCardClick: (provider: Provider) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(name)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const borderColor = isInbox ? '#06b6d4' : color

  function handleRenameBlur() {
    setEditing(false)
    if (editName.trim() && editName !== name) {
      onRename(id, editName.trim())
    }
  }

  return (
    <div
      className={`flex-shrink-0 w-72 flex flex-col rounded-xl bg-gray-900/50 border border-gray-800 transition-colors ${dragOver ? 'border-cyan-500/60 bg-gray-900/80' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { setDragOver(false); onDrop(e, id) }}
    >
      {/* Colored top border */}
      <div className="h-1 rounded-t-xl" style={{ backgroundColor: borderColor }} />

      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1 gap-2">
        {editing && !isInbox ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRenameBlur}
            onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.blur() }}
            className="flex-1 bg-gray-800 text-gray-100 text-sm font-semibold px-2 py-0.5 rounded outline-none border border-cyan-500"
            autoFocus
          />
        ) : (
          <button
            className="flex-1 text-left text-sm font-semibold text-gray-100 truncate hover:text-cyan-400 transition-colors disabled:cursor-default"
            onClick={() => !isInbox && setEditing(true)}
            disabled={isInbox}
          >
            {name}
          </button>
        )}
        <span className="text-xs text-gray-500 flex-shrink-0 bg-gray-800 rounded-full px-2 py-0.5">{count}</span>
        {!isInbox && (
          <button
            onClick={() => onDelete(id)}
            className="text-gray-600 hover:text-red-400 transition-colors text-xs flex-shrink-0"
            title="Delete column"
          >
            ✕
          </button>
        )}
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 max-h-[calc(100vh-200px)]">
        {providers.length === 0 && (
          <div className="text-gray-700 text-xs text-center py-6">Drop cards here</div>
        )}
        {providers.map((p) => (
          <ProviderCard
            key={p.id}
            provider={p}
            onDragStart={onDragStart}
            onClick={onCardClick}
          />
        ))}
      </div>
    </div>
  )
}

// ── Provider Modal ────────────────────────────────────────────────────────────

function ProviderModal({
  provider,
  onClose,
  onNotesSave,
}: {
  provider: Provider
  onClose: () => void
  onNotesSave: (id: string, notes: string) => void
}) {
  const [notes, setNotes] = useState(provider.crmNotes ?? '')
  const displayName = provider.nomeFantasia || provider.razaoSocial

  function handleNotesBlur() {
    if (notes !== (provider.crmNotes ?? '')) {
      onNotesSave(provider.id, notes)
    }
  }

  function stars(rating: number) {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
  }

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/50" />
      <div
        className="w-[420px] bg-gray-950 border-l border-gray-800 h-full overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-gray-100 truncate">{displayName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl ml-2">✕</button>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* Identidade */}
          <section>
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Identidade</h3>
            <div className="space-y-1 text-sm">
              {provider.nomeFantasia && <Row label="Nome Fantasia" value={provider.nomeFantasia} />}
              <Row label="Razão Social" value={provider.razaoSocial} />
              {provider.cnpj && <Row label="CNPJ" value={provider.cnpj} />}
              <Row label="UF" value={provider.uf} />
              <Row label="Município" value={provider.municipio} />
              {provider.porte && <Row label="Porte" value={provider.porte} />}
              {provider.situacao && <Row label="Situação" value={provider.situacao} />}
            </div>
          </section>

          {/* Google */}
          {(provider.googleRating || provider.googleAddress) && (
            <section>
              <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Google</h3>
              <div className="space-y-1 text-sm">
                {provider.googleRating && (
                  <Row label="Rating" value={`${stars(provider.googleRating)} ${provider.googleRating} (${provider.googleReviews} avaliações)`} />
                )}
                {provider.googleAddress && <Row label="Endereço" value={provider.googleAddress} />}
                {provider.googlePhone && <Row label="Telefone" value={provider.googlePhone} />}
                {provider.googleWebsite && (
                  <Row label="Site (Google)" value={<a href={provider.googleWebsite} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline truncate">{provider.googleWebsite}</a>} />
                )}
                {provider.googleCategory && <Row label="Categoria" value={provider.googleCategory} />}
              </div>
            </section>
          )}

          {/* Contato */}
          {(provider.websiteUrl || provider.instagramUrl || provider.facebookUrl) && (
            <section>
              <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Contato</h3>
              <div className="space-y-1 text-sm">
                {provider.websiteUrl && (
                  <Row label="Website" value={<a href={provider.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline truncate">{provider.websiteUrl}</a>} />
                )}
                {provider.instagramUrl && (
                  <Row label="Instagram" value={<a href={provider.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline truncate">{provider.instagramUrl}</a>} />
                )}
                {provider.facebookUrl && (
                  <Row label="Facebook" value={<a href={provider.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline truncate">{provider.facebookUrl}</a>} />
                )}
              </div>
            </section>
          )}

          {/* Planos */}
          {provider.plans.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Planos</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-gray-300">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-800">
                      <th className="text-left py-1 pr-2">Nome</th>
                      <th className="text-left py-1 pr-2">Tech</th>
                      <th className="text-right py-1 pr-2">Down</th>
                      <th className="text-right py-1">Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provider.plans.map((plan) => (
                      <tr key={plan.id} className="border-b border-gray-900 hover:bg-gray-900/50">
                        <td className="py-1 pr-2 truncate max-w-[100px]">{plan.name}</td>
                        <td className="py-1 pr-2">{plan.technology}</td>
                        <td className="py-1 pr-2 text-right">{plan.downloadSpeed}M</td>
                        <td className="py-1 text-right text-green-400">R$ {plan.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Notas */}
          <section>
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Notas</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Adicionar notas sobre este provedor..."
              className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-500/50 transition-colors"
              rows={4}
            />
          </section>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-500 flex-shrink-0 w-28">{label}:</span>
      <span className="text-gray-200 flex-1 min-w-0">{value}</span>
    </div>
  )
}

// ── Job status bar ─────────────────────────────────────────────────────────────

function JobStatusBar() {
  const [jobs, setJobs] = useState<EnrichJob[]>([])

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/enrich/job')
      if (res.ok) setJobs(await res.json())
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    fetchJobs()
    const interval = setInterval(fetchJobs, 5000)
    return () => clearInterval(interval)
  }, [fetchJobs])

  async function handleAction(type: string, action: string) {
    await fetch('/api/enrich/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, action }),
    })
    fetchJobs()
  }

  const typeLabels: Record<string, string> = {
    google_places: 'Google Places',
    cnpj: 'CNPJ',
  }

  const statusColors: Record<string, string> = {
    idle: 'text-gray-500',
    running: 'text-green-400',
    paused: 'text-yellow-400',
    done: 'text-cyan-400',
  }

  const allTypes = ['google_places', 'cnpj']

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center gap-6 flex-wrap">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrich Jobs</span>
      {allTypes.map((type) => {
        const job = jobs.find((j) => j.type === type)
        const status = job?.status ?? 'idle'
        return (
          <div key={type} className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{typeLabels[type] ?? type}:</span>
            <span className={`text-xs font-semibold ${statusColors[status] ?? 'text-gray-400'}`}>{status}</span>
            {job && <span className="text-xs text-gray-600">({job.processed} processados)</span>}
            <div className="flex gap-1">
              {status !== 'running' && (
                <button
                  onClick={() => handleAction(type, 'start')}
                  className="text-xs bg-green-900/50 hover:bg-green-800/60 text-green-400 px-2 py-0.5 rounded transition-colors"
                >
                  ▶
                </button>
              )}
              {status === 'running' && (
                <button
                  onClick={() => handleAction(type, 'pause')}
                  className="text-xs bg-yellow-900/50 hover:bg-yellow-800/60 text-yellow-400 px-2 py-0.5 rounded transition-colors"
                >
                  ⏸
                </button>
              )}
              {status !== 'idle' && (
                <button
                  onClick={() => handleAction(type, 'stop')}
                  className="text-xs bg-red-900/50 hover:bg-red-800/60 text-red-400 px-2 py-0.5 rounded transition-colors"
                >
                  ■
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CrmPage() {
  const [columns, setColumns] = useState<CrmColumn[]>([])
  const [providers, setProviders] = useState<Record<string, Provider[]>>({})
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [addingColumn, setAddingColumn] = useState(false)
  const [newColumnName, setNewColumnName] = useState('')
  const [newColumnColor, setNewColumnColor] = useState('#6b7280')
  const dragRef = useRef<{ providerId: string; sourceColumnId: string } | null>(null)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const fetchColumns = useCallback(async () => {
    try {
      const res = await fetch('/api/crm/columns')
      if (res.ok) setColumns(await res.json())
    } catch { /* ignore */ }
  }, [])

  const fetchProviders = useCallback(async (columnId: string) => {
    try {
      const params = new URLSearchParams({ columnId })
      if (debouncedSearch) params.set('search', debouncedSearch)
      const res = await fetch(`/api/crm/providers?${params}`)
      if (res.ok) {
        const data = await res.json()
        setProviders((prev) => ({ ...prev, [columnId]: data.providers }))
        setCounts((prev) => ({ ...prev, [columnId]: data.total }))
      }
    } catch { /* ignore */ }
  }, [debouncedSearch])

  useEffect(() => {
    fetchColumns()
  }, [fetchColumns])

  // Fetch providers for all columns (including inbox) when columns or search changes
  useEffect(() => {
    const allIds = ['inbox', ...columns.map((c) => c.id)]
    allIds.forEach((id) => fetchProviders(id))
  }, [columns, fetchProviders, debouncedSearch])

  function handleDragStart(e: React.DragEvent, providerId: string, sourceColumnId: string) {
    dragRef.current = { providerId, sourceColumnId }
    e.dataTransfer.effectAllowed = 'move'
  }

  async function handleDrop(e: React.DragEvent, targetColumnId: string) {
    e.preventDefault()
    if (!dragRef.current) return
    const { providerId, sourceColumnId } = dragRef.current
    dragRef.current = null
    if (sourceColumnId === targetColumnId) return

    await fetch('/api/crm/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providerId, columnId: targetColumnId }),
    })

    // Refetch both affected columns
    fetchProviders(sourceColumnId)
    fetchProviders(targetColumnId)
    fetchColumns() // update counts
  }

  async function handleRename(id: string, name: string) {
    await fetch(`/api/crm/columns/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    fetchColumns()
  }

  async function handleDelete(id: string) {
    if (!confirm('Deletar coluna? Os provedores voltarão para Inbox.')) return
    await fetch(`/api/crm/columns/${id}`, { method: 'DELETE' })
    fetchColumns()
    fetchProviders('inbox')
  }

  async function handleAddColumn() {
    if (!newColumnName.trim()) return
    await fetch('/api/crm/columns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newColumnName.trim(), color: newColumnColor }),
    })
    setNewColumnName('')
    setNewColumnColor('#6b7280')
    setAddingColumn(false)
    fetchColumns()
  }

  async function handleNotesSave(id: string, notes: string) {
    await fetch(`/api/crm/providers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crmNotes: notes }),
    })
    // Update local state
    setProviders((prev) => {
      const updated = { ...prev }
      for (const key of Object.keys(updated)) {
        updated[key] = updated[key].map((p) =>
          p.id === id ? { ...p, crmNotes: notes } : p
        )
      }
      return updated
    })
    if (selectedProvider?.id === id) {
      setSelectedProvider((p) => p ? { ...p, crmNotes: notes } : p)
    }
  }

  const allColumnDefs = [
    { id: 'inbox', name: 'Inbox', color: '#06b6d4', isInbox: true },
    ...columns.map((c) => ({ id: c.id, name: c.name, color: c.color, isInbox: false })),
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Job status bar */}
      <JobStatusBar />

      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <a href="/anatel" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">← Dashboard</a>
          <span className="text-gray-700">/</span>
          <span className="text-cyan-400 font-semibold text-sm">CRM Provedores</span>
          <a href="/anatel/coleta" className="text-gray-500 hover:text-gray-300 text-sm transition-colors ml-2">Coleta</a>
          <a href="/anatel/pesquisa" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Pesquisa</a>
        </div>
        <div className="flex-1 max-w-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar provedores..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-6 min-w-max h-full">
          {allColumnDefs.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              name={col.name}
              color={col.color}
              count={counts[col.id] ?? 0}
              providers={providers[col.id] ?? []}
              isInbox={col.isInbox}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onCardClick={setSelectedProvider}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ))}

          {/* Add column */}
          <div className="flex-shrink-0 w-72">
            {addingColumn ? (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 space-y-2">
                <input
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddColumn(); if (e.key === 'Escape') setAddingColumn(false) }}
                  placeholder="Nome da coluna"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">Cor:</label>
                  <input
                    type="color"
                    value={newColumnColor}
                    onChange={(e) => setNewColumnColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddColumn}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-sm py-1.5 rounded-lg transition-colors"
                  >
                    Criar
                  </button>
                  <button
                    onClick={() => setAddingColumn(false)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-1.5 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingColumn(true)}
                className="w-full h-12 border-2 border-dashed border-gray-800 hover:border-cyan-500/50 text-gray-600 hover:text-cyan-400 rounded-xl text-sm font-medium transition-colors"
              >
                + Nova coluna
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Provider modal */}
      {selectedProvider && (
        <ProviderModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
          onNotesSave={handleNotesSave}
        />
      )}
    </div>
  )
}
