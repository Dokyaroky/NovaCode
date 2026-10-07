interface PlaceholderProps {
  name: string
  node: string
  path: string
}

/** Temporary stand-in for a screen that has not been implemented from Figma yet. */
export default function Placeholder({ name, node, path }: PlaceholderProps) {
  return (
    <main className="flex min-h-full items-center justify-center bg-canvas p-8">
      <div className="w-full max-w-md rounded-card bg-surface p-6 text-center shadow-card">
        <span className="font-mono text-xs text-ink-violet">Figma node {node}</span>
        <h1 className="mt-2 text-2xl font-bold text-ink">{name}</h1>
        <p className="mt-1 text-sm text-ink-soft/70">
          <code className="font-mono text-ink-soft">{path}</code> — screen not implemented yet
        </p>
      </div>
    </main>
  )
}
