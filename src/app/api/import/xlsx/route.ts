import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { prisma } from '@/lib/db'

interface ProviderRow {
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  uf: string
  municipio: string
  porte: string
  situacao: string
}

export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const { providers } = await request.json() as { providers: ProviderRow[] }

    if (!Array.isArray(providers) || providers.length === 0) {
      return NextResponse.json({ error: 'No providers' }, { status: 400 })
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
            porte: p.porte,
            situacao: p.situacao,
          },
          create: {
            cnpj: p.cnpj,
            razaoSocial: p.razaoSocial,
            nomeFantasia: p.nomeFantasia,
            uf: p.uf || '',
            municipio: p.municipio || '',
            porte: p.porte,
            situacao: p.situacao,
          },
        })
        imported++
      } catch {
        skipped++
      }
    }

    return NextResponse.json({ imported, skipped, total: providers.length })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
