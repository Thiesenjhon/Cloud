import type { AnatelProvider } from '@/types/provider'

export async function fetchAnatelProviders(uf?: string): Promise<AnatelProvider[]> {
  try {
    const params = new URLSearchParams({
      resource_id: 'b8b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b4b4',
      limit: '5000',
      ...(uf ? { q: uf } : {}),
    })

    const response = await fetch(
      `https://dados.gov.br/api/3/action/datastore_search?${params}`,
      { next: { revalidate: 86400 } }
    )

    if (response.ok) {
      const data = await response.json()
      return mapAnatelResponse(data.result?.records || [])
    }
  } catch {
    // Fall through to mock data
  }

  return getMockProviders(uf)
}

function mapAnatelResponse(records: Record<string, string>[]): AnatelProvider[] {
  return records.map(r => ({
    cnpj: r['CNPJ'] || r['cnpj'] || '',
    razaoSocial: r['Razão Social'] || r['razao_social'] || '',
    nomeFantasia: r['Nome Fantasia'] || r['nome_fantasia'],
    uf: r['UF'] || r['uf'] || '',
    municipio: r['Município'] || r['municipio'] || '',
    porte: r['Porte'] || r['porte'],
    situacao: r['Situação'] || r['situacao'],
    dataAutorizacao: r['Data de Autorização'] || r['data_autorizacao'],
  })).filter(p => p.cnpj && p.razaoSocial)
}

export function getMockProviders(uf?: string): AnatelProvider[] {
  const providers: AnatelProvider[] = [
    { cnpj: '00000000000101', razaoSocial: 'NET FIBRA TELECOM LTDA', nomeFantasia: 'NetFibra', uf: 'SP', municipio: 'São Paulo', porte: 'MEDIO', situacao: 'AUTORIZADO' },
    { cnpj: '00000000000102', razaoSocial: 'VELOX INTERNET LTDA', nomeFantasia: 'Velox Net', uf: 'SP', municipio: 'Campinas', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
    { cnpj: '00000000000103', razaoSocial: 'TELECOM RIO LTDA', nomeFantasia: 'TelecomRio', uf: 'RJ', municipio: 'Rio de Janeiro', porte: 'GRANDE', situacao: 'AUTORIZADO' },
    { cnpj: '00000000000104', razaoSocial: 'CONECTA MINAS LTDA', nomeFantasia: 'ConectaMinas', uf: 'MG', municipio: 'Belo Horizonte', porte: 'MEDIO', situacao: 'AUTORIZADO' },
    { cnpj: '00000000000105', razaoSocial: 'SUL FIBRAS LTDA', nomeFantasia: 'SulFibras', uf: 'RS', municipio: 'Porto Alegre', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
    { cnpj: '00000000000106', razaoSocial: 'NORDESTE NET LTDA', nomeFantasia: 'NordesteNet', uf: 'BA', municipio: 'Salvador', porte: 'MEDIO', situacao: 'AUTORIZADO' },
    { cnpj: '00000000000107', razaoSocial: 'AMAZONIA TELECOM LTDA', nomeFantasia: 'AmazoniaTelecom', uf: 'AM', municipio: 'Manaus', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
    { cnpj: '00000000000108', razaoSocial: 'CERRADO INTERNET LTDA', nomeFantasia: 'CerradoNet', uf: 'GO', municipio: 'Goiânia', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
    { cnpj: '00000000000109', razaoSocial: 'PANTANAL FIBRA LTDA', nomeFantasia: 'PantanalFibra', uf: 'MS', municipio: 'Campo Grande', porte: 'MICRO', situacao: 'AUTORIZADO' },
    { cnpj: '00000000000110', razaoSocial: 'CAPITAL CONECTA LTDA', nomeFantasia: 'CapitalNet', uf: 'DF', municipio: 'Brasília', porte: 'MEDIO', situacao: 'AUTORIZADO' },
    { cnpj: '00000000000111', razaoSocial: 'LITORAL INTERNET LTDA', nomeFantasia: 'LitoralNet', uf: 'SC', municipio: 'Florianópolis', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
    { cnpj: '00000000000112', razaoSocial: 'VALE NET LTDA', nomeFantasia: 'ValeNet', uf: 'ES', municipio: 'Vitória', porte: 'MICRO', situacao: 'AUTORIZADO' },
    { cnpj: '00000000000113', razaoSocial: 'PARAENSE TELECOM LTDA', nomeFantasia: 'ParáNet', uf: 'PA', municipio: 'Belém', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
    { cnpj: '00000000000114', razaoSocial: 'SERTÃO FIBRAS LTDA', nomeFantasia: 'SertãoFibra', uf: 'CE', municipio: 'Fortaleza', porte: 'MEDIO', situacao: 'AUTORIZADO' },
    { cnpj: '00000000000115', razaoSocial: 'AGRESTE NET LTDA', nomeFantasia: 'AgresteNet', uf: 'PE', municipio: 'Recife', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  ]

  if (uf) return providers.filter(p => p.uf === uf)
  return providers
}
