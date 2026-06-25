import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { prisma } from '@/lib/db'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

async function findCnpjViaBrasilAPI(cnpj: string): Promise<boolean> {
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj.replace(/\D/g, '')}`, {
      signal: AbortSignal.timeout(5000),
    })
    return res.ok
  } catch { return false }
}

async function findCnpjForProvider(name: string, municipio?: string, uf?: string): Promise<string | null> {
  try {
    const location = [municipio, uf].filter(Boolean).join(', ')
    const prompt = `Você é um assistente especializado em empresas brasileiras de telecomunicações.

Encontre o CNPJ da empresa "${name}"${location ? ` localizada em ${location}` : ''}, que é um provedor de internet (ISP) brasileiro.

Responda APENAS com o CNPJ no formato 00.000.000/0001-00, ou "NÃO ENCONTRADO" se não souber com certeza.
Não invente CNPJs. Só responda se tiver certeza absoluta.`

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = (message.content[0] as { text: string }).text.trim()
    if (text === 'NÃO ENCONTRADO' || !text.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/)) return null

    const cnpjMatch = text.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/)
    if (!cnpjMatch) return null

    const cnpj = cnpjMatch[0].replace(/\D/g, '')
    // Validate with BrasilAPI
    const valid = await findCnpjViaBrasilAPI(cnpj)
    return valid ? cnpj : null
  } catch { return null }
}

export async function GET() {
  if (!prisma) return NextResponse.json({ withCnpj: 0, withoutCnpj: 0, total: 0 })
  try {
    const [withCnpj, total] = await Promise.all([
      prisma.provider.count({ where: { cnpj: { not: null }, cnpjVerificado: true } }),
      prisma.provider.count(),
    ])
    return NextResponse.json({ withCnpj, withoutCnpj: total - withCnpj, total })
  } catch { return NextResponse.json({ withCnpj: 0, withoutCnpj: 0, total: 0 }) }
}

export async function POST(request: NextRequest) {
  if (!prisma) return NextResponse.json({ error: 'no db' }, { status: 503 })

  try {
    const { limit = 5 } = await request.json().catch(() => ({}))

    // Get providers without verified CNPJ
    const providers = await prisma.provider.findMany({
      where: { OR: [{ cnpj: null }, { cnpjVerificado: false }] },
      take: limit,
      select: { id: true, razaoSocial: true, nomeFantasia: true, municipio: true, uf: true },
    })

    const results = []

    for (const p of providers) {
      const name = p.nomeFantasia || p.razaoSocial
      const cnpj = await findCnpjForProvider(name, p.municipio || undefined, p.uf || undefined)

      if (cnpj) {
        // Check if CNPJ already used by another provider
        const existing = await prisma.provider.findUnique({ where: { cnpj } })
        if (!existing) {
          await prisma.provider.update({
            where: { id: p.id },
            data: { cnpj, cnpjVerificado: true, cnpjFonte: 'ai_claude' },
          })
          results.push({ name, cnpj, found: true })
        } else {
          // Mark as duplicate found
          await prisma.provider.update({
            where: { id: p.id },
            data: { cnpjFonte: 'duplicata_cnpj' },
          })
          results.push({ name, cnpj: null, found: false, reason: 'CNPJ já pertence a outro provedor' })
        }
      } else {
        await prisma.provider.update({
          where: { id: p.id },
          data: { cnpjFonte: 'nao_encontrado' },
        })
        results.push({ name, cnpj: null, found: false, reason: 'Não encontrado' })
      }
    }

    const stats = await prisma.provider.count({ where: { cnpjVerificado: true } })
    const total = await prisma.provider.count()

    return NextResponse.json({ processed: results.length, results, verifiedTotal: stats, grandTotal: total })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
