import { Link } from 'react-router-dom'
import logoIcon from '@/assets/icons/logo-icon.svg'

interface NovaLogoProps {
  className?: string
  /**
   * Where the wordmark points. Every header/sidebar logo goes to the dashboard; the
   * landing page and the dev gallery pass `to={null}` to render it as plain art.
   */
  to?: string | null
}

/** Icon tile + wordmark. The tile is the Figma 40px orange square with its glow. */
export default function NovaLogo({ className = '', to = '/dashboard' }: NovaLogoProps) {
  const body = (
    <>
      <div className="grid size-10 shrink-0 place-items-center rounded-tile bg-brand shadow-logo">
        <img src={logoIcon} alt="" width={23} height={23} />
      </div>
      <p className="text-logo whitespace-nowrap text-ink">
        Nova<span className="text-brand">code</span>
      </p>
    </>
  )

  if (!to) {
    return <div className={`flex shrink-0 items-center gap-3 ${className}`}>{body}</div>
  }

  return (
    <Link
      to={to}
      aria-label="NovaCode — go to dashboard"
      className={`flex shrink-0 items-center gap-3 rounded-tile transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className}`}
    >
      {body}
    </Link>
  )
}
