import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { SETUP, STUDY_DIFFICULTIES, STUDY_TOPICS } from '@/data/studypod'
import arrowRight from '@/assets/icons/arrow-right.svg'
import studypod from '@/assets/icons/studypod.svg'

interface SelectProps {
  label: string
  placeholder: string
  options: readonly string[]
  value: string
  onChange: (next: string) => void
}

/** 56px dropdown on the dark canvas with the design's ↓ affordance. */
function Select({ label, placeholder, options, value, onChange }: SelectProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm leading-5 font-semibold text-ink">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-14 w-full appearance-none rounded-lg border-[0.9px] border-white/25 bg-shell px-4 text-base font-semibold outline-none transition focus:border-brand/70 ${
            value ? 'text-ink' : 'text-ink-soft/60'
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-shell text-ink">
              {option}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-lg text-ink-soft"
        >
          ↓
        </span>
      </span>
    </label>
  )
}

export default function StudyPod() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const ready = Boolean(topic && difficulty)

  return (
    <AppShell>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden py-8">
        <div
          className="pointer-events-none absolute top-24 left-32 size-72 rounded-full bg-accent-tint blur-[100px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-[640px] left-[800px] size-64 rounded-full bg-brand-tint blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative flex w-full max-w-[640px] flex-col items-center gap-6">
          <Card className="flex w-full flex-col items-center overflow-clip p-8">
            <div className="flex flex-col items-center gap-6">
              <div className="grid size-16 shrink-0 place-items-center rounded-card bg-accent-tint-strong shadow-[0_0_40px_0_rgba(139,92,246,0.2)]">
                <img src={studypod} alt="" width={30} height={30} />
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs leading-4 font-bold tracking-[0.96px] text-ink-soft uppercase">
                  {SETUP.eyebrow}
                </span>
                <h1 className="text-display text-center text-ink">{SETUP.title}</h1>
                <p className="text-center text-base leading-7 text-ink-soft">{SETUP.subtitle}</p>
              </div>
            </div>

            <form
              className="flex w-full max-w-[576px] flex-col gap-6 pt-8"
              onSubmit={(event) => {
                event.preventDefault()
                if (ready) navigate('/studypod/matching')
              }}
            >
              <Select
                label={SETUP.topicLabel}
                placeholder={SETUP.topicPlaceholder}
                options={STUDY_TOPICS}
                value={topic}
                onChange={setTopic}
              />
              <Select
                label={SETUP.difficultyLabel}
                placeholder={SETUP.difficultyPlaceholder}
                options={STUDY_DIFFICULTIES}
                value={difficulty}
                onChange={setDifficulty}
              />
              <div className="pt-2">
                <Button
                  size="lg"
                  type="submit"
                  className="w-full"
                  disabled={!ready}
                  icon={<img src={arrowRight} alt="" width={18} height={18} />}
                >
                  {SETUP.submit}
                </Button>
              </div>
            </form>
          </Card>

          <div className="flex items-center gap-3">
            <span className="size-2 shrink-0 rounded-full bg-success" />
            <p className="text-sm leading-5 text-ink-soft">{SETUP.waitNote}</p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
