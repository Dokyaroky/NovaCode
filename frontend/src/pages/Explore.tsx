import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import Button from '@/components/Button'
import Card from '@/components/Card'
import StatusPill from '@/components/StatusPill'
import { useToast } from '@/components/Toast'
import { api, ApiError } from '@/lib/api'
import type { CatalogCourse, CourseCategory, CourseCategoryResponse, CourseIndexResponse } from '@/lib/catalog'
import chipCourses from '@/assets/icons/chip-courses.svg'
import searchIcon from '@/assets/icons/search.svg'
import sparkle from '@/assets/icons/sparkle.svg'

const AVATAR_TONES = ['bg-[#475569]', 'bg-accent', 'bg-success'] as const

/* The prototype sends every course card's button to the lesson player (`Course_Button` →
   `Main Video Page 43:2`, 300ms EASE_OUT); the app opens the same screen and says which course
   it enrolled. */
const LESSON_ROUTE = '/learn/mission'

function CourseCard({ course, onEnroll }: { course: CatalogCourse; onEnroll: () => void }) {
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
        <Button onClick={onEnroll}>Enroll</Button>
      </div>
    </Card>
  )
}

function FilterChips({ categories, value, onChange }: {
  categories: CourseCategory[]
  value: string
  onChange: (next: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {[{ slug: 'all', name: 'All' }, ...categories].map((category) => {
        const isActive = category.slug === value

        return (
          <button
            key={category.slug}
            type="button"
            onClick={() => onChange(category.slug)}
            aria-pressed={isActive}
            className={`h-11 shrink-0 rounded-full px-5 text-base transition active:scale-[0.98] ${
              isActive
                ? 'bg-accent text-white'
                : 'bg-surface text-ink-soft hover:text-ink'
            }`}
          >
            {category.name}
          </button>
        )
      })}
    </div>
  )
}

export default function Explore() {
  const navigate = useNavigate()
  const { push } = useToast()
  const [category, setCategory] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [courses, setCourses] = useState<CatalogCourse[]>([])
  const [categories, setCategories] = useState<CourseCategory[]>([])
  const [courseCount, setCourseCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    api
      .get<CourseCategoryResponse>('/api/course-categories')
      .then((response) => {
        if (!cancelled) setCategories(response.data)
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof ApiError ? reason.message : 'Unable to load categories.')
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams()
    if (query.trim()) params.set('search', query.trim())
    if (category !== 'all') params.set('category', category)
    const suffix = params.toString() ? `?${params.toString()}` : ''

    setLoading(true)
    setError(null)
    api
      .get<CourseIndexResponse>(`/api/courses${suffix}`)
      .then((response) => {
        if (!cancelled) {
          setCourses(response.data)
          setCourseCount(response.meta.total)
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof ApiError ? reason.message : 'Unable to load courses.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [category, query])

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
              {courseCount} courses
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
          <FilterChips categories={categories} value={category} onChange={setCategory} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {loading && <p role="status" className="text-sm text-ink-soft">Loading courses…</p>}
          {!loading && error && <p role="alert" className="text-sm text-code-red">{error}</p>}
          {!loading && !error && courses.length === 0 && (
            <p className="text-sm text-ink-soft">No courses match your search.</p>
          )}
          {!loading && !error && courses.map((course) => (
            <CourseCard
              key={course.slug}
              course={course}
              onEnroll={() => {
                push({
                  title: 'Enrolled',
                  description: `${course.title} — opening the first lesson.`,
                  tone: 'success',
                })
                navigate(LESSON_ROUTE)
              }}
            />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
