interface OAuthButtonProps {
  label: string
  /** The mark the design uses in place of a logo (monospace "GH", black "G"). */
  mark: string
  markClassName?: string
  onClick?: () => void
}

/** Outlined 48px pill for the Google/GitHub sign-in options. */
export default function OAuthButton({
  label,
  mark,
  markClassName = 'font-mono text-lg',
  onClick,
}: OAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-pill border-[0.9px] border-white/40 text-base text-white transition hover:bg-white/5 active:scale-[0.98]"
    >
      <span className={markClassName}>{mark}</span>
      {label}
    </button>
  )
}
