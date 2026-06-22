import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { MapPin, Grid3x3, SlidersHorizontal } from 'lucide-react'
import { useInventory } from '../hooks/useInventory'
import { useBuildings } from '../hooks/useBuildings'
import { UnitCard } from '../components/UnitCard'
import { CardSkeleton } from '../components/Skeleton'
import type { Unit } from '../data/inventory'

type Badge = 'best-value' | 'premium' | null

export default function AvailabilityPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const { units, loading, error } = useInventory()
  const { buildings } = useBuildings()

  // Parse URL search params
  const bed = searchParams.get('bed') ? parseInt(searchParams.get('bed')!) : null
  const bath = searchParams.get('bath') ? parseFloat(searchParams.get('bath')!) : null
  const outdoor = searchParams.has('outdoor') ? searchParams.get('outdoor') !== 'false' : null
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : null
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : null
  const building = searchParams.get('building') || null

  // Determine if filters are active
  const hasActiveFilters = bed !== null || bath !== null || outdoor !== null || minPrice !== null || maxPrice !== null || building !== null

  // Filter units
  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      if (bed !== null && unit.bed !== bed) return false
      if (bath !== null && unit.bath < bath) return false
      if (outdoor !== null) {
        const hasBalcony = unit.balcony && !['no', 'n/a', 'none', ''].includes(unit.balcony.toLowerCase())
        if (outdoor && !hasBalcony) return false
      }
      if (minPrice !== null && unit.netRent < minPrice) return false
      if (maxPrice !== null && unit.netRent > maxPrice) return false
      if (building !== null && unit.building !== building) return false
      return true
    })
  }, [units, bed, bath, outdoor, minPrice, maxPrice, building])

  // Sort by net rent ascending
  const sortedUnits = useMemo(() => {
    return [...filteredUnits].sort((a, b) => a.netRent - b.netRent)
  }, [filteredUnits])

  // Group by layout for featured view
  const layoutGroups = useMemo(() => {
    const groups: Record<string, Unit[]> = {}
    units.forEach(unit => {
      const key = `${unit.bed}bed-${unit.bath}bath`
      if (!groups[key]) groups[key] = []
      groups[key].push(unit)
    })
    return Object.entries(groups)
      .map(([key, unitList]) => ({
        key,
        label: unitList[0].bedLabel,
        bed: unitList[0].bed,
        bath: unitList[0].bath,
        units: unitList,
        cheapest: unitList.reduce((min, u) => u.netRent < min.netRent ? u : min),
        priciest: unitList.reduce((max, u) => u.netRent > max.netRent ? u : max),
      }))
      .sort((a, b) => a.bed - b.bed || a.bath - b.bath)
  }, [units])

  // Helper to get building address
  const getBuildingAddress = (buildingName: string) => {
    return buildings.find(b => b.name === buildingName)?.address || buildingName
  }

  // Helper to get building URLs
  const getBuildingUrls = (buildingName: string) => {
    const bldg = buildings.find(b => b.name === buildingName)
    return {
      tourUrl: bldg?.schedule_tour_url,
      applyUrl: bldg?.application_url,
    }
  }

  const handleFilterChange = (key: string, value: string | number | boolean | null) => {
    const newParams = new URLSearchParams(searchParams)
    if (value === null) {
      newParams.delete(key)
    } else {
      newParams.set(key, String(value))
    }
    setSearchParams(newParams)
  }

  const handleResetFilters = () => {
    setSearchParams({})
  }

  const unitCount = hasActiveFilters ? sortedUnits.length : units.length

  // Set page title
  if (typeof document !== 'undefined') {
    document.title = `Available Apartments - Luxury NYC Real Estate`
  }

  if (viewMode === 'map') {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-3xl font-display font-bold text-brand-950">Available Apartments</h1>
            <button
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <Grid3x3 className="w-4 h-4" />
              Grid View
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
            <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600 mb-2">Map view is coming soon</p>
            <p className="text-sm text-neutral-500">Please use grid view to browse available units</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-brand-950">Available Apartments</h1>
              <p className="text-neutral-600 text-sm mt-1">
                {unitCount} unit{unitCount !== 1 ? 's' : ''} available
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('map')}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Map
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'bg-brand-100 text-brand-700 border border-brand-200'
                    : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          {(showFilters || hasActiveFilters) && (
            <div className="bg-neutral-50 rounded-2xl p-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* Bedrooms */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-2">Bedrooms</label>
                  <select
                    value={bed === null ? '' : bed}
                    onChange={(e) => handleFilterChange('bed', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 rounded-full border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                  >
                    <option value="">All</option>
                    <option value="0">Studio</option>
                    <option value="1">1 Bed</option>
                    <option value="2">2 Bed</option>
                    <option value="3">3 Bed</option>
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-2">Bathrooms</label>
                  <select
                    value={bath === null ? '' : bath}
                    onChange={(e) => handleFilterChange('bath', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full px-3 py-2 rounded-full border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                  >
                    <option value="">All</option>
                    <option value="1">1+ Bath</option>
                    <option value="1.5">1.5+ Bath</option>
                    <option value="2">2+ Bath</option>
                    <option value="2.5">2.5+ Bath</option>
                  </select>
                </div>

                {/* Outdoor Space */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-2">Outdoor Space</label>
                  <button
                    onClick={() => handleFilterChange('outdoor', outdoor === true ? null : true)}
                    className={`w-full px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      outdoor === true
                        ? 'bg-brand-600 text-white border border-brand-600'
                        : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    With Outdoor
                  </button>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-2">Min Price</label>
                  <input
                    type="number"
                    value={minPrice === null ? '' : minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="$"
                    className="w-full px-3 py-2 rounded-full border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-2">Max Price</label>
                  <input
                    type="number"
                    value={maxPrice === null ? '' : maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="$"
                    className="w-full px-3 py-2 rounded-full border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>

                {/* Building */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-2">Building</label>
                  <select
                    value={building || ''}
                    onChange={(e) => handleFilterChange('building', e.target.value || null)}
                    className="w-full px-3 py-2 rounded-full border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                  >
                    <option value="">All Buildings</option>
                    {buildings.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex justify-end">
                  <button
                    onClick={handleResetFilters}
                    className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 mb-6">
            <p className="font-medium">Error loading apartments</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : hasActiveFilters ? (
          // Filtered view with "Top Picks" section
          <>
            {sortedUnits.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 font-medium mb-2">No apartments match your filters</p>
                <p className="text-neutral-500 text-sm mb-6">Try adjusting your criteria</p>
                <button
                  onClick={handleResetFilters}
                  className="inline-block px-6 py-2 rounded-full bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-display font-bold text-brand-950 mb-4">Top Picks</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedUnits.slice(0, 6).map((unit) => (
                      <UnitCard
                        key={`${unit.building}-${unit.unit}`}
                        unit={unit}
                        address={getBuildingAddress(unit.building)}
                        {...getBuildingUrls(unit.building)}
                      />
                    ))}
                  </div>
                </div>

                {sortedUnits.length > 6 && (
                  <div>
                    <h2 className="text-2xl font-display font-bold text-brand-950 mb-4">All Available Units</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedUnits.slice(6).map((unit) => (
                        <UnitCard
                          key={`${unit.building}-${unit.unit}`}
                          unit={unit}
                          address={getBuildingAddress(unit.building)}
                          {...getBuildingUrls(unit.building)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          // Featured view (default)
          <>
            {layoutGroups.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 font-medium">No apartments available</p>
              </div>
            ) : (
              <div className="space-y-12">
                {layoutGroups.map((group) => (
                  <div key={group.key}>
                    <h2 className="text-2xl font-display font-bold text-brand-950 mb-4">{group.label}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Best Value (Cheapest) */}
                      <UnitCard
                        unit={group.cheapest}
                        address={getBuildingAddress(group.cheapest.building)}
                        badge="best-value"
                        {...getBuildingUrls(group.cheapest.building)}
                      />
                      {/* Premium (Priciest) */}
                      <UnitCard
                        unit={group.priciest}
                        address={getBuildingAddress(group.priciest.building)}
                        badge="premium"
                        {...getBuildingUrls(group.priciest.building)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
