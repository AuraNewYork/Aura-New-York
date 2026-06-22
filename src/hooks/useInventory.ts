import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchInventory, groupByLayout } from '../data/inventory'
import type { Unit, LayoutGroup } from '../data/inventory'

const REFRESH_INTERVAL = 5 * 60 * 1000

export function useInventory() {
  const [units, setUnits] = useState<Unit[]>([])
  const [layouts, setLayouts] = useState<LayoutGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await fetchInventory()
      setUnits(data)
      setLayouts(groupByLayout(data))
      setError(null)
      setLastFetched(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    intervalRef.current = setInterval(load, REFRESH_INTERVAL)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [load])

  return { units, layouts, loading, error, lastFetched, refetch: load }
}
