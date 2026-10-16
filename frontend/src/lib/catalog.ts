export interface CourseCategory {
  slug: string
  name: string
}

export interface CatalogCourse {
  slug: string
  title: string
  label: string
  labelBg: string
  xp: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  lessons: number
  categories: CourseCategory[]
}

export interface CourseIndexResponse {
  data: CatalogCourse[]
  meta: { total: number }
}

export interface CourseCategoryResponse {
  data: CourseCategory[]
}
