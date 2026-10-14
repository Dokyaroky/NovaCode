import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

/* Shared behaviour for the interactive primitives (Modal, Drawer, Dropdown, Tooltip).
   Each hook takes an `active` flag so a closed overlay installs no listeners at all. */

/** Escape closes the top-most overlay that is listening. */
export function useEscapeKey(active: boolean, onEscape: () => void) {
  const callback = useRef(onEscape)

  useEffect(() => {
    callback.current = onEscape
  })

  useEffect(() => {
    if (!active) return
    const handle = (event: KeyboardEvent) => {
      if (event.key === 'Escape') callback.current()
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [active])
}

/**
 * A pointer press anywhere outside `refs` dismisses the overlay. Pass every element that
 * belongs to it (a portalled menu and its trigger are two different refs).
 */
export function useClickOutside(
  refs: Array<RefObject<HTMLElement | null>>,
  active: boolean,
  onOutside: () => void,
) {
  const callback = useRef(onOutside)

  useEffect(() => {
    callback.current = onOutside
  })

  useEffect(() => {
    if (!active) return
    const handle = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      const inside = refs.some((ref) => ref.current?.contains(target))
      if (!inside) callback.current()
    }
    document.addEventListener('pointerdown', handle)
    return () => document.removeEventListener('pointerdown', handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}

export interface AnchorRect {
  top: number
  left: number
  width: number
  height: number
  bottom: number
  right: number
}

/** Viewport-space rect of `ref`, tracked on scroll and resize while `active`. */
export function useAnchorRect(ref: RefObject<HTMLElement | null>, active: boolean) {
  const [rect, setRect] = useState<AnchorRect | null>(null)

  useLayoutEffect(() => {
    if (!active) {
      setRect(null)
      return
    }

    const measure = () => {
      const node = ref.current
      if (!node) return
      const box = node.getBoundingClientRect()
      setRect({
        top: box.top,
        left: box.left,
        width: box.width,
        height: box.height,
        bottom: box.bottom,
        right: box.right,
      })
    }

    measure()
    /* Capture phase: also catches scrolling inside the shell's own columns. */
    window.addEventListener('scroll', measure, true)
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('resize', measure)
    }
  }, [ref, active])

  return rect
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/** Moves focus into the overlay, keeps Tab inside it, and restores focus on close. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return
    const node = ref.current
    const previous = document.activeElement
    const items = () =>
      node
        ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
            (element) => element.offsetParent !== null,
          )
        : []

    const first = items()[0]
    if (first) first.focus()
    else node?.focus()

    const handle = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !node) return
      const focusable = items()
      const firstItem = focusable[0]
      const lastItem = focusable[focusable.length - 1]
      if (!firstItem || !lastItem) {
        event.preventDefault()
        return
      }
      const current = document.activeElement
      if (event.shiftKey && (current === firstItem || current === node)) {
        event.preventDefault()
        lastItem.focus()
      } else if (!event.shiftKey && current === lastItem) {
        event.preventDefault()
        firstItem.focus()
      }
    }

    document.addEventListener('keydown', handle)
    return () => {
      document.removeEventListener('keydown', handle)
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [ref, active])
}

/** The shell scrolls its own columns, but a stacked page below lg scrolls the body. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [active])
}
