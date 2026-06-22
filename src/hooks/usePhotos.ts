import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { SiteUnitPhoto, SiteBuildingAmenityPhoto, SiteStockPhoto } from '../lib/supabase'

export function useUnitPhotos(building: string, unit: string) {
  const [photos, setPhotos] = useState<string[]>([])
  const [isStock, setIsStock] = useState(false)

  useEffect(() => {
    if (!building || !unit) return

    async function load() {
      const { data: unitPhotos } = await supabase
        .from('site_unit_photos')
        .select('photo_url')
        .eq('building', building)
        .eq('unit', unit)
        .order('display_order')

      if (unitPhotos && unitPhotos.length > 0) {
        setPhotos(unitPhotos.map(p => normalizePhotoUrl(p.photo_url)))
        setIsStock(false)
        return
      }

      const { data: buildings } = await supabase
        .from('site_buildings')
        .select('id')
        .eq('name', building)
        .maybeSingle()

      if (buildings) {
        const { data: stockPhotos } = await supabase
          .from('site_stock_photos')
          .select('url')
          .eq('building_id', buildings.id)
          .order('position')

        if (stockPhotos && stockPhotos.length > 0) {
          setPhotos(stockPhotos.map(p => normalizePhotoUrl(p.url)))
          setIsStock(true)
          return
        }
      }

      const { data: amenityPhotos } = await supabase
        .from('site_building_amenity_photos')
        .select('photo_url')
        .eq('building', building)
        .order('display_order')

      if (amenityPhotos && amenityPhotos.length > 0) {
        setPhotos(amenityPhotos.map(p => normalizePhotoUrl(p.photo_url)))
        setIsStock(true)
      }
    }

    load()
  }, [building, unit])

  return { photos, isStock }
}

function normalizePhotoUrl(url: string): string {
  if (!url) return url
  let normalized = url
  if (normalized.includes('www.dropbox.com')) {
    normalized = normalized.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
    if (!normalized.includes('raw=1')) {
      normalized += (normalized.includes('?') ? '&' : '?') + 'raw=1'
    }
  }
  return normalized
}
