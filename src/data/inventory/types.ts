export type Unit = {
  building: string
  unit: string
  bed: number
  bedLabel: string
  isConvertible: boolean
  bath: number
  sqft: number
  status: string
  grossRent: number
  concession: number
  term: number
  netRent: number
  exposure: string
  balcony: string
  expiry: string
  videoUrl: string
  floorPlanUrl: string
  matterportUrl: string
  picsUrl: string
}

export type LayoutGroup = {
  key: string
  label: string
  bed: number
  bath: number
  units: Unit[]
  cheapest: Unit
  priciest: Unit
}

export type InventoryResult = {
  units: Unit[]
  layouts: LayoutGroup[]
  loading: boolean
  error: string | null
  lastFetched: Date | null
}
