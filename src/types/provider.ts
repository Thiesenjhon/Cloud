export interface ProviderSummary {
  id: string
  cnpj: string
  razaoSocial: string
  nomeFantasia: string | null
  uf: string
  municipio: string
  porte: string | null
  situacao: string | null
  googleRating: number | null
  googleReviews: number | null
  websiteUrl: string | null
  plansCount: number
  avgPrice: number | null
  minPrice: number | null
  maxPrice: number | null
  technologies: string[]
}

export interface PlanData {
  id: string
  name: string
  technology: string
  downloadSpeed: number
  uploadSpeed: number
  price: number
  hasStreaming: boolean
  hasFixedIp: boolean
  hasSecurity: boolean
  hasPhone: boolean
  hasTV: boolean
  svaDetails: string | null
  contractMonths: number | null
  installationFee: number | null
  sourceUrl: string | null
  confidence: number | null
}

export interface AnatelProvider {
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
  uf: string
  municipio: string
  porte?: string
  situacao?: string
  dataAutorizacao?: string
}

export interface GooglePlacesResult {
  placeId: string
  rating: number
  userRatingsTotal: number
  formattedAddress: string
  phoneNumber?: string
  website?: string
  types: string[]
}

export interface ExtractedPlan {
  name: string
  technology: string
  downloadSpeed: number
  uploadSpeed: number
  price: number
  hasStreaming: boolean
  hasFixedIp: boolean
  hasSecurity: boolean
  hasPhone: boolean
  hasTV: boolean
  svaDetails: string
  contractMonths: number | null
  installationFee: number | null
  confidence: number
}

export interface DashboardStats {
  totalProviders: number
  enrichedProviders: number
  totalPlans: number
  avgPrice: number
  byState: { uf: string; count: number }[]
  byTechnology: { technology: string; count: number }[]
  byPorte: { porte: string; count: number }[]
  priceRanges: { range: string; count: number }[]
  speedDistribution: { range: string; count: number }[]
  topSVAs: { sva: string; count: number; percentage: number }[]
}
