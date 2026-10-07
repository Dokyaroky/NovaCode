import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'small' | 'ghost'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  icon?: ReactNode
  iconPosition?: 'start' | 'end'
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  className?: string
}

/* Metrics straight from the design: 48px pills with a 30px radius, 44px for the small
   in-card action, 24px for the text-only button. */
const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'h-12 gap-3 rounded-pill bg-brand px-6 text-base text-white shadow-button',
  secondary: 'h-12 gap-3 rounded-pill bg-accent px-6 text-base text-white shadow-button',
  small: 'h-11 gap-3 rounded-full bg-accent px-5 text-base text-white',
  ghost: 'h-6 gap-2 text-base text-white',
}

export default function Button({
  children,
  variant = 'primary',
  icon,
  iconPosition = 'end',
  type = 'button',
  onClick,
  disabled,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
    >
      {icon && iconPosition === 'start' && icon}
      {children}
      {icon && iconPosition === 'end' && icon}
    </button>
  )
}
