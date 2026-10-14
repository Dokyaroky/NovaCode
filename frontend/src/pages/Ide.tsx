import { useState } from 'react'
import Button from '@/components/Button'
import Card from '@/components/Card'
import NovaLogo from '@/components/NovaLogo'
import ProgressBar from '@/components/ProgressBar'
import { IDE, IDE_CODE, IDE_EXAMPLE, IDE_REQUIREMENTS, IDE_REQUIREMENT_TOKEN } from '@/data/ide'
import aiHint from '@/assets/icons/ai-hint.svg'
import github from '@/assets/icons/github.svg'
import run from '@/assets/icons/run.svg'
import terminalIcon from '@/assets/icons/terminal-ide.svg'

/**
 * Full-bleed IDE: the frame is an 80px top bar over a 460 | 980 split, with no sidebar.
 * The design's top-left wordmark reads "CodeQuest"; per the locked decision it renders NovaCode.
 */
export default function Ide() {
  const [output, setOutput] = useState<string>(IDE.readyMessage)
  const [running, setRunning] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)

  const runCode = () => {
    setRunning(true)
    setOutput(IDE.runningMessage)
    window.setTimeout(() => {
      setOutput(IDE.okMessage)
      setRunning(false)
    }, 900)
  }

  return (
    <div className="flex min-h-screen flex-col bg-shell">
      <header className="flex h-20 shrink-0 flex-wrap items-center justify-between gap-4 border-b-[0.9px] border-white/8 px-4 md:px-8">
        <NovaLogo />
        <div className="flex items-center gap-6">
          <span className="text-sm leading-5 whitespace-nowrap text-ink-soft">{IDE.moduleLabel}</span>
          <div className="w-40 shrink-0">
            <ProgressBar value={IDE.moduleProgress} size="sm" />
          </div>
          <button
            type="button"
            aria-label="Open profile"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-base text-white transition hover:brightness-110 active:scale-[0.98]"
          >
            {IDE.profileInitial}
          </button>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[460px_minmax(0,1fr)]">
        <section className="flex flex-col gap-6 border-white/8 bg-rail p-6 md:p-8 lg:border-r-[0.9px]">
          <div className="inline-flex h-[34px] w-fit shrink-0 items-center rounded-full bg-accent-tint px-[14px] py-2">
            <span className="text-xs leading-[18px] font-bold tracking-[0.72px] text-ink-violet uppercase">
              {IDE.badge}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-ink">{IDE.title}</h1>
            <p className="text-base leading-7 text-ink-soft">{IDE.brief}</p>
          </div>

          <Card className="flex flex-col gap-4 overflow-clip p-5">
            <h2 className="text-base font-semibold text-white">{IDE.requirementsTitle}</h2>
            <ul className="flex flex-col gap-3">
              {IDE_REQUIREMENTS.map((requirement) => (
                <li key={requirement} className="flex items-center gap-3 text-sm leading-5 text-ink-soft">
                  <span aria-hidden="true">✓</span>
                  <span>{requirement}</span>
                  {requirement.endsWith('named') && (
                    <span className="font-mono text-sm text-ink-soft">{IDE_REQUIREMENT_TOKEN}</span>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          <div className="flex flex-col rounded-card bg-code p-5">
            <span className="font-mono text-sm leading-5 text-ink-soft">{IDE_EXAMPLE.label}</span>
            <span className="pt-3 font-mono text-sm leading-5 text-ink-soft">{IDE_EXAMPLE.call}</span>
            <span className="pt-2 font-mono text-sm leading-5 text-ink-soft">{IDE_EXAMPLE.result}</span>
          </div>

          <Button
            variant="secondary"
            className="self-start"
            iconPosition="start"
            aria-expanded={hintOpen}
            icon={<img src={aiHint} alt="" width={18} height={18} />}
            onClick={() => setHintOpen((open) => !open)}
          >
            {IDE.hint}
          </Button>

          {hintOpen && (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col gap-3 rounded-card bg-accent-tint p-5"
            >
              <p className="text-sm font-semibold text-white">{IDE.hintTitle}</p>
              <p className="font-mono text-sm leading-6 text-ink-soft">
                {IDE_EXAMPLE.call} {IDE_EXAMPLE.result}
              </p>
              <p className="text-sm leading-6 text-ink-soft">
                {IDE_REQUIREMENTS[0]} <span className="font-mono">{IDE_REQUIREMENT_TOKEN}</span>
              </p>
            </div>
          )}
        </section>

        <section className="flex min-w-0 flex-col bg-[#0b1120]">
          <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-b-[0.9px] border-white/8 px-6">
            <div className="flex h-full items-center gap-3 border-b-[1.8px] border-brand px-2">
              <img src={github} alt="" width={18} height={18} />
              <span className="font-mono text-sm leading-5 text-white">{IDE.filename}</span>
              <span className="size-2 rounded-full bg-brand" />
            </div>
            <span className="text-xs leading-4 whitespace-nowrap text-ink-soft">{IDE.savedLabel}</span>
          </div>

          <div className="no-scrollbar flex flex-1 flex-col overflow-auto p-6 md:p-8">
            {IDE_CODE.map((line, index) => (
              <div key={index} className="flex h-9 items-start gap-8">
                <span className="w-5 shrink-0 text-right font-mono text-[15px] leading-9 text-ink-soft">
                  {index + 1}
                </span>
                <span className="font-mono text-[15px] leading-9 whitespace-pre text-ink-soft">{line}</span>
              </div>
            ))}
          </div>

          <div className="flex min-h-[220px] flex-col border-t-[0.9px] border-white/8 bg-code">
            <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-b-[0.9px] border-white/8 px-6">
              <div className="flex items-center gap-3">
                <img src={terminalIcon} alt="" width={18} height={18} />
                <span className="text-sm leading-5 font-semibold text-white">{IDE.terminalLabel}</span>
              </div>
              <Button
                disabled={running}
                icon={<img src={run} alt="" width={17} height={17} />}
                onClick={runCode}
              >
                {IDE.runLabel}
              </Button>
            </div>
            <p className="p-6 font-mono text-sm leading-7 text-ink-soft">{output}</p>
          </div>
        </section>
      </div>
    </div>
  )
}
