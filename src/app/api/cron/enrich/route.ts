import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

// ⛔ Cron de enriquecimento desativado para controle de custos.
// Google Places API e Anthropic API foram bloqueadas em Jun/2026.

export async function GET() {
  return NextResponse.json({ idle: true, reason: 'APIs desativadas para controle de custos' })
}
