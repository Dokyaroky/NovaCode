import radar01 from '@/assets/radar/radar-1.svg'
import radar02 from '@/assets/radar/radar-2.svg'
import radar03 from '@/assets/radar/radar-3.svg'
import radar04 from '@/assets/radar/radar-4.svg'
import radar05 from '@/assets/radar/radar-5.svg'
import radar06 from '@/assets/radar/radar-6.svg'
import radar07 from '@/assets/radar/radar-7.svg'
import radar08 from '@/assets/radar/radar-8.svg'

interface Vector {
  src: string
  box: string
  /** Figma draws some vectors slightly past their own box. */
  bleed?: string
}

/* Figma node 12:700 — a 220x220 radar built from 8 vectors, plus 3 axis labels. */
const VECTORS: Vector[] = [
  { src: radar01, box: 'inset-[10%_15.2%_30%_15.2%]', bleed: 'inset-[-0.75%_-0.57%_-0.38%_-0.57%]' },
  { src: radar02, box: 'inset-[22.73%_26.27%_36.36%_26.27%]', bleed: 'inset-[-1.11%_-0.83%_-0.56%_-0.83%]' },
  { src: radar03, box: 'inset-[35.45%_37.35%_42.73%_37.35%]', bleed: 'inset-[-2.08%_-1.56%_-1.04%_-1.56%]' },
  { src: radar04, box: 'bottom-1/2 left-1/2 right-1/2 top-[10%]', bleed: 'inset-[0_-0.5px]' },
  { src: radar05, box: 'bottom-[30%] left-1/2 right-[15%] top-1/2', bleed: 'inset-[-0.99%_-0.32%]' },
  { src: radar06, box: 'bottom-[30%] left-[15%] right-1/2 top-1/2', bleed: 'inset-[-0.99%_-0.32%]' },
  { src: radar07, box: 'inset-[15.91%_20.91%_33.18%_22.27%]', bleed: 'inset-[-2.73%_-2.09%_-1.38%_-2.02%]' },
  { src: radar08, box: 'inset-[13.64%_47.73%_81.82%_47.73%]', bleed: 'inset-[-10%]' },
  { src: radar08, box: 'inset-[64.55%_18.64%_30.91%_76.82%]', bleed: 'inset-[-10%]' },
  { src: radar08, box: 'inset-[63.64%_75.45%_31.82%_20%]', bleed: 'inset-[-10%]' },
]

const LABELS = [
  { text: 'OOP', left: 97, top: 0 },
  { text: 'Logic', left: 188.3, top: 176 },
  { text: 'Database', left: 0, top: 176 },
]

/** Verified-strength radar chart from the Profile frame. */
export default function SkillRadar() {
  return (
    <div className="relative mx-auto size-[220px] shrink-0">
      {VECTORS.map((vector, index) => (
        <div key={index} className={`absolute ${vector.box}`}>
          <div className={`absolute ${vector.bleed}`}>
            <img src={vector.src} alt="" className="block size-full max-w-none" />
          </div>
        </div>
      ))}
      {LABELS.map((label) => (
        <span
          key={label.text}
          className="absolute text-xs leading-4 font-semibold whitespace-nowrap text-ink-soft"
          style={{ left: label.left, top: label.top }}
        >
          {label.text}
        </span>
      ))}
      <span className="sr-only">
        Radar chart: strongest in object-oriented programming, logic and databases.
      </span>
    </div>
  )
}
