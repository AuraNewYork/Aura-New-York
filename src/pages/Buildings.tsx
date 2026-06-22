import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { useBuildings } from '../hooks/useBuildings'
import { ImagePlaceholder } from '../components/ImagePlaceholder'
import { CardSkeleton } from '../components/Skeleton'

export function BuildingsPage() {
  const { buildings, loading } = useBuildings()

  useEffect(() => {
    document.title = 'Buildings | Aura New York'
  }, [])

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl lg:text-6xl font-display font-bold text-brand-950 mb-4">
            Our Buildings
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Discover our thoughtfully curated collection of residential properties across New York City.
          </p>
        </div>

        {/* Buildings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : buildings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {buildings.map(building => (
              <Link
                key={building.id}
                to={`/buildings/${building.slug}`}
                className="group rounded-2xl overflow-hidden bg-white shadow-sm border border-neutral-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Hero Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  {building.hero_image_url ? (
                    <img
                      src={building.hero_image_url}
                      alt={building.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <ImagePlaceholder label={building.name} aspectRatio="aspect-[4/3]" />
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-display font-bold text-brand-950 mb-2">
                    {building.name}
                  </h2>

                  <div className="space-y-3">
                    {building.neighborhood && (
                      <div className="flex items-start gap-2">
                        <span className="text-brand-600 font-semibold text-sm mt-0.5">
                          {building.neighborhood}
                        </span>
                      </div>
                    )}

                    {building.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-neutral-600">{building.address}</p>
                      </div>
                    )}
                  </div>

                  {building.year_built && (
                    <p className="mt-3 text-xs text-neutral-500">
                      Built {building.year_built}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-neutral-600 text-lg">No buildings available at this time.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BuildingsPage
