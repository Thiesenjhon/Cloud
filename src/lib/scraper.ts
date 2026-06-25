export interface ScrapedPage {
  url: string
  title: string
  text: string
  planSections: string[]
  priceElements: string[]
  speedElements: string[]
}

function extractText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return match ? match[1].trim() : ''
}

function extractSections(html: string): string[] {
  const planKeywords = ['plano', 'pacote', 'fibra', 'internet', 'velocidade', 'mega', 'mbps', 'giga']
  const sections: string[] = []
  const tagPattern = /<(section|div|article)[^>]*>([\s\S]*?)<\/\1>/gi
  let match
  while ((match = tagPattern.exec(html)) !== null) {
    const content = extractText(match[2])
    const lower = content.toLowerCase()
    const hits = planKeywords.filter(k => lower.includes(k))
    if (hits.length >= 2 && content.length > 50 && content.length < 2000) {
      sections.push(content)
    }
  }
  return Array.from(new Set(sections)).slice(0, 10)
}

function extractPrices(text: string): string[] {
  const results: string[] = []
  const re = /R\$\s*\d[\d.,]*.{0,50}/g
  let m
  while ((m = re.exec(text)) !== null) {
    results.push(m[0].slice(0, 200))
  }
  return Array.from(new Set(results)).slice(0, 20)
}

function extractSpeeds(text: string): string[] {
  const results: string[] = []
  const re = /\d+\s*(Mbps|Gbps|MB|GB|mega|giga).{0,50}/gi
  let m
  while ((m = re.exec(text)) !== null) {
    results.push(m[0].slice(0, 200))
  }
  return Array.from(new Set(results)).slice(0, 20)
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
    const title = extractTitle(html)
    const text = extractText(html).slice(0, 10000)
    const planSections = extractSections(html)
    const priceElements = extractPrices(text)
    const speedElements = extractSpeeds(text)

    return { url: normalizedUrl, title, text, planSections, priceElements, speedElements }
  } catch (error) {
    console.error(`Scrape error for ${url}:`, error)
    return null
  }
}
