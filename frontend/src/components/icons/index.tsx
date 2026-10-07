import type { SVGProps } from 'react'

/**
 * Icons whose colour changes with state (nav items, chevrons). The paths come from the
 * Figma exports with the baked-in #F8FAFC replaced by currentColor, so a wrapper only has
 * to set text-* to recolour them (nav active state = text-brand). Intrinsic size is kept
 * from the design; pass width/height to override it.
 */
export type IconProps = SVGProps<SVGSVGElement>

export function IconDashboard({ width = 20, height = 20, ...props }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Icon">
      <path id="Vector" d="M2.5 9.16667L10 2.5L17.5 9.16667" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
      <path id="Vector_2" d="M4.16667 8.33333V16.6667H15.8333V8.33333" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
      </g>
    </svg>
  )
}

export function IconLearn({ width = 20, height = 20, ...props }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Icon">
      <path id="Vector" d="M3.33333 4.58333C3.33333 4.0308 3.55283 3.5009 3.94353 3.11019C4.33423 2.71949 4.86413 2.5 5.41667 2.5H16.6667V15H5.41667C4.86413 15 4.33423 15.2195 3.94353 15.6102C3.55283 16.0009 3.33333 16.5308 3.33333 17.0833V4.58333Z" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
      <path id="Vector_2" d="M3.33333 4.58333V17.0833" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
      </g>
    </svg>
  )
}

export function IconExplore({ width = 20, height = 20, ...props }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Icon">
      <path id="Vector" d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
      <path id="Vector_2" d="M12.5 7.5L10.8333 10.8333L7.5 12.5L9.16667 9.16667L12.5 7.5Z" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
      </g>
    </svg>
  )
}

export function IconProjects({ width = 20, height = 20, ...props }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Icon">
      <path id="Vector" d="M2.5 5H8.33333L10 6.66667H17.5V15.8333H2.5V5Z" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
      </g>
    </svg>
  )
}

export function IconStudyPod({ width = 20, height = 20, ...props }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Icon">
      <path id="Vector" d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.8841 12.5 10 12.5H5C4.11595 12.5 3.2681 12.8512 2.64298 13.4763C2.01786 14.1014 1.66667 14.9493 1.66667 15.8333V17.5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" stroke="#F97316"/>
      <path id="Vector_2" d="M10.8333 5.83333C10.8333 7.67428 9.34095 9.16667 7.5 9.16667C5.65905 9.16667 4.16667 7.67428 4.16667 5.83333C4.16667 3.99238 5.65905 2.5 7.5 2.5C9.34095 2.5 10.8333 3.99238 10.8333 5.83333Z" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" stroke="#F97316"/>
      <path id="Vector_3" d="M18.3333 17.5V15.8333C18.3328 15.0948 18.087 14.3773 17.6345 13.7936C17.182 13.2099 16.5484 12.793 15.8333 12.6083M13.3333 2.60833C14.0503 2.79192 14.6859 3.20892 15.1397 3.79359C15.5935 4.37827 15.8399 5.09736 15.8399 5.8375C15.8399 6.57764 15.5935 7.29673 15.1397 7.88141C14.6859 8.46608 14.0503 8.88308 13.3333 9.06667" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" stroke="#F97316"/>
      </g>
    </svg>
  )
}

export function IconProfile({ width = 20, height = 20, ...props }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Icon">
      <path id="Vector" d="M13.3333 6.66667C13.3333 8.50762 11.8409 10 10 10C8.15905 10 6.66667 8.50762 6.66667 6.66667C6.66667 4.82572 8.15905 3.33333 10 3.33333C11.8409 3.33333 13.3333 4.82572 13.3333 6.66667Z" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
      <path id="Vector_2" d="M3.33333 17.5C3.33333 15.7319 4.03571 14.0362 5.28595 12.786C6.5362 11.5357 8.23189 10.8333 10 10.8333C11.7681 10.8333 13.4638 11.5357 14.714 12.786C15.9643 14.0362 16.6667 15.7319 16.6667 17.5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
      </g>
    </svg>
  )
}

export function IconChevronRight({ width = 16.65, height = 18, ...props }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16.65 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Icon">
      <path id="Vector" d="M3.46875 9H13.1813" strokeWidth="1.3875" strokeLinecap="round" strokeLinejoin="round" stroke="white"/>
      <path id="Vector_2" d="M9.01875 4.8375L13.1813 9L9.01875 13.1625" strokeWidth="1.3875" strokeLinecap="round" strokeLinejoin="round" stroke="white"/>
      </g>
    </svg>
  )
}

export function IconChevronSmall({ width = 16, height = 16, ...props }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Icon">
      <path id="Vector" d="M3.33333 8H12.6667" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" stroke="white"/>
      <path id="Vector_2" d="M8.66667 4L12.6667 8L8.66667 12" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" stroke="white"/>
      </g>
    </svg>
  )
}

