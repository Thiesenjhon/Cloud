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

const MOCK_PROVIDERS: AnatelProvider[] = [
  // SP - São Paulo
  { cnpj: '00000000000101', razaoSocial: 'NET FIBRA TELECOM LTDA', nomeFantasia: 'NetFibra', uf: 'SP', municipio: 'São Paulo', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000102', razaoSocial: 'VELOX INTERNET LTDA', nomeFantasia: 'Velox Net', uf: 'SP', municipio: 'Campinas', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000150', razaoSocial: 'VIVO INTERNET SA', nomeFantasia: 'Vivo Fibra', uf: 'SP', municipio: 'São Paulo', porte: 'GRANDE', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000151', razaoSocial: 'CLARO SA', nomeFantasia: 'Claro', uf: 'SP', municipio: 'São Paulo', porte: 'GRANDE', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000152', razaoSocial: 'FIBER CONNECT SP LTDA', nomeFantasia: 'FiberConnect', uf: 'SP', municipio: 'Ribeirão Preto', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000153', razaoSocial: 'SPEED TELECOM SP LTDA', nomeFantasia: 'SpeedNet', uf: 'SP', municipio: 'Santos', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000154', razaoSocial: 'DIGITAL CONNECT LTDA', nomeFantasia: 'DigiNet', uf: 'SP', municipio: 'São José dos Campos', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000155', razaoSocial: 'ULTRA FIBRA LTDA', nomeFantasia: 'UltraFibra', uf: 'SP', municipio: 'Sorocaba', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000156', razaoSocial: 'ABC TELECOM LTDA', nomeFantasia: 'ABCNet', uf: 'SP', municipio: 'Santo André', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000157', razaoSocial: 'LINK MASTER SP LTDA', nomeFantasia: 'LinkMaster', uf: 'SP', municipio: 'Osasco', porte: 'MICRO', situacao: 'AUTORIZADO' },

  // RJ - Rio de Janeiro
  { cnpj: '00000000000103', razaoSocial: 'TELECOM RIO LTDA', nomeFantasia: 'TelecomRio', uf: 'RJ', municipio: 'Rio de Janeiro', porte: 'GRANDE', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000160', razaoSocial: 'NET RIO SA', nomeFantasia: 'Net Rio', uf: 'RJ', municipio: 'Rio de Janeiro', porte: 'GRANDE', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000161', razaoSocial: 'FIBRA CARIOCA LTDA', nomeFantasia: 'FibraCarioca', uf: 'RJ', municipio: 'Niterói', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000162', razaoSocial: 'LINK RJ INTERNET LTDA', nomeFantasia: 'LinkRJ', uf: 'RJ', municipio: 'Duque de Caxias', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000163', razaoSocial: 'CONNECT FLUMINENSE LTDA', nomeFantasia: 'ConnectFlu', uf: 'RJ', municipio: 'Nova Iguaçu', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000164', razaoSocial: 'SERRANA NET LTDA', nomeFantasia: 'SerranaNet', uf: 'RJ', municipio: 'Petrópolis', porte: 'MICRO', situacao: 'AUTORIZADO' },

  // MG - Minas Gerais
  { cnpj: '00000000000104', razaoSocial: 'CONECTA MINAS LTDA', nomeFantasia: 'ConectaMinas', uf: 'MG', municipio: 'Belo Horizonte', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000170', razaoSocial: 'FIBRA MINEIRA LTDA', nomeFantasia: 'FibraMineira', uf: 'MG', municipio: 'Belo Horizonte', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000171', razaoSocial: 'TRIÂNGULO NET LTDA', nomeFantasia: 'TriânguloNet', uf: 'MG', municipio: 'Uberlândia', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000172', razaoSocial: 'VERTENTES TELECOM LTDA', nomeFantasia: 'VertentesNet', uf: 'MG', municipio: 'Juiz de Fora', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000173', razaoSocial: 'INCONFIDÊNCIA INTERNET LTDA', nomeFantasia: 'InconfNet', uf: 'MG', municipio: 'Contagem', porte: 'MICRO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000174', razaoSocial: 'MINAS CONECTA LTDA', nomeFantasia: 'MinasConecta', uf: 'MG', municipio: 'Montes Claros', porte: 'PEQUENO', situacao: 'AUTORIZADO' },

  // RS - Rio Grande do Sul
  { cnpj: '00000000000105', razaoSocial: 'SUL FIBRAS LTDA', nomeFantasia: 'SulFibras', uf: 'RS', municipio: 'Porto Alegre', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000180', razaoSocial: 'GAÚCHO NET LTDA', nomeFantasia: 'GaúchoNet', uf: 'RS', municipio: 'Porto Alegre', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000181', razaoSocial: 'PAMPA FIBRA LTDA', nomeFantasia: 'PampaFibra', uf: 'RS', municipio: 'Caxias do Sul', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000182', razaoSocial: 'PELOTAS INTERNET LTDA', nomeFantasia: 'PelotasNet', uf: 'RS', municipio: 'Pelotas', porte: 'MICRO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000183', razaoSocial: 'LITORAL GAÚCHO TELECOM LTDA', nomeFantasia: 'LitoralRS', uf: 'RS', municipio: 'Novo Hamburgo', porte: 'PEQUENO', situacao: 'AUTORIZADO' },

  // SC - Santa Catarina
  { cnpj: '00000000000111', razaoSocial: 'LITORAL INTERNET LTDA', nomeFantasia: 'LitoralNet', uf: 'SC', municipio: 'Florianópolis', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000190', razaoSocial: 'CATARINENSE FIBRA LTDA', nomeFantasia: 'CatarinenseFibra', uf: 'SC', municipio: 'Joinville', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000191', razaoSocial: 'BLUMENAU NET LTDA', nomeFantasia: 'BlumenauNet', uf: 'SC', municipio: 'Blumenau', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000192', razaoSocial: 'VALE DO ITAJAÍ TELECOM LTDA', nomeFantasia: 'ValeNet', uf: 'SC', municipio: 'Balneário Camboriú', porte: 'PEQUENO', situacao: 'AUTORIZADO' },

  // PR - Paraná
  { cnpj: '00000000000200', razaoSocial: 'PARANÁ FIBRA LTDA', nomeFantasia: 'ParanáFibra', uf: 'PR', municipio: 'Curitiba', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000201', razaoSocial: 'IGUAÇU TELECOM LTDA', nomeFantasia: 'IguaçuNet', uf: 'PR', municipio: 'Foz do Iguaçu', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000202', razaoSocial: 'MARINGÁ INTERNET LTDA', nomeFantasia: 'MaringáNet', uf: 'PR', municipio: 'Maringá', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000203', razaoSocial: 'NORTE PARANAENSE NET LTDA', nomeFantasia: 'NorteParaná', uf: 'PR', municipio: 'Londrina', porte: 'PEQUENO', situacao: 'AUTORIZADO' },

  // BA - Bahia
  { cnpj: '00000000000106', razaoSocial: 'NORDESTE NET LTDA', nomeFantasia: 'NordesteNet', uf: 'BA', municipio: 'Salvador', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000210', razaoSocial: 'BAHIA FIBRA LTDA', nomeFantasia: 'BahiaFibra', uf: 'BA', municipio: 'Salvador', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000211', razaoSocial: 'FEIRA NET LTDA', nomeFantasia: 'FeiraNet', uf: 'BA', municipio: 'Feira de Santana', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000212', razaoSocial: 'RECÔNCAVO TELECOM LTDA', nomeFantasia: 'RecôncavoNet', uf: 'BA', municipio: 'Vitória da Conquista', porte: 'MICRO', situacao: 'AUTORIZADO' },

  // CE - Ceará
  { cnpj: '00000000000114', razaoSocial: 'SERTÃO FIBRAS LTDA', nomeFantasia: 'SertãoFibra', uf: 'CE', municipio: 'Fortaleza', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000220', razaoSocial: 'CEARÁ NET LTDA', nomeFantasia: 'CearáNet', uf: 'CE', municipio: 'Fortaleza', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000221', razaoSocial: 'CARIRI INTERNET LTDA', nomeFantasia: 'CairiNet', uf: 'CE', municipio: 'Juazeiro do Norte', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000222', razaoSocial: 'SERTÃO CONECTADO LTDA', nomeFantasia: 'SertãoConecta', uf: 'CE', municipio: 'Sobral', porte: 'MICRO', situacao: 'AUTORIZADO' },

  // PE - Pernambuco
  { cnpj: '00000000000115', razaoSocial: 'AGRESTE NET LTDA', nomeFantasia: 'AgresteNet', uf: 'PE', municipio: 'Recife', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000230', razaoSocial: 'PERNAMBUCO FIBRA LTDA', nomeFantasia: 'PernambucoFibra', uf: 'PE', municipio: 'Recife', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000231', razaoSocial: 'CARUARU INTERNET LTDA', nomeFantasia: 'CaruaruNet', uf: 'PE', municipio: 'Caruaru', porte: 'PEQUENO', situacao: 'AUTORIZADO' },

  // AM - Amazonas
  { cnpj: '00000000000107', razaoSocial: 'AMAZONIA TELECOM LTDA', nomeFantasia: 'AmazoniaTelecom', uf: 'AM', municipio: 'Manaus', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000240', razaoSocial: 'MANAUS FIBRA LTDA', nomeFantasia: 'ManausFibra', uf: 'AM', municipio: 'Manaus', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000241', razaoSocial: 'AMAZONAS NET LTDA', nomeFantasia: 'AmazonasNet', uf: 'AM', municipio: 'Manaus', porte: 'PEQUENO', situacao: 'AUTORIZADO' },

  // GO - Goiás
  { cnpj: '00000000000108', razaoSocial: 'CERRADO INTERNET LTDA', nomeFantasia: 'CerradoNet', uf: 'GO', municipio: 'Goiânia', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000250', razaoSocial: 'GOIÁS FIBRA LTDA', nomeFantasia: 'GoiásFibra', uf: 'GO', municipio: 'Goiânia', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000251', razaoSocial: 'ANÁPOLIS NET LTDA', nomeFantasia: 'AnaNet', uf: 'GO', municipio: 'Anápolis', porte: 'PEQUENO', situacao: 'AUTORIZADO' },

  // DF - Distrito Federal
  { cnpj: '00000000000110', razaoSocial: 'CAPITAL CONECTA LTDA', nomeFantasia: 'CapitalNet', uf: 'DF', municipio: 'Brasília', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000260', razaoSocial: 'BRASÍLIA FIBRA LTDA', nomeFantasia: 'BrasíliaFibra', uf: 'DF', municipio: 'Brasília', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000261', razaoSocial: 'PLANALTO INTERNET LTDA', nomeFantasia: 'PlanaltoNet', uf: 'DF', municipio: 'Brasília', porte: 'PEQUENO', situacao: 'AUTORIZADO' },

  // MS - Mato Grosso do Sul
  { cnpj: '00000000000109', razaoSocial: 'PANTANAL FIBRA LTDA', nomeFantasia: 'PantanalFibra', uf: 'MS', municipio: 'Campo Grande', porte: 'MICRO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000270', razaoSocial: 'CAMPO GRANDE NET LTDA', nomeFantasia: 'CGNet', uf: 'MS', municipio: 'Campo Grande', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000271', razaoSocial: 'DOURADOS INTERNET LTDA', nomeFantasia: 'DouradosNet', uf: 'MS', municipio: 'Dourados', porte: 'MICRO', situacao: 'AUTORIZADO' },

  // ES - Espírito Santo
  { cnpj: '00000000000112', razaoSocial: 'VALE NET LTDA', nomeFantasia: 'ValeNet', uf: 'ES', municipio: 'Vitória', porte: 'MICRO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000280', razaoSocial: 'CAPIXABA FIBRA LTDA', nomeFantasia: 'CapixabaFibra', uf: 'ES', municipio: 'Vitória', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000281', razaoSocial: 'SERRANA ES TELECOM LTDA', nomeFantasia: 'SerranaES', uf: 'ES', municipio: 'Serra', porte: 'MICRO', situacao: 'AUTORIZADO' },

  // PA - Pará
  { cnpj: '00000000000113', razaoSocial: 'PARAENSE TELECOM LTDA', nomeFantasia: 'ParáNet', uf: 'PA', municipio: 'Belém', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000290', razaoSocial: 'BELÉM FIBRA LTDA', nomeFantasia: 'BelémFibra', uf: 'PA', municipio: 'Belém', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000291', razaoSocial: 'MARAJÓ NET LTDA', nomeFantasia: 'MarajóNet', uf: 'PA', municipio: 'Ananindeua', porte: 'MICRO', situacao: 'AUTORIZADO' },

  // MT - Mato Grosso
  { cnpj: '00000000000300', razaoSocial: 'MATO GROSSO FIBRA LTDA', nomeFantasia: 'MTFibra', uf: 'MT', municipio: 'Cuiabá', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000301', razaoSocial: 'CUIABÁ NET LTDA', nomeFantasia: 'CuiabáNet', uf: 'MT', municipio: 'Cuiabá', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000302', razaoSocial: 'CHAPADA INTERNET LTDA', nomeFantasia: 'ChapadaNet', uf: 'MT', municipio: 'Rondonópolis', porte: 'MICRO', situacao: 'AUTORIZADO' },

  // MA - Maranhão
  { cnpj: '00000000000310', razaoSocial: 'MARANHÃO FIBRA LTDA', nomeFantasia: 'MAFibra', uf: 'MA', municipio: 'São Luís', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000311', razaoSocial: 'SÃO LUÍS NET LTDA', nomeFantasia: 'SLNet', uf: 'MA', municipio: 'São Luís', porte: 'MEDIO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000312', razaoSocial: 'IMPERATRIZ INTERNET LTDA', nomeFantasia: 'ImperatrizNet', uf: 'MA', municipio: 'Imperatriz', porte: 'MICRO', situacao: 'AUTORIZADO' },

  // PI - Piauí
  { cnpj: '00000000000320', razaoSocial: 'PIAUÍ NET LTDA', nomeFantasia: 'PINet', uf: 'PI', municipio: 'Teresina', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000321', razaoSocial: 'TERESINA FIBRA LTDA', nomeFantasia: 'TeresinaFibra', uf: 'PI', municipio: 'Teresina', porte: 'MEDIO', situacao: 'AUTORIZADO' },

  // AL - Alagoas
  { cnpj: '00000000000330', razaoSocial: 'ALAGOAS FIBRA LTDA', nomeFantasia: 'ALFibra', uf: 'AL', municipio: 'Maceió', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000331', razaoSocial: 'MACEIÓ NET LTDA', nomeFantasia: 'MaceióNet', uf: 'AL', municipio: 'Maceió', porte: 'MEDIO', situacao: 'AUTORIZADO' },

  // PB - Paraíba
  { cnpj: '00000000000340', razaoSocial: 'PARAÍBA FIBRA LTDA', nomeFantasia: 'PBFibra', uf: 'PB', municipio: 'João Pessoa', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000341', razaoSocial: 'CAMPINA GRANDE NET LTDA', nomeFantasia: 'CGNet', uf: 'PB', municipio: 'Campina Grande', porte: 'PEQUENO', situacao: 'AUTORIZADO' },

  // RN - Rio Grande do Norte
  { cnpj: '00000000000350', razaoSocial: 'POTIGUAR FIBRA LTDA', nomeFantasia: 'PotiNet', uf: 'RN', municipio: 'Natal', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000351', razaoSocial: 'NATAL NET LTDA', nomeFantasia: 'NatalNet', uf: 'RN', municipio: 'Natal', porte: 'MEDIO', situacao: 'AUTORIZADO' },

  // SE - Sergipe
  { cnpj: '00000000000360', razaoSocial: 'SERGIPE FIBRA LTDA', nomeFantasia: 'SEFibra', uf: 'SE', municipio: 'Aracaju', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000361', razaoSocial: 'ARACAJU NET LTDA', nomeFantasia: 'AracajuNet', uf: 'SE', municipio: 'Aracaju', porte: 'MEDIO', situacao: 'AUTORIZADO' },

  // RO - Rondônia
  { cnpj: '00000000000370', razaoSocial: 'RONDÔNIA FIBRA LTDA', nomeFantasia: 'ROFibra', uf: 'RO', municipio: 'Porto Velho', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000371', razaoSocial: 'PORTO VELHO NET LTDA', nomeFantasia: 'PVNet', uf: 'RO', municipio: 'Porto Velho', porte: 'MEDIO', situacao: 'AUTORIZADO' },

  // AC - Acre
  { cnpj: '00000000000380', razaoSocial: 'ACRE FIBRA LTDA', nomeFantasia: 'AcreFibra', uf: 'AC', municipio: 'Rio Branco', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000381', razaoSocial: 'RIO BRANCO NET LTDA', nomeFantasia: 'RBNet', uf: 'AC', municipio: 'Rio Branco', porte: 'MICRO', situacao: 'AUTORIZADO' },

  // AP - Amapá
  { cnpj: '00000000000390', razaoSocial: 'AMAPÁ FIBRA LTDA', nomeFantasia: 'APFibra', uf: 'AP', municipio: 'Macapá', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000391', razaoSocial: 'MACAPÁ NET LTDA', nomeFantasia: 'MacapáNet', uf: 'AP', municipio: 'Macapá', porte: 'MICRO', situacao: 'AUTORIZADO' },

  // RR - Roraima
  { cnpj: '00000000000400', razaoSocial: 'RORAIMA FIBRA LTDA', nomeFantasia: 'RRFibra', uf: 'RR', municipio: 'Boa Vista', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000401', razaoSocial: 'BOA VISTA NET LTDA', nomeFantasia: 'BVNet', uf: 'RR', municipio: 'Boa Vista', porte: 'MICRO', situacao: 'AUTORIZADO' },

  // TO - Tocantins
  { cnpj: '00000000000410', razaoSocial: 'TOCANTINS FIBRA LTDA', nomeFantasia: 'TOFibra', uf: 'TO', municipio: 'Palmas', porte: 'PEQUENO', situacao: 'AUTORIZADO' },
  { cnpj: '00000000000411', razaoSocial: 'PALMAS NET LTDA', nomeFantasia: 'PalmasNet', uf: 'TO', municipio: 'Palmas', porte: 'MICRO', situacao: 'AUTORIZADO' },
]

export function getMockProviders(uf?: string): AnatelProvider[] {
  if (uf) return MOCK_PROVIDERS.filter(p => p.uf === uf)
  return MOCK_PROVIDERS
}
