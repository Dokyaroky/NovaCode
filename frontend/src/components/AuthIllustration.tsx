import ill01 from '@/assets/illustration/ill-01.svg'
import ill02 from '@/assets/illustration/ill-02.svg'
import ill03 from '@/assets/illustration/ill-03.svg'
import ill04 from '@/assets/illustration/ill-04.svg'
import ill05 from '@/assets/illustration/ill-05.svg'
import ill06 from '@/assets/illustration/ill-06.svg'
import ill07 from '@/assets/illustration/ill-07.svg'
import ill08 from '@/assets/illustration/ill-08.svg'
import ill09 from '@/assets/illustration/ill-09.svg'
import ill10 from '@/assets/illustration/ill-10.svg'
import ill11 from '@/assets/illustration/ill-11.svg'

/* The artwork is 11 vectors positioned with percentage insets inside a 520x360 box
   (Figma node 4:244). `bleed` marks the ones the design draws past their own box. */
const VECTORS = [
  { src: ill01, box: 'inset-[82.22%_16.92%_5.56%_16.92%]', bleed: false },
  { src: ill02, box: 'inset-[22.78%_63.65%_17.22%_14.23%]', bleed: true },
  { src: ill03, box: 'inset-[17.22%_65.19%_22.78%_12.69%]', bleed: false },
  { src: ill04, box: 'inset-[22.78%_11.15%_17.22%_66.73%]', bleed: true },
  { src: ill05, box: 'inset-[17.22%_12.69%_22.78%_65.19%]', bleed: false },
  { src: ill06, box: 'inset-[29.44%_37.31%_29.72%_40.38%]', bleed: true },
  { src: ill07, box: 'inset-[23.89%_38.85%_35.28%_38.85%]', bleed: false },
  { src: ill08, box: 'inset-[30%_30.77%_44.17%_30.77%]', bleed: false },
  { src: ill09, box: 'inset-[61.67%_47.31%_23.89%_47.31%]', bleed: false },
  { src: ill10, box: 'bottom-[17.22%] left-[40.38%] right-[40.38%] top-3/4', bleed: false },
  { src: ill11, box: 'inset-[31.11%_43.65%_51.39%_43.65%]', bleed: false },
]

/** Marketing artwork on the auth screens. */
export default function AuthIllustration() {
  return (
    /* Figma node 4:258 — a 264px container holding a 360px box pulled up by 96px. */
    <div className="relative h-[264px] w-full max-w-[520px]">
      <div className="absolute top-[-96px] left-0 h-[360px] w-[520px]">
        {VECTORS.map(({ src, box, bleed }) => (
          <div key={src} className={`absolute ${box}`}>
            {bleed ? (
              <div className="absolute inset-[-10.79%_-20.26%]">
                <img src={src} alt="" className="block size-full max-w-none" />
              </div>
            ) : (
              <img src={src} alt="" className="absolute inset-0 block size-full max-w-none" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
