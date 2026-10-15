import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/Button'
import Card from '@/components/Card'
import NovaLogo from '@/components/NovaLogo'
import ProgressBar from '@/components/ProgressBar'
import {
  IDE,
  IDE_CODE,
  IDE_EXAMPLE,
  IDE_REQUIREMENTS,
  IDE_REQUIREMENT_TOKEN,
  IDE_TESTS,
  runSolution,
} from '@/data/ide'
import aiHint from '@/assets/icons/ai-hint.svg'
import github from '@/assets/icons/github.svg'
import run from '@/assets/icons/run.svg'
import terminalIcon from '@/assets/icons/terminal-ide.svg'

type RunStatus = 'ready' | 'running' | 'passed' | 'failed'

/**
 * Full-bleed IDE: the frame is an 80px top bar over a 460 | 980 split, with no sidebar.
 * The design's top-left wordmark reads "CodeQuest"; per the locked decision it renders NovaCode.
 *
 * The editor is real: `Run code` reports the verdict of `runSolution(buffer)`, so an edited or
 * emptied buffer fails the suite instead of always printing the frame's success line. The run
 * itself is a local simulation with the delay in `IDE_TESTS.runDelay` — there is no backend.
 */
export default function Ide() {
  const [code, setCode] = useState<string>(IDE_CODE.join('\n'))
  const [output, setOutput] = useState<string>(IDE.readyMessage)
  const [status, setStatus] = useState<RunStatus>('ready')
  const [running, setRunning] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)

  const runCode = () => {
    /* The verdict is computed from the buffer at the moment of the click; the delay only
       simulates the time a runner would take. */
    const verdict = runSolution(code)
    setRunning(true)
    setStatus('running')
    setOutput(IDE.runningMessage)
    window.setTimeout(() => {
      setOutput(verdict.message)
      setStatus(verdict.passed ? 'passed' : 'failed')
      setRunning(false)
    }, IDE_TESTS.runDelay)
  }

  const lines = code.split('\n')

  return (
    <div className="flex min-h-screen flex-col bg-shell">
      <header className="flex h-20 shrink-0 flex-wrap items-center justify-between gap-4 border-b-[0.9px] border-white/8 px-4 md:px-8">
        <NovaLogo />
        <div className="flex items-center gap-6">
          <span className="text-sm leading-5 whitespace-nowrap text-ink-soft">{IDE.moduleLabel}</span>
          <div className="w-40 shrink-0">
            <ProgressBar value={IDE.moduleProgress} size="sm" />
          </div>
          <Link
            to="/profile"
            aria-label="Open profile"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-base text-white transition duration-300 ease-out-back hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.98]"
          >
            {IDE.profileInitial}
          </Link>
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

          <div className="flex flex-1 gap-8 overflow-auto p-6 md:p-8">
            {/* Gutter: same row height as the textarea, so the numbers stay with their lines. */}
            <div aria-hidden="true" className="flex w-5 shrink-0 flex-col items-end">
              {lines.map((_, index) => (
                <span key={index} className="font-mono text-[15px] leading-9 text-ink-soft">
                  {index + 1}
                </span>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
              rows={Math.max(lines.length, 1)}
              aria-label={IDE.editorLabel}
              wrap="off"
              className="min-w-0 flex-1 resize-none border-0 bg-transparent p-0 font-mono text-[15px] leading-9 whitespace-pre text-ink-soft caret-brand outline-none"
            />
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
            <p
              role="status"
              aria-live="polite"
              className={`p-6 font-mono text-sm leading-7 ${
                status === 'failed' ? 'text-code-red' : status === 'passed' ? 'text-success' : 'text-ink-soft'
              }`}
            >
              {output}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
