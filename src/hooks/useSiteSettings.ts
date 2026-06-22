import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { SiteSetting } from '../lib/supabase'

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .then(({ data }) => {
        const map: Record<string, unknown> = {}
        if (data) {
          (data as SiteSetting[]).forEach(s => { map[s.key] = s.value })
        }
        setSettings(map)
        setLoading(false)
      })
  }, [])

  return { settings, loading }
}

export function getSetting<T>(settings: Record<string, unknown>, key: string, fallback: T): T {
  const val = settings[key]
  if (val === undefined || val === null) return fallback
  return val as T
}
