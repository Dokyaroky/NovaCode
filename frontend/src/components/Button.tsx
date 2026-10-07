import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'small' | 'ghost'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  /** 'lg' is the 56px full-width submit button used by the auth forms. */
  size?: 'md' | 'lg'
  icon?: ReactNode
  iconPosition?: 'start' | 'end'
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  className?: string
}

/* Metrics straight from the design: 48px pills at a 30px radius, 44px for the small
   in-card action, 24px for the text-only button, 56px for the form submit. */
const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'gap-3 rounded-pill bg-brand px-6 text-base text-white shadow-button',
  secondary: 'gap-3 rounded-pill bg-accent px-6 text-base text-white shadow-button',
  small: 'gap-3 rounded-full bg-accent px-5 text-base text-white',
  ghost: 'gap-2 text-base text-white',
}

const HEIGHTS: Record<ButtonVariant, string> = {
  primary: 'h-12',
  secondary: 'h-12',
  small: 'h-11',
  ghost: 'h-6',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
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
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
        size === 'lg' ? 'h-14' : HEIGHTS[variant]
      } ${VARIANTS[variant]} ${className}`}
    >
      {icon && iconPosition === 'start' && icon}
      {children}
      {icon && iconPosition === 'end' && icon}
    </button>
  )
}
