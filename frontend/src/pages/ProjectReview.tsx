import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import Button from '@/components/Button'
import Card from '@/components/Card'
import IconTile from '@/components/IconTile'
import ProgressBar from '@/components/ProgressBar'
import StatusPill from '@/components/StatusPill'
import Tabs from '@/components/Tabs'
import {
  DEFAULT_REVIEW_MODE,
  PROJECT_REVIEW,
  auditGap,
  auditOutcome,
  isReviewMode,
  pendingAuditOf,
  simulateAudit,
} from '@/data/projects'
import type { AuditOutcome, FindingSeverity, ProjectAudit, ReviewMode } from '@/data/projects'
import arrowRight from '@/assets/icons/arrow-right.svg'
import auditSparkle from '@/assets/icons/audit-sparkle.svg'
import certificate from '@/assets/icons/certificates.svg'
import briefIcon from '@/assets/icons/chip-courses.svg'
import chevronRight from '@/assets/icons/chevron-right.svg'
import stepDone from '@/assets/icons/step-done.svg'
import upload from '@/assets/icons/upload.svg'

/* 125:7001 draws the result card with a green ring when the audit passed. */
const OUTCOME_TONE: Record<AuditOutcome, { border: string; box: string; text: string }> = {
  passed: {
    border: 'border-[rgba(16,185,129,0.6)]',
    box: 'bg-[rgba(16,185,129,0.1)]',
    text: 'text-success',
  },
  failed: {
    border: 'border-[rgba(251,113,133,0.6)]',
    box: 'bg-[rgba(251,113,133,0.1)]',
    text: 'text-code-red',
  },
  pending: { border: 'border-white/10', box: 'bg-[rgba(16,185,129,0.1)]', text: 'text-success' },
}

const FINDING_DOT: Record<FindingSeverity, string> = {
  ok: 'bg-success',
  minor: 'bg-code-amber',
  major: 'bg-code-red',
}

const FINDING_LABEL: Record<FindingSeverity, string> = {
  ok: 'text-success',
  minor: 'text-code-amber',
  major: 'text-code-red',
}

/**
 * Project final review (125:7001), with the automated-review layout of 87:3682 as a mode and
 * the `--` snapshot of 122:6806 as the pending state of the audit.
 */
export default function ProjectReview() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const requested = params.get('step')
  const mode: ReviewMode = isReviewMode(requested) ? requested : DEFAULT_REVIEW_MODE

  const [audit, setAudit] = useState<ProjectAudit>(PROJECT_REVIEW.audit)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [repoUrl, setRepoUrl] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  /* Guards a resolved run against a newer one (and against an unmounted card). */
  const runToken = useRef(0)

  const { audit: baseAudit, submission, result, steps, brief } = PROJECT_REVIEW
  const outcome = auditOutcome(audit)
  const tone = OUTCOME_TONE[outcome]
  const hasSubmission = repoUrl.trim().length > 0 || fileName !== null
  const canSubmit = hasSubmission && !running

  const selectMode = (id: string) => {
    setParams(id === DEFAULT_REVIEW_MODE ? {} : { step: id }, { replace: true })
  }

  /* Mock run: the pending snapshot and its latency both come from the data module. */
  const runAudit = () => {
    if (running) return
    const token = runToken.current + 1
    runToken.current = token
    setRunning(true)
    setProgress(8)
    setAudit(pendingAuditOf(baseAudit))
    void simulateAudit(baseAudit).then((resolved) => {
      if (token !== runToken.current) return
      setAudit(resolved)
      setRunning(false)
    })
  }

  /* Indeterminate-but-monotonic bar: the audit has no staged progress to report yet. */
  useEffect(() => {
    if (!running) return
    const tick = Math.max(90, Math.round(baseAudit.runMs / 12))
    const id = window.setInterval(() => {
      setProgress((current) => (current >= 88 ? 88 : current + 8))
    }, tick)
    return () => window.clearInterval(id)
  }, [running, baseAudit.runMs])

  const scoreLabel =
    outcome === 'pending' ? result.pendingLabel : `${outcome.toUpperCase()} - ${audit.score}/100`
  const note =
    outcome === 'pending'
      ? result.pendingNote
      : outcome === 'passed'
        ? audit.verdict
        : `${auditGap(audit)} points below the minimum score`
  const header =
    outcome === 'pending'
      ? { eyebrow: result.pendingEyebrow, title: `${audit.minimumScore}/100` }
      : mode === 'automated'
        ? { eyebrow: result.automatedEyebrow, title: result.automatedTitle }
        : { eyebrow: result.finalEyebrow, title: result.finalTitle }

  const completedSteps = steps.items.filter((step) => step.status === 'complete').length

  const pickFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (file) setFileName(file.name)
  }

  return (
    <AppShell mainClassName="p-4 md:p-6 lg:p-8">
      <div className="flex w-full flex-1 flex-col gap-6">
        <Tabs tabs={PROJECT_REVIEW.modes} value={mode} onChange={selectMode} />

        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_372.4px]">
          <section className="flex min-w-0 flex-col gap-6">
            <header className="flex flex-col">
              <p className="text-sm leading-5 font-medium text-ink-soft">{PROJECT_REVIEW.eyebrow[mode]}</p>
              <h1 className="pt-2 text-display text-white">{PROJECT_REVIEW.heading}</h1>
            </header>

            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="inline-flex h-10 w-fit shrink-0 items-center gap-2 rounded-full border-[0.9px] border-[#94a3b8] px-4 text-base text-ink-soft transition hover:bg-white/5 active:scale-[0.98]"
            >
              <img src={chevronRight} alt="" width={17} height={17} className="rotate-180 opacity-80" />
              {PROJECT_REVIEW.continueLabel}
            </button>

            {mode === 'automated' && (
              <Card className="flex flex-col overflow-clip px-6 pt-2 pb-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
                  <h2 className="text-2xl font-bold text-white">{steps.title}</h2>
                  <StatusPill>{`${completedSteps} of ${steps.items.length} complete`}</StatusPill>
                </div>
                <ul className="flex flex-col pt-5">
                  {steps.items.map((step, index) => (
                    <li
                      key={step.id}
                      className={`flex items-center gap-4 py-4 ${
                        index < steps.items.length - 1 ? 'border-b-[0.9px] border-white/8' : ''
                      }`}
                    >
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-full ${
                          step.status === 'complete' ? 'bg-success-tint' : 'bg-brand-tint'
                        }`}
                      >
                        {step.status === 'complete' ? (
                          <img src={stepDone} alt="" width={20} height={20} />
                        ) : (
                          <span className="text-base font-bold text-brand">{index + 1}</span>
                        )}
                      </span>
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="text-base font-bold text-white">{step.title}</span>
                        <span className="text-xs leading-4 text-ink-soft">{step.statusLabel}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <Card className="flex flex-col overflow-clip p-6">
              <span className="text-xs leading-4 font-bold tracking-[0.96px] text-brand uppercase">
                {submission.eyebrow}
              </span>
              <h2 className="pt-2 text-2xl font-bold text-white">
                {mode === 'automated' ? submission.automatedTitle : submission.finalTitle}
              </h2>

              <div className="flex flex-col gap-4 pt-5">
                <label htmlFor="repo-url" className="text-sm font-semibold text-white">
                  {submission.urlLabel}
                </label>
                <input
                  id="repo-url"
                  type="url"
                  value={repoUrl}
                  onChange={(event) => setRepoUrl(event.target.value)}
                  placeholder={submission.urlPlaceholder}
                  className="h-12 w-full rounded-tile border-[0.9px] border-[#475569] bg-shell px-4 text-sm font-semibold text-white outline-none transition placeholder:font-semibold placeholder:text-[#64748b] focus-visible:ring-2 focus-visible:ring-brand/60"
                />
              </div>

              <div className="flex items-center gap-4 py-5">
                <span aria-hidden="true" className="h-px flex-1 bg-[#475569]" />
                <span className="text-xs leading-4 font-bold text-ink-soft">OR</span>
                <span aria-hidden="true" className="h-px flex-1 bg-[#475569]" />
              </div>

              <label
                htmlFor="project-archive"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault()
                  pickFiles(event.dataTransfer.files)
                }}
                className="flex min-h-[170px] cursor-pointer flex-col items-center justify-center gap-4 rounded-card border-[1.8px] border-dashed border-[#64748b] bg-shell px-6 py-6 text-center transition hover:border-brand"
              >
                <IconTile tone="accent">
                  <img src={upload} alt="" width={25} height={25} />
                </IconTile>
                <span className="text-base leading-6 font-semibold text-white">
                  {fileName ?? submission.dropHint}
                </span>
                <span className="text-xs leading-4 text-ink-soft">
                  {fileName ? 'Selected archive' : submission.dropNote}
                </span>
                <input
                  id="project-archive"
                  type="file"
                  accept=".zip"
                  className="sr-only"
                  onChange={(event) => pickFiles(event.target.files)}
                />
              </label>

              <div className="pt-5">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!canSubmit}
                  onClick={runAudit}
                  icon={<img src={arrowRight} alt="" width={18} height={18} />}
                >
                  {submission.submitLabel}
                </Button>
                <p className="pt-3 text-xs leading-4 text-ink-soft">
                  {running
                    ? result.auditingLabel
                    : hasSubmission
                      ? 'The audit scores the submitted work against the brief.'
                      : 'Add a repository URL or a .zip file to submit.'}
                </p>
              </div>
            </Card>
          </section>

          <aside className="flex min-w-0 flex-col gap-6" aria-busy={running}>
            <Card className="flex flex-col overflow-clip p-6">
              <IconTile tone="brand">
                <img src={briefIcon} alt="" width={23} height={23} />
              </IconTile>
              <span className="pt-6 text-xs leading-4 font-bold tracking-[0.96px] text-ink-soft uppercase">
                {brief.eyebrow}
              </span>
              <h2 className="pt-2 text-2xl font-bold text-white">{brief.title}</h2>
              <p className="pt-4 text-sm leading-6 text-[#cbd5e1]">{brief.body}</p>
              <ul className="flex flex-col gap-3 pt-5">
                {brief.requirements.map((requirement) => (
                  <li key={requirement} className="flex items-center gap-3">
                    <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-success" />
                    <span className="text-sm leading-5 text-[#cbd5e1]">{requirement}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className={`flex flex-1 flex-col overflow-clip border-[0.9px] p-6 ${tone.border}`}>
              <div className="flex h-12 items-center gap-3">
                <IconTile size="xs" tone="accentSolid" className="size-10">
                  <img src={auditSparkle} alt="" width={20} height={20} />
                </IconTile>
                <div className="flex min-w-0 flex-col">
                  <span className="text-xs leading-4 font-bold tracking-[0.96px] text-ink-soft uppercase">
                    {header.eyebrow}
                  </span>
                  <h2 className="pt-1 text-xl leading-7 font-bold text-white">{header.title}</h2>
                </div>
              </div>

              <div className="py-8">
                <div
                  aria-live="polite"
                  className={`flex flex-col items-center rounded-card px-5 py-6 ${tone.box}`}
                >
                  <p className={`text-center text-3xl leading-9 font-black ${tone.text}`}>{scoreLabel}</p>
                  <p
                    className={`pt-3 text-center text-xs leading-4 font-semibold tracking-[0.96px] uppercase ${tone.text}`}
                  >
                    {note}
                  </p>
                </div>
              </div>

              {running && (
                <div role="status" className="flex flex-col gap-3 pb-6">
                  <span className="text-sm leading-5 text-ink-soft">{result.auditingLabel}</span>
                  <ProgressBar value={progress} size="sm" label="Audit progress" />
                </div>
              )}

              {audit.summary && <p className="text-sm leading-6 text-[#cbd5e1]">{audit.summary}</p>}

              <div className="pt-6">
                <dl className="flex flex-col gap-3 border-t-[0.9px] border-white/8 pt-6">
                  {audit.criteria.map((criterion) => (
                    <div key={criterion.id} className="flex items-center justify-between gap-4">
                      <dt className="text-sm leading-5 text-ink-soft">{criterion.label}</dt>
                      <dd className="text-sm leading-5 font-bold text-white">
                        {criterion.percent === null ? '--' : `${criterion.percent}%`}
                      </dd>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm leading-5 text-ink-soft">{result.minimumLabel}</dt>
                    <dd className="text-sm leading-5 font-bold text-white">{audit.minimumScore}/100</dd>
                  </div>
                </dl>
              </div>

              {audit.findings.length > 0 && (
                <div className="pt-6">
                  <h3 className="text-xs leading-4 font-bold tracking-[0.96px] text-ink-soft uppercase">
                    {result.findingsLabel}
                  </h3>
                  <ul className="flex flex-col gap-3 pt-4">
                    {audit.findings.map((finding) => (
                      <li key={finding.id} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className={`mt-2 size-1.5 shrink-0 rounded-full ${FINDING_DOT[finding.severity]}`}
                        />
                        <span className="flex min-w-0 flex-col gap-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-sm leading-5 font-semibold text-white">{finding.area}</span>
                            <span
                              className={`text-[10px] leading-[15px] font-bold tracking-[0.72px] uppercase ${FINDING_LABEL[finding.severity]}`}
                            >
                              {finding.severity}
                            </span>
                          </span>
                          <span className="text-xs leading-4 text-ink-soft">{finding.detail}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={running}
                  onClick={runAudit}
                >
                  {running ? result.rerunningLabel : result.rerunLabel}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={outcome !== 'passed'}
                  onClick={() => navigate('/profile?tab=certificates')}
                  iconPosition="start"
                  icon={<img src={certificate} alt="" width={18} height={18} />}
                >
                  {result.certificateLabel}
                </Button>
                {outcome !== 'passed' && (
                  <p className="text-xs leading-4 text-ink-soft">
                    The certificate unlocks once the audit passes the minimum score.
                  </p>
                )}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}
