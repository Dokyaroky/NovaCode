import type { ReactNode } from 'react'

interface CodeWindowProps {
  lines: string[]
  filename?: string
  showLineNumbers?: boolean
  headerAction?: ReactNode
  className?: string
}

/** The editor panel from the design: traffic lights + filename header over a dark body. */
export default function CodeWindow({
  lines,
  filename,
  showLineNumbers = true,
  headerAction,
  className = '',
}: CodeWindowProps) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-card bg-surface shadow-card ${className}`}>
      <div className="flex h-14 shrink-0 items-center justify-between bg-code-header px-5">
        <div className="flex shrink-0 items-center gap-2">
          <span className="size-3 rounded-full bg-code-red" />
          <span className="size-3 rounded-full bg-code-amber" />
          <span className="size-3 rounded-full bg-success" />
        </div>
        {filename && <p className="font-mono text-xs text-ink-soft">{filename}</p>}
        {headerAction ?? <span className="size-[18px] shrink-0" />}
      </div>
      <div className="flex flex-col gap-0 bg-code p-8">
        {lines.map((line, index) => (
          <div key={`${index}-${line}`} className="flex h-8 items-start gap-6">
            {showLineNumbers && (
              <span className="w-4 shrink-0 font-mono text-sm leading-8 text-ink-soft">
                {index + 1}
              </span>
            )}
            <span className="font-mono text-sm leading-8 whitespace-pre text-ink-soft">{line}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
