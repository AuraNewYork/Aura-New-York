import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Calendar, Building2, ArrowLeft, DollarSign, Users, Wind, Trees } from 'lucide-react'
import { useBuildingBySlug } from '../hooks/useBuildings'
import { useInventory } from '../hooks/useInventory'
import { UnitCard } from '../components/UnitCard'
import { ImagePlaceholder } from '../components/ImagePlaceholder'
import { Skeleton } from '../components/Skeleton'

// Map lucide icons to common amenities
const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'gym': <Building2 className="w-5 h-5" />,
  'fitness': <Building2 className="w-5 h-5" />,
  'pool': <Users className="w-5 h-5" />,
  'rooftop': <Wind className="w-5 h-5" />,
  'garden': <Trees className="w-5 h-5" />,
  'outdoor': <Trees className="w-5 h-5" />,
  'lounge': <Building2 className="w-5 h-5" />,
  'concierge': <Users className="w-5 h-5" />,
  'doorman': <Users className="w-5 h-5" />,
  'elevator': <Building2 className="w-5 h-5" />,
  'parking': <Building2 className="w-5 h-5" />,
}

function getAmenityIcon(amenity: string) {
  const lower = amenity.toLowerCase()
  for (const [key, icon] of Object.entries(AMENITY_ICONS)) {
    if (lower.includes(key)) return icon
  }
  return <Building2 className="w-5 h-5" />
}

export function BuildingDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { building, loading: buildingLoading, error: buildingError } = useBuildingBySlug(slug)
  const { units, loading: unitsLoading } = useInventory()

  useEffect(() => {
    if (building) {
      document.title = `${building.name} | Aura New York`
    }
  }, [building])

  // Filter units for this building
  const buildingUnits = building ? units.filter(unit => unit.building === building.name) : []

  if (buildingLoading) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-32 mb-8" />
          <Skeleton className="aspect-[16/9] rounded-2xl mb-12" />
          <Skeleton className="h-6 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  if (buildingError || !building) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/buildings"
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Buildings
          </Link>
          <div className="text-center py-16">
            <h1 className="text-3xl font-display font-bold text-brand-950 mb-4">Building Not Found</h1>
            <p className="text-neutral-600 mb-8">
              We couldn't find the building you're looking for.
            </p>
            <Link
              to="/buildings"
              className="inline-block px-6 py-3 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors"
            >
              View All Buildings
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Parse amenities from comma-separated string
  const amenities = building.amenities
    ? building.amenities.split(',').map(a => a.trim()).filter(Boolean)
    : []

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/buildings"
          className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Buildings
        </Link>

        {/* Hero Image */}
        <div className="mb-12 rounded-2xl overflow-hidden bg-neutral-100 aspect-[16/9]">
          {building.hero_image_url ? (
            <img
              src={building.hero_image_url}
              alt={building.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImagePlaceholder label={building.name} aspectRatio="aspect-[16/9]" />
          )}
        </div>

        {/* Building Header */}
        <div className="mb-16">
          <h1 className="text-5xl lg:text-6xl font-display font-bold text-brand-950 mb-4">
            {building.name}
          </h1>

          {/* Key Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {building.neighborhood && (
              <div className="p-4 rounded-xl bg-neutral-50">
                <p className="text-xs font-semibold text-neutral-600 mb-1">Neighborhood</p>
                <p className="text-lg font-display font-bold text-brand-950">{building.neighborhood}</p>
              </div>
            )}

            {building.address && (
              <div className="p-4 rounded-xl bg-neutral-50">
                <p className="text-xs font-semibold text-neutral-600 mb-1">Address</p>
                <p className="text-lg font-display font-bold text-brand-950 line-clamp-2">{building.address}</p>
              </div>
            )}

            {building.year_built && (
              <div className="p-4 rounded-xl bg-neutral-50">
                <p className="text-xs font-semibold text-neutral-600 mb-1">Year Built</p>
                <p className="text-lg font-display font-bold text-brand-950">{building.year_built}</p>
              </div>
            )}

            {buildingUnits.length > 0 && (
              <div className="p-4 rounded-xl bg-neutral-50">
                <p className="text-xs font-semibold text-neutral-600 mb-1">Available Units</p>
                <p className="text-lg font-display font-bold text-brand-950">{buildingUnits.length}</p>
              </div>
            )}
          </div>
        </div>

        {/* About Section */}
        {building.about_paragraph && (
          <div className="mb-16 max-w-3xl">
            <h2 className="text-3xl font-display font-bold text-brand-950 mb-4">About</h2>
            <p className="text-lg text-neutral-700 leading-relaxed">
              {building.about_paragraph}
            </p>
          </div>
        )}

        {/* Amenities Section */}
        {amenities.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-display font-bold text-brand-950 mb-6">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-neutral-50 flex items-start gap-3 hover:bg-neutral-100 transition-colors"
                >
                  <span className="text-brand-600 flex-shrink-0 mt-0.5">
                    {getAmenityIcon(amenity)}
                  </span>
                  <span className="text-sm font-medium text-brand-950">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map Placeholder */}
        {(building.latitude || building.longitude) && (
          <div className="mb-16">
            <h2 className="text-3xl font-display font-bold text-brand-950 mb-6">Location</h2>
            <div className="w-full h-96 rounded-2xl bg-neutral-100 flex items-center justify-center border-2 border-neutral-200">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-brand-300 mx-auto mb-2" />
                <p className="text-neutral-500 font-medium">Interactive map coming soon</p>
                <p className="text-sm text-neutral-400 mt-1">
                  {building.latitude}, {building.longitude}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="mb-16 flex flex-col sm:flex-row gap-4">
          {building.schedule_tour_url && (
            <a
              href={building.schedule_tour_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-brand-600 text-brand-600 font-semibold rounded-full hover:bg-brand-50 transition-colors text-center"
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Schedule a Tour
            </a>
          )}
          {building.application_url && (
            <a
              href={building.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors text-center"
            >
              Apply Now
            </a>
          )}
        </div>

        {/* Available Units Section */}
        {buildingUnits.length > 0 && (
          <div>
            <h2 className="text-3xl font-display font-bold text-brand-950 mb-8">Available Units</h2>
            {unitsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-sm border border-neutral-100">
                    <Skeleton className="aspect-[4/3] rounded-none" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {buildingUnits.map((unit, idx) => (
                  <UnitCard
                    key={idx}
                    unit={unit}
                    address={building.address}
                    tourUrl={building.schedule_tour_url}
                    applyUrl={building.application_url}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Units Message */}
        {!unitsLoading && buildingUnits.length === 0 && (
          <div className="text-center py-16 bg-neutral-50 rounded-2xl">
            <DollarSign className="w-12 h-12 text-brand-300 mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold text-brand-950 mb-2">No Available Units</h3>
            <p className="text-neutral-600 mb-6">
              No units are currently available at {building.name}. Check back soon!
            </p>
            {building.schedule_tour_url && (
              <a
                href={building.schedule_tour_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors"
              >
                Schedule a Tour
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BuildingDetailPage
