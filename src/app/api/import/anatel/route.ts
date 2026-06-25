import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { prisma } from '@/lib/db'
import { getMockProviders } from '@/lib/anatel'

// Real ANATEL SCM dataset on dados.gov.br
const ANATEL_API = 'https://dados.gov.br/api/3/action/datastore_search'
const RESOURCE_IDS = [
  'f18fbf34-4b82-4ca3-9e57-5bc1e5c5b32e', // SCM outorgas
  '9b40ba79-bb40-4a41-9bff-58dc6d0ef44e', // alternative
]

async function fetchFromAnatel(): Promise<{ cnpj: string; razaoSocial: string; nomeFantasia?: string; uf: string; municipio: string; porte?: string; situacao?: string }[]> {
  for (const resourceId of RESOURCE_IDS) {
    try {
      const res = await fetch(`${ANATEL_API}?resource_id=${resourceId}&limit=5000`, {
        headers: { 'User-Agent': 'AnatelResearch/1.0' },
        signal: AbortSignal.timeout(20000),
      })
      if (!res.ok) continue
      const data = await res.json()
      const records = data.result?.records
      if (!records?.length) continue

      return records.map((r: Record<string, string>) => ({
        cnpj: (r['CNPJ'] || r['cnpj'] || '').replace(/\D/g, ''),
        razaoSocial: r['Razão Social'] || r['RAZAO_SOCIAL'] || r['razao_social'] || '',
        nomeFantasia: r['Nome Fantasia'] || r['NOME_FANTASIA'] || r['nome_fantasia'] || undefined,
        uf: r['UF'] || r['uf'] || '',
        municipio: r['Município'] || r['MUNICIPIO'] || r['municipio'] || '',
        porte: r['Porte'] || r['PORTE'] || r['porte'] || undefined,
        situacao: r['Situação'] || r['SITUACAO'] || r['situacao'] || undefined,
      })).filter((p: { cnpj: string; razaoSocial: string }) => p.cnpj && p.razaoSocial)
    } catch {
      continue
    }
  }
  return []
}

export async function POST() {
  if (!prisma) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    // Try real ANATEL API first, fall back to mock
    let providers = await fetchFromAnatel()
    const source = providers.length > 0 ? 'anatel_api' : 'mock'

    if (!providers.length) {
      providers = getMockProviders().map(p => ({
        cnpj: p.cnpj,
        razaoSocial: p.razaoSocial,
        nomeFantasia: p.nomeFantasia,
        uf: p.uf,
        municipio: p.municipio,
        porte: p.porte,
        situacao: p.situacao,
      }))
    }

    let imported = 0
    let skipped = 0

    for (const p of providers) {
      try {
        await prisma.provider.upsert({
          where: { cnpj: p.cnpj },
          update: {
            razaoSocial: p.razaoSocial,
            nomeFantasia: p.nomeFantasia,
            uf: p.uf,
            municipio: p.municipio,
            porte: p.porte,
            situacao: p.situacao,
          },
          create: {
            cnpj: p.cnpj,
            razaoSocial: p.razaoSocial,
            nomeFantasia: p.nomeFantasia,
            uf: p.uf,
            municipio: p.municipio,
            porte: p.porte,
            situacao: p.situacao,
          },
        })
        imported++
      } catch {
        skipped++
      }
    }

    return NextResponse.json({ success: true, imported, skipped, source, total: providers.length })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
