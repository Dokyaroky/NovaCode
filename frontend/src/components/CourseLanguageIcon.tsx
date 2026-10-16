import type { SVGProps } from 'react'

interface CourseLanguageIconProps {
  slug?: string
  title: string
}

export default function CourseLanguageIcon({ slug = '', title }: CourseLanguageIconProps) {
  const key = `${slug} ${title}`.toLowerCase()
  const common: SVGProps<SVGSVGElement> = {
    width: 42,
    height: 42,
    viewBox: '0 0 32 32',
    fill: 'none',
    role: 'img',
    'aria-label': `${title} language icon`,
    className: 'drop-shadow-[0_2px_3px_rgba(15,23,42,0.28)]',
  }

  if (key.includes('python')) {
    return (
      <svg {...common}>
        <path d="M16 3.5c-5.7 0-5.3 2.5-5.3 2.5v3.7h5.4v1.1H8.6C3.1 10.8 3 16 3 16s-.1 5.2 5.4 5.2h3.2v-3.9s-.2-5.3 5.2-5.3h5.1s5 .1 5-5.1S21.7 3.5 16 3.5Zm-3 3.1a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" fill="#3776AB" />
        <path d="M16 28.5c5.7 0 5.3-2.5 5.3-2.5v-3.7h-5.4v-1.1h7.5c5.5 0 5.6-5.2 5.6-5.2s.1-5.2-5.4-5.2h-3.2v3.9s.2 5.3-5.2 5.3h-5.1s-5-.1-5 5.1 5.2 3.4 10.9 3.4Zm3-3.1a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="#FFD343" />
      </svg>
    )
  }

  if (key.includes('javascript')) {
    return <svg {...common}><rect x="3" y="3" width="26" height="26" rx="2" fill="#F7DF1E" /><text x="16" y="22" textAnchor="middle" fontSize="13" fontWeight="800" fill="#111827">JS</text></svg>
  }

  if (key.includes('react')) {
    return <svg {...common}><ellipse cx="16" cy="16" rx="12" ry="4.8" stroke="#61DAFB" strokeWidth="2" /><ellipse cx="16" cy="16" rx="12" ry="4.8" transform="rotate(60 16 16)" stroke="#61DAFB" strokeWidth="2" /><ellipse cx="16" cy="16" rx="12" ry="4.8" transform="rotate(120 16 16)" stroke="#61DAFB" strokeWidth="2" /><circle cx="16" cy="16" r="2.5" fill="#61DAFB" /></svg>
  }

  if (key.includes('sql') || key.includes('database')) {
    return <svg {...common}><ellipse cx="16" cy="7" rx="10" ry="4" fill="#38BDF8" /><path d="M6 7v12c0 2.2 4.5 4 10 4s10-1.8 10-4V7" fill="#0284C7" /><path d="M6 13c0 2.2 4.5 4 10 4s10-1.8 10-4M6 19c0 2.2 4.5 4 10 4s10-1.8 10-4" stroke="#BAE6FD" strokeWidth="1.5" /><ellipse cx="16" cy="7" rx="10" ry="4" stroke="#BAE6FD" strokeWidth="1.5" /></svg>
  }

  if (key.includes('typescript')) {
    return <svg {...common}><rect x="3" y="3" width="26" height="26" rx="2" fill="#3178C6" /><text x="16" y="22" textAnchor="middle" fontSize="12" fontWeight="800" fill="white">TS</text></svg>
  }

  return <svg {...common}><circle cx="16" cy="16" r="13" fill="#EC4899" /><path d="m16 7 1.8 6.2L24 15l-6.2 1.8L16 23l-1.8-6.2L8 15l6.2-1.8L16 7Z" fill="white" /><circle cx="24" cy="8" r="1.5" fill="white" /></svg>
}
