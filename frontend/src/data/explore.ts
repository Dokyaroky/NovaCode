export interface Course {
  id: string
  /** Subject badge on the course tile (2–3 chars) and its fill from the design. */
  label: string
  labelBg: string
  xp: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  lessons: number
  title: string
}

export const CATEGORIES = ['All', 'Python', 'React', 'JavaScript', 'Data'] as const

export const COURSE_COUNT = 42

export const COURSES: Course[] = [
  {
    id: 'python-foundations',
    label: 'Py',
    labelBg: 'bg-info',
    xp: '+500 XP',
    level: 'Beginner',
    lessons: 24,
    title: 'Python Foundations',
  },
  {
    id: 'react-from-scratch',
    label: 'Re',
    labelBg: 'bg-[#06b6d4]',
    xp: '+650 XP',
    level: 'Intermediate',
    lessons: 18,
    title: 'React From Scratch',
  },
  {
    id: 'javascript-algorithms',
    label: 'JS',
    labelBg: 'bg-[#eab308]',
    xp: '+800 XP',
    level: 'Intermediate',
    lessons: 32,
    title: 'JavaScript Algorithms',
  },
  {
    id: 'sql-data-modeling',
    label: 'DB',
    labelBg: 'bg-accent',
    xp: '+500 XP',
    level: 'Beginner',
    lessons: 20,
    title: 'SQL & Data Modeling',
  },
  {
    id: 'ai-with-python',
    label: 'AI',
    labelBg: 'bg-[#ec4899]',
    xp: '+900 XP',
    level: 'Advanced',
    lessons: 16,
    title: 'AI With Python',
  },
  {
    id: 'typescript-mastery',
    label: 'TS',
    labelBg: 'bg-[#2563eb]',
    xp: '+750 XP',
    level: 'Advanced',
    lessons: 22,
    title: 'TypeScript Mastery',
  },
]
