import { Building2 } from 'lucide-react'

export function ImagePlaceholder({
  className = '',
  label = 'Image',
  aspectRatio = 'aspect-[4/3]',
}: {
  className?: string
  label?: string
  aspectRatio?: string
}) {
  return (
    <div
      className={`bg-neutral-100 flex flex-col items-center justify-center ${aspectRatio} ${className}`}
      role="img"
      aria-label={label}
    >
      <Building2 className="w-10 h-10 text-brand-300 mb-2" strokeWidth={1.5} />
      <span className="text-xs text-neutral-400 font-body">{label}</span>
    </div>
  )
}
