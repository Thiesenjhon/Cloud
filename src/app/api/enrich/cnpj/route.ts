import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'

// ⛔ Anthropic API (Claude) desativada para controle de custos.
// Para reativar: remova este bloqueio e configure ANTHROPIC_API_KEY no Vercel.

export async function POST() {
  return NextResponse.json(
    { error: 'Anthropic API desativada. Ative em /api/enrich/cnpj quando necessário.' },
    { status: 503 }
  )
}

export async function GET() {
  if (!prisma) return NextResponse.json({ withCnpj: 0, withoutCnpj: 0, total: 0 })
  try {
    const [withCnpj, total] = await Promise.all([
      prisma.provider.count({ where: { cnpj: { not: null }, cnpjVerificado: true } }),
      prisma.provider.count(),
    ])
    return NextResponse.json({ withCnpj, withoutCnpj: total - withCnpj, total })
  } catch {
    return NextResponse.json({ withCnpj: 0, withoutCnpj: 0, total: 0 })
  }
}
