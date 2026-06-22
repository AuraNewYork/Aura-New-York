import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { SiteBuilding } from '../lib/supabase'

export function useBuildings() {
  const [buildings, setBuildings] = useState<SiteBuilding[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('site_buildings')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true })
    if (err) {
      setError(err.message)
      setBuildings([])
    } else {
      setBuildings(data || [])
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { buildings, loading, error, refetch: fetch }
}

export function useBuildingBySlug(slug: string | undefined) {
  const [building, setBuilding] = useState<SiteBuilding | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) { setLoading(false); return }
    setLoading(true)
    supabase
      .from('site_buildings')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setBuilding(data)
        setLoading(false)
      })
  }, [slug])

  return { building, loading, error }
}
