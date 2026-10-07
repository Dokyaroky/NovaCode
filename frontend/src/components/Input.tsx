interface InputProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  name?: string
  autoComplete?: string
  className?: string
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
}: InputProps) {
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
        className="h-14 w-full rounded-lg border-[0.9px] border-white/25 bg-shell px-4 text-sm font-semibold text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-brand/70"
      />
    </label>
  )
}
