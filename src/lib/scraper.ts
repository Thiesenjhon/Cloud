import * as cheerio from 'cheerio'

export interface ScrapedPage {
  url: string
  title: string
  text: string
  planSections: string[]
  priceElements: string[]
  speedElements: string[]
}

export async function scrapeProviderWebsite(url: string): Promise<ScrapedPage | null> {
  try {
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AnatelResearch/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
    })
    clearTimeout(timeout)

    if (!response.ok) return null

    const html = await response.text()
    const $ = cheerio.load(html)

    $('script, style, nav, footer, header').remove()

    const title = $('title').text().trim()
    const text = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 10000)

    const planKeywords = ['plano', 'pacote', 'fibra', 'internet', 'velocidade', 'mega', 'mbps', 'giga']
    const planSections: string[] = []

    $('section, div, article').each((_, el) => {
      const elText = $(el).text().toLowerCase()
      const matches = planKeywords.filter(k => elText.includes(k))
      if (matches.length >= 2) {
        const content = $(el).text().replace(/\s+/g, ' ').trim()
        if (content.length > 50 && content.length < 2000) {
          planSections.push(content)
        }
      }
    })

    const priceElements: string[] = []
    $('*').each((_, el) => {
      const text = $(el).children().length === 0 ? $(el).text().trim() : ''
      if (text.match(/R\$\s*\d+[\d.,]*/)) {
        priceElements.push(text.slice(0, 200))
      }
    })

    const speedElements: string[] = []
    $('*').each((_, el) => {
      const text = $(el).children().length === 0 ? $(el).text().trim() : ''
      if (text.match(/\d+\s*(Mbps|Gbps|MB|GB|mega|giga)/i)) {
        speedElements.push(text.slice(0, 200))
      }
    })

    return {
      url: normalizedUrl,
      title,
      text,
      planSections: Array.from(new Set(planSections)).slice(0, 10),
      priceElements: Array.from(new Set(priceElements)).slice(0, 20),
      speedElements: Array.from(new Set(speedElements)).slice(0, 20),
    }
  } catch (error) {
    console.error(`Scrape error for ${url}:`, error)
    return null
  }
}
