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
import type { SVGProps } from 'react'

const AVATAR_TONES = ['bg-[#475569]', 'bg-accent', 'bg-success'] as const

/* The prototype sends every course card's button to the lesson player (`Course_Button` →
   `Main Video Page 43:2`, 300ms EASE_OUT); the app opens the same screen and says which course
   it enrolled. */
const LESSON_ROUTE = '/learn/mission'

function CourseLanguageIcon({ course }: { course: CatalogCourse }) {
  const common: SVGProps<SVGSVGElement> = {
    width: 42,
    height: 42,
    viewBox: '0 0 32 32',
    fill: 'none',
    role: 'img',
    'aria-label': `${course.title} language icon`,
    className: 'drop-shadow-[0_2px_3px_rgba(15,23,42,0.28)]',
  }

  if (course.slug.includes('python')) {
    return (
      <svg {...common}>
        <path d="M16 3.5c-5.7 0-5.3 2.5-5.3 2.5v3.7h5.4v1.1H8.6C3.1 10.8 3 16 3 16s-.1 5.2 5.4 5.2h3.2v-3.9s-.2-5.3 5.2-5.3h5.1s5 .1 5-5.1S21.7 3.5 16 3.5Zm-3 3.1a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" fill="#3776AB" />
        <path d="M16 28.5c5.7 0 5.3-2.5 5.3-2.5v-3.7h-5.4v-1.1h7.5c5.5 0 5.6-5.2 5.6-5.2s.1-5.2-5.4-5.2h-3.2v3.9s.2 5.3-5.2 5.3h-5.1s-5-.1-5 5.1 5.2 3.4 10.9 3.4Zm3-3.1a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="#FFD343" />
      </svg>
    )
  }

  if (course.slug.includes('javascript')) {
    return <svg {...common}><rect x="3" y="3" width="26" height="26" rx="2" fill="#F7DF1E" /><text x="16" y="22" textAnchor="middle" fontSize="13" fontWeight="800" fill="#111827">JS</text></svg>
  }

  if (course.slug.includes('react')) {
    return <svg {...common}><ellipse cx="16" cy="16" rx="12" ry="4.8" stroke="#61DAFB" strokeWidth="2" /><ellipse cx="16" cy="16" rx="12" ry="4.8" transform="rotate(60 16 16)" stroke="#61DAFB" strokeWidth="2" /><ellipse cx="16" cy="16" rx="12" ry="4.8" transform="rotate(120 16 16)" stroke="#61DAFB" strokeWidth="2" /><circle cx="16" cy="16" r="2.5" fill="#61DAFB" /></svg>
  }

  if (course.slug.includes('sql')) {
    return <svg {...common}><ellipse cx="16" cy="7" rx="10" ry="4" fill="#38BDF8" /><path d="M6 7v12c0 2.2 4.5 4 10 4s10-1.8 10-4V7" fill="#0284C7" /><path d="M6 13c0 2.2 4.5 4 10 4s10-1.8 10-4M6 19c0 2.2 4.5 4 10 4s10-1.8 10-4" stroke="#BAE6FD" strokeWidth="1.5" /><ellipse cx="16" cy="7" rx="10" ry="4" stroke="#BAE6FD" strokeWidth="1.5" /></svg>
  }

  if (course.slug.includes('typescript')) {
    return <svg {...common}><rect x="3" y="3" width="26" height="26" rx="2" fill="#3178C6" /><text x="16" y="22" textAnchor="middle" fontSize="12" fontWeight="800" fill="white">TS</text></svg>
  }

  return <svg {...common}><circle cx="16" cy="16" r="13" fill="#EC4899" /><path d="m16 7 1.8 6.2L24 15l-6.2 1.8L16 23l-1.8-6.2L8 15l6.2-1.8L16 7Z" fill="white" /><circle cx="24" cy="8" r="1.5" fill="white" /></svg>
}

function CourseCard({ course, onEnroll, disabled }: { course: CatalogCourse; onEnroll: () => void; disabled?: boolean }) {
  return (
    <Card className="flex min-h-[285px] flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="grid size-14 place-items-center">
          <CourseLanguageIcon course={course} />
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
        <Button onClick={onEnroll} disabled={disabled}>{disabled ? 'Enrolling…' : 'Enroll'}</Button>
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
  const [enrollingSlug, setEnrollingSlug] = useState<string | null>(null)

  const enroll = async (course: CatalogCourse) => {
    setEnrollingSlug(course.slug)
    try {
      await api.post(`/api/courses/${course.slug}/enroll`)
      push({ title: 'Enrolled', description: `${course.title} — opening the first lesson.`, tone: 'success' })
      navigate(LESSON_ROUTE)
    } catch (reason: unknown) {
      push({ title: 'Unable to enroll', description: reason instanceof ApiError ? reason.message : 'Please try again.', tone: 'error' })
    } finally { setEnrollingSlug(null) }
  }

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
              onEnroll={() => void enroll(course)}
              disabled={enrollingSlug === course.slug}
            />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
