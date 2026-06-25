import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { prisma } from '@/lib/db'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const providersData = require('@/data/providers-xlsx.json') as {
  cnpj: string; razaoSocial: string; nomeFantasia: string
  uf: string; municipio: string; porte: string; situacao: string
}[]

export async function GET() {
  return NextResponse.json({ total: providersData.length })
}

export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const { offset = 0, limit = 500 } = await request.json().catch(() => ({}))
    const batch = providersData.slice(offset, offset + limit)

    if (batch.length === 0) {
      return NextResponse.json({ imported: 0, skipped: 0, done: true })
    }

    // Use createMany with skipDuplicates for speed
    const result = await prisma.provider.createMany({
      data: batch.map(p => ({
        cnpj: p.cnpj,
        razaoSocial: p.razaoSocial,
        nomeFantasia: p.nomeFantasia,
        uf: p.uf || '',
        municipio: p.municipio || '',
        porte: p.porte,
        situacao: p.situacao,
      })),
      skipDuplicates: true,
    })

    return NextResponse.json({
      imported: result.count,
      skipped: batch.length - result.count,
      offset,
      limit,
      processed: offset + batch.length,
      total: providersData.length,
      done: offset + batch.length >= providersData.length,
      source: 'xlsx_data',
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
