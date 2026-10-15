import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

/**
 * Renders overlays (dialogs, drawers, menus, tooltips, toasts) into document.body.
 * The shell clips its columns with overflow-hidden, so anything anchored inside a card
 * would be cut off without this.
 */
export default function Portal({ children }: { children: ReactNode }) {
  return createPortal(children, document.body)
}
