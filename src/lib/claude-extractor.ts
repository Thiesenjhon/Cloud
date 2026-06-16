import Anthropic from '@anthropic-ai/sdk'
import type { ExtractedPlan } from '@/types/provider'
import type { ScrapedPage } from './scraper'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function extractPlansFromPage(
  scrapedPage: ScrapedPage,
  providerName: string
): Promise<ExtractedPlan[]> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return getMockPlans(providerName)
  }

  const content = [
    `Provedor: ${providerName}`,
    `URL: ${scrapedPage.url}`,
    `Título: ${scrapedPage.title}`,
    '',
    'Seções com planos:',
    scrapedPage.planSections.join('\n---\n'),
    '',
    'Elementos de preço encontrados:',
    scrapedPage.priceElements.join(' | '),
    '',
    'Elementos de velocidade encontrados:',
    scrapedPage.speedElements.join(' | '),
    '',
    'Texto geral da página:',
    scrapedPage.text.slice(0, 3000),
  ].join('\n')

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Você é um especialista em análise de planos de internet de provedores brasileiros.
Analise o conteúdo abaixo de um site de provedor e extraia TODOS os planos de internet encontrados.

Para cada plano, retorne um JSON com:
- name: nome do plano
- technology: "FIBRA", "RADIO", "CABO", ou "DSL"
- downloadSpeed: velocidade de download em Mbps (número inteiro)
- uploadSpeed: velocidade de upload em Mbps (número inteiro)
- price: preço mensal em reais (número decimal, sem R$)
- hasStreaming: true se inclui algum streaming (Netflix, Globoplay, etc)
- hasFixedIp: true se inclui IP fixo
- hasSecurity: true se inclui câmera ou alarme
- hasPhone: true se inclui telefone
- hasTV: true se inclui TV a cabo ou streaming de TV
- svaDetails: string descrevendo os SVAs incluídos
- contractMonths: meses de contrato (null se não mencionado)
- installationFee: taxa de instalação em reais (null se não mencionada ou gratuita)
- confidence: número de 0 a 1 indicando sua confiança na extração

Retorne APENAS um array JSON válido, sem texto adicional. Se não encontrar planos, retorne [].

Conteúdo do site:
${content}`,
      },
    ],
  })

  try {
    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return []

    const plans = JSON.parse(jsonMatch[0]) as ExtractedPlan[]
    return plans.filter(p => p.downloadSpeed > 0 && p.price > 0)
  } catch {
    return []
  }
}

function getMockPlans(providerName: string): ExtractedPlan[] {
  const technologies = ['FIBRA', 'RADIO', 'FIBRA', 'FIBRA']
  const speeds = [100, 200, 300, 500, 1000]
  const basePrices = [59.90, 79.90, 99.90, 129.90, 179.90]

  const numPlans = 2 + Math.floor(Math.random() * 3)

  return Array.from({ length: numPlans }, (_, i) => ({
    name: `Plano ${speeds[i]}M`,
    technology: technologies[i % technologies.length],
    downloadSpeed: speeds[i],
    uploadSpeed: Math.floor(speeds[i] * 0.3),
    price: basePrices[i],
    hasStreaming: i >= 1,
    hasFixedIp: i >= 2,
    hasSecurity: false,
    hasPhone: false,
    hasTV: i >= 2,
    svaDetails: i >= 1 ? 'Globoplay incluso' : '',
    contractMonths: 12,
    installationFee: i === 0 ? 0 : null,
    confidence: 0.95,
  }))
}
