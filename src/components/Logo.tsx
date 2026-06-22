export function Logo({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const color = variant === 'light' ? 'text-white' : 'text-brand-950'
  return (
    <a href="/" className={`block ${color}`} aria-label="Aura New York home">
      <div className="font-display font-semibold text-2xl tracking-tight leading-none">AURA</div>
      <div className="font-display text-[0.6rem] tracking-[0.3em] uppercase leading-none mt-0.5">New York</div>
    </a>
  )
}
