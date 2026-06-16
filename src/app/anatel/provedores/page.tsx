'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, MapPin, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { AnatelProvider } from '@/types/provider'

const STATES = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

const PORTE_COLORS: Record<string, string> = {
  MICRO: 'bg-gray-100 text-gray-700',
  PEQUENO: 'bg-blue-100 text-blue-700',
  MEDIO: 'bg-green-100 text-green-700',
  GRANDE: 'bg-purple-100 text-purple-700',
}

export default function ProvedoresPage() {
  const [providers, setProviders] = useState<AnatelProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [uf, setUf] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchProviders = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) params.set('search', search)
    if (uf && uf !== 'all') params.set('uf', uf)

    try {
      const res = await fetch(`/api/providers?${params}`)
      const data = await res.json()
      setProviders(data.data || [])
      setTotalPages(data.pages || 1)
      setTotal(data.total || 0)
    } finally {
      setLoading(false)
    }
  }, [search, uf, page])

  useEffect(() => { fetchProviders() }, [fetchProviders])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/anatel"><ArrowLeft className="w-4 h-4" /></Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Provedores Homologados</h1>
              <p className="text-sm text-slate-500">{total.toLocaleString('pt-BR')} provedores encontrados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar por nome, cidade..."
              className="pl-9"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <Select value={uf} onValueChange={v => { setUf(v); setPage(1) }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os estados</SelectItem>
              {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map(provider => (
              <Card key={provider.cnpj} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {provider.nomeFantasia || provider.razaoSocial}
                        </h3>
                        {provider.porte && (
                          <Badge className={`text-xs ${PORTE_COLORS[provider.porte] || 'bg-gray-100 text-gray-700'}`} variant="outline">
                            {provider.porte}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mb-2">{provider.razaoSocial}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {provider.municipio}, {provider.uf}
                        </span>
                        {provider.situacao && (
                          <Badge className="text-xs bg-green-50 text-green-700" variant="outline">
                            {provider.situacao}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="text-xs font-mono text-slate-400">{provider.cnpj.slice(0, 8)}...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-slate-500">Página {page} de {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
