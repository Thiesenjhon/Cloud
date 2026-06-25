import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { scrapeProviderWebsite } from '@/lib/scraper'
import { extractPlansFromPage } from '@/lib/claude-extractor'

export async function POST(request: NextRequest) {
  try {
    const { websiteUrl, providerName } = await request.json()

    if (!websiteUrl || !providerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const scraped = await scrapeProviderWebsite(websiteUrl)
    if (!scraped) {
      return NextResponse.json({ error: 'Failed to scrape website' }, { status: 422 })
    }

    const plans = await extractPlansFromPage(scraped, providerName)

    return NextResponse.json({
      data: { scraped, plans },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Extraction failed' }, { status: 500 })
  }
}
