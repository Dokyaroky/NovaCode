import { useState } from 'react'
import AppShell from '@/components/AppShell'
import Button from '@/components/Button'
import Card from '@/components/Card'
import StatusPill from '@/components/StatusPill'
import { CATEGORIES, COURSES, COURSE_COUNT } from '@/data/explore'
import chipCourses from '@/assets/icons/chip-courses.svg'
import searchIcon from '@/assets/icons/search.svg'
import sparkle from '@/assets/icons/sparkle.svg'

const AVATAR_TONES = ['bg-[#475569]', 'bg-accent', 'bg-success'] as const

function CourseCard({ course }: { course: (typeof COURSES)[number] }) {
  return (
    <Card className="flex min-h-[285px] flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className={`grid size-14 place-items-center rounded-card ${course.labelBg}`}>
          <span className="text-base font-bold text-white">{course.label}</span>
        </div>
        <StatusPill>{course.xp}</StatusPill>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-xs text-ink-soft">
          <span>{course.level}</span>
          <span aria-hidden="true">•</span>
          <span>{course.lessons} lessons</span>
        </div>
        <h2 className="text-lg font-bold text-ink">{course.title}</h2>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4">
        <div className="flex">
          {AVATAR_TONES.map((tone, index) => (
            <span
              key={tone}
              className={`-ml-2 grid size-8 place-items-center rounded-full border-[1.8px] border-surface text-xs font-bold text-white first:ml-0 ${tone}`}
            >
              {String.fromCharCode(77 + index)}
            </span>
          ))}
        </div>
        <Button onClick={() => undefined}>Enroll</Button>
      </div>
    </Card>
  )
}

function FilterChips({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {CATEGORIES.map((category) => {
        const isActive = category === value

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            className={`h-11 shrink-0 rounded-full px-5 text-base transition active:scale-[0.98] ${
              isActive
                ? 'bg-accent text-white'
                : 'bg-surface text-ink-soft hover:text-ink'
            }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}

export default function Explore() {
  const [category, setCategory] = useState<string>('All')
  const [query, setQuery] = useState('')

  const visible = COURSES.filter((course) => {
    const matchesCategory = category === 'All' || course.title.toLowerCase().includes(category.toLowerCase())
    const matchesQuery = course.title.toLowerCase().includes(query.trim().toLowerCase())
    return matchesCategory && matchesQuery
  })

  return (
    <AppShell>
      <div className="flex w-full flex-1 flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="inline-flex h-[34px] w-fit shrink-0 items-center gap-2 rounded-full bg-accent-tint px-[14px] py-2">
              <img src={sparkle} alt="" width={16} height={16} />
              <span className="text-xs leading-[18px] font-bold tracking-[0.72px] text-ink-violet uppercase">
                Explore catalog
              </span>
            </div>
            <h1 className="text-display text-ink">Choose your next skill</h1>
            <p className="text-base leading-6 text-ink-soft">
              Practical courses built around real projects.
            </p>
          </div>

          <div className="flex h-11 shrink-0 items-center gap-3 rounded-card bg-surface px-5 shadow-card">
            <img src={chipCourses} alt="" width={20} height={20} />
            <span className="text-base font-semibold whitespace-nowrap text-white">
              {COURSE_COUNT} courses
            </span>
          </div>
        </div>

        <div className="flex min-h-[88px] flex-col gap-6 lg:flex-row lg:items-center">
          <label className="relative flex h-14 w-full items-center lg:max-w-[554px]">
            <img
              src={searchIcon}
              alt=""
              width={21}
              height={21}
              className="pointer-events-none absolute left-4"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses, skills, or topics…"
              aria-label="Cari kursus"
              className="h-14 w-full rounded-card bg-surface pr-4 pl-12 text-sm text-ink outline-none transition shadow-card placeholder:text-ink-soft/60 focus:shadow-[0_0_0_1px_rgba(139,92,246,0.6)]"
            />
          </label>
          <FilterChips value={category} onChange={setCategory} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
