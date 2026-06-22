import { useState } from 'react'
import { ChevronLeft, ChevronRight, TreePine, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { ImagePlaceholder } from './ImagePlaceholder'
import { useUnitPhotos } from '../hooks/usePhotos'
import type { Unit } from '../data/inventory'

type Badge = 'best-value' | 'premium' | null

export function UnitCard({
  unit,
  address,
  badge,
  tourUrl,
  applyUrl,
  onViewDetails,
}: {
  unit: Unit
  address?: string
  badge?: Badge
  tourUrl?: string
  applyUrl?: string
  onViewDetails?: () => void
}) {
  const { photos, isStock } = useUnitPhotos(unit.building, unit.unit)
  const [photoIndex, setPhotoIndex] = useState(0)

  const hasBalcony = unit.balcony && !['no', 'n/a', 'none', ''].includes(unit.balcony.toLowerCase())
  const bathLabel = unit.bath === 1 ? '1 Bath' : `${unit.bath} Baths`

  return (
    <div className="group rounded-2xl overflow-hidden bg-white shadow-sm border border-neutral-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[4/3]">
        {photos.length > 0 ? (
          <>
            <img
              src={photos[photoIndex]}
              alt={`${unit.building} ${unit.unit}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setPhotoIndex(i => (i - 1 + photos.length) % photos.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white shadow transition-opacity opacity-0 group-hover:opacity-100"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPhotoIndex(i => (i + 1) % photos.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white shadow transition-opacity opacity-0 group-hover:opacity-100"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/50 text-white text-xs">
                  {photoIndex + 1}/{photos.length}
                </div>
              </>
            )}
            {isStock && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-neutral-800/70 text-white text-xs flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Stock
              </span>
            )}
          </>
        ) : (
          <ImagePlaceholder label={`${unit.building} ${unit.unit}`} aspectRatio="aspect-[4/3]" />
        )}

        <div className="absolute top-2 right-2 flex gap-1.5">
          {badge === 'best-value' && (
            <span className="px-2.5 py-1 rounded-full bg-success-600 text-white text-xs font-semibold">Best Value</span>
          )}
          {badge === 'premium' && (
            <span className="px-2.5 py-1 rounded-full bg-brand-600 text-white text-xs font-semibold">Premium</span>
          )}
          {hasBalcony && (
            <span className="px-2.5 py-1 rounded-full bg-white/90 text-brand-950 text-xs font-semibold flex items-center gap-1">
              <TreePine className="w-3 h-3" /> Outdoor Space
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display font-semibold text-lg">{unit.building} #{unit.unit}</h3>
        {address && <p className="text-sm text-neutral-500 mt-0.5">{address}</p>}

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-display font-bold text-brand-600">
            ${unit.netRent.toLocaleString()}
          </span>
          <span className="text-sm text-neutral-500">/ month</span>
        </div>

        {unit.concession > 0 && (
          <p className="text-sm text-success-600 font-medium mt-1">
            Inclusive of {unit.concession} month(s) free
          </p>
        )}

        <p className="text-sm text-neutral-600 mt-2">
          {unit.bedLabel}, {bathLabel}
          {unit.sqft > 0 && ` \u2022 ${unit.sqft.toLocaleString()} sqft`}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {unit.matterportUrl && (
            <a href={unit.matterportUrl} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors flex items-center gap-1">
              3D Tour <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {unit.floorPlanUrl && (
            <a href={unit.floorPlanUrl} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors flex items-center gap-1">
              Floor Plan <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {unit.videoUrl && (
            <a href={unit.videoUrl} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors flex items-center gap-1">
              Video <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-neutral-100 flex gap-2">
          {tourUrl && (
            <a href={tourUrl} target="_blank" rel="noopener noreferrer"
              className="flex-1 py-2 text-center text-sm font-medium rounded-full border border-brand-600 text-brand-600 hover:bg-brand-50 transition-colors">
              Schedule Tour
            </a>
          )}
          {applyUrl && (
            <a href={applyUrl} target="_blank" rel="noopener noreferrer"
              className="flex-1 py-2 text-center text-sm font-medium rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-colors">
              Apply
            </a>
          )}
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="flex-1 py-2 text-center text-sm font-medium rounded-full border border-neutral-200 text-brand-950 hover:bg-neutral-50 transition-colors"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
