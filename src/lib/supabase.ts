import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type SiteBuilding = {
  id: string
  name: string
  slug: string
  address: string
  neighborhood: string
  about_paragraph: string
  schedule_tour_url: string
  application_url: string
  latitude: number | null
  longitude: number | null
  year_built: number | null
  amenities: string
  hero_image_url: string
  studio_description: string
  one_bed_description: string
  two_bed_description: string
  three_bed_description: string
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export type SiteUnitPhoto = {
  id: string
  building: string
  unit: string
  photo_url: string
  display_order: number
  created_at: string
}

export type SiteBuildingAmenityPhoto = {
  id: string
  building: string
  photo_url: string
  display_order: number
  created_at: string
}

export type SiteStockPhoto = {
  id: string
  building_id: string
  bedrooms: number
  url: string
  position: number
  created_at: string
}

export type SiteSetting = {
  id: string
  key: string
  value: unknown
  created_at: string
  updated_at: string
}
