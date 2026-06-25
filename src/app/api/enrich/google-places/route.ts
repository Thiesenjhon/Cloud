import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { findProviderOnGooglePlaces } from '@/lib/google-places'

export async function POST(request: NextRequest) {
  try {
    const { companyName, municipio, uf } = await request.json()

    if (!companyName || !municipio || !uf) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await findProviderOnGooglePlaces(companyName, municipio, uf)

    return NextResponse.json({ data: result })
  } catch (error) {
    return NextResponse.json({ error: 'Enrichment failed' }, { status: 500 })
  }
}
