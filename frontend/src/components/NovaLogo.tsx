import logoIcon from '@/assets/icons/logo-icon.svg'

interface NovaLogoProps {
  className?: string
}

/** Icon tile + wordmark. The tile is the Figma 40px orange square with its glow. */
export default function NovaLogo({ className = '' }: NovaLogoProps) {
  return (
    <div className={`flex shrink-0 items-center gap-3 ${className}`}>
      <div className="grid size-10 shrink-0 place-items-center rounded-tile bg-brand shadow-logo">
        <img src={logoIcon} alt="" width={23} height={23} />
      </div>
      <p className="text-logo whitespace-nowrap text-ink">
        Nova<span className="text-brand">code</span>
      </p>
    </div>
  )
}
