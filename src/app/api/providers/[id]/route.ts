import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  if (!prisma) return NextResponse.json({ error: 'no db' }, { status: 503 })
  try {
    const provider = await prisma.provider.findUnique({
      where: { id: params.id },
      include: { plans: { orderBy: { price: 'asc' } } },
    })
    if (!provider) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json(provider)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
