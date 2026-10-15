interface InputProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  name?: string
  autoComplete?: string
  className?: string
  /** Validation message; when set the field explains itself instead of silently failing. */
  error?: string
}

/** 56px field on the dark canvas: 8px radius, 0.9px white-alpha border, 14px semibold text. */
export default function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  name,
  autoComplete,
  className = '',
  error,
}: InputProps) {
  const errorId = name ? `${name}-error` : undefined

  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-sm font-semibold text-ink">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`h-14 w-full rounded-lg border-[0.9px] bg-shell px-4 text-sm font-semibold text-ink outline-none transition duration-300 ease-out placeholder:text-ink-soft/60 focus:border-brand/70 ${
          error ? 'border-code-red' : 'border-white/25'
        }`}
      />
      {error && (
        <span id={errorId} role="alert" className="text-xs leading-4 text-code-red">
          {error}
        </span>
      )}
    </label>
  )
}
