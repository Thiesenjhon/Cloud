import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { prisma } from '@/lib/db'
import providersData from '@/data/providers-xlsx.json'

export async function POST() {
  if (!prisma) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const providers = providersData as {
      cnpj: string
      razaoSocial: string
      nomeFantasia: string
      uf: string
      municipio: string
      porte: string
      situacao: string
    }[]

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

    return NextResponse.json({ success: true, imported, skipped, total: providers.length, source: 'xlsx_data' })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
