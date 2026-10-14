import { useState } from 'react'
import type { ReactNode } from 'react'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Drawer from '@/components/Drawer'
import type { DrawerSide } from '@/components/Drawer'
import Dropdown from '@/components/Dropdown'
import type { DropdownItem } from '@/components/Dropdown'
import Input from '@/components/Input'
import Modal from '@/components/Modal'
import SectionHeader from '@/components/SectionHeader'
import StatusPill from '@/components/StatusPill'
import Tooltip from '@/components/Tooltip'
import type { TooltipSide } from '@/components/Tooltip'
import { useToast } from '@/components/Toast'
import { IconChevronDown } from '@/components/icons'

const SIDES: TooltipSide[] = ['top', 'right', 'bottom', 'left']

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-bold tracking-[0.96px] text-ink-violet uppercase">{title}</h2>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  )
}

/** Dev-only gallery of the interactive primitives. Remove once pages use them for real. */
export default function Interactions() {
  const { push } = useToast()
  const [modal, setModal] = useState<'confirm' | 'detail' | null>(null)
  const [drawer, setDrawer] = useState<DrawerSide | null>(null)
  const [selected, setSelected] = useState('quicksort')
  const [note, setNote] = useState('')

  const items: DropdownItem[] = [
    {
      id: 'rename',
      label: 'Rename project',
      onSelect: () => push({ title: 'Rename project', description: 'Mock action — nothing persists yet.' }),
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      onSelect: () => push({ title: 'Project duplicated', tone: 'success' }),
    },
    { id: 'export', label: 'Export as PDF', disabled: true },
    {
      id: 'delete',
      label: 'Delete project',
      tone: 'danger',
      separatorBefore: true,
      onSelect: () => setModal('confirm'),
    },
  ]

  return (
    <main className="flex min-h-full flex-col gap-10 bg-canvas p-8">
      <SectionHeader
        title="Interactions"
        subtitle="Overlays, menus and feedback — portalled so the shell's clipping never cuts them off."
      >
        <StatusPill tone="brand">motion on</StatusPill>
      </SectionHeader>

      <Block title="Modal">
        <Button onClick={() => setModal('detail')}>Open dialog</Button>
        <Button variant="outline" onClick={() => setModal('confirm')}>
          Destructive confirm
        </Button>
        <p className="max-w-md text-sm text-ink-soft">
          Esc or a press on the scrim closes it; Tab cycles inside the panel and focus returns
          to the trigger afterwards.
        </p>
      </Block>

      <Block title="Drawer">
        <Button variant="secondary" onClick={() => setDrawer('right')}>
          Open right drawer
        </Button>
        <Button variant="outline" onClick={() => setDrawer('left')}>
          Open left drawer
        </Button>
      </Block>

      <Block title="Dropdown">
        <Dropdown
          label="Project actions"
          items={items}
          trigger={({ open, toggle }) => (
            <Button variant="outline" onClick={toggle} icon={<IconChevronDown />}>
              {open ? 'Close menu' : 'Project actions'}
            </Button>
          )}
        />
        <Dropdown
          label="Sort by"
          align="end"
          items={[
            { id: 'recent', label: 'Most recent', onSelect: () => push({ title: 'Sorted by recency' }) },
            { id: 'xp', label: 'Most XP', onSelect: () => push({ title: 'Sorted by XP' }) },
            { id: 'name', label: 'Name (A–Z)', onSelect: () => push({ title: 'Sorted by name' }) },
          ]}
          trigger={({ toggle }) => (
            <Button variant="ghost" onClick={toggle} icon={<IconChevronDown />}>
              Sort
            </Button>
          )}
        />
        <p className="max-w-md text-sm text-ink-soft">
          Arrow keys move the highlight, Enter selects, Esc closes. The menu is fixed-positioned
          so it escapes the cards below.
        </p>
      </Block>

      <Block title="Tooltip">
        {SIDES.map((side) => (
          <Tooltip key={side} label={`Tooltip on ${side}`} side={side}>
            <Button variant="outline">{side}</Button>
          </Tooltip>
        ))}
        <Tooltip label="Appears after 180ms, also on keyboard focus" delay={0}>
          <Input
            label="Project name"
            placeholder="nova-sort-visualiser"
            value={note}
            onChange={setNote}
          />
        </Tooltip>
      </Block>

      <Block title="Toast · feedback">
        <Button onClick={() => push({ title: 'Saved', description: 'Your draft is up to date.' })}>
          Info toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => push({ title: 'Tests passed', description: '4 of 4 cases green.', tone: 'success' })}
        >
          Success toast
        </Button>
        <Button
          variant="outline"
          onClick={() => push({ title: 'Submission failed', description: 'Peer is still editing.', tone: 'error' })}
        >
          Error toast
        </Button>
        <Button
          variant="ghost"
          onClick={() => push({ title: 'Sticky toast', description: 'Dismiss it yourself.', duration: 0 })}
        >
          Persistent toast
        </Button>
      </Block>

      <Block title="Hover · focus · press">
        <Card className="flex w-full max-w-lg flex-col gap-2 p-4">
          {['Quicksort', 'Merge sort', 'Bubble sort'].map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={selected === name}
              onClick={() => setSelected(name)}
              className={`flex items-center justify-between gap-4 rounded-tile px-4 py-3 text-left text-sm font-medium transition duration-150 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none active:scale-[0.99] ${
                selected === name ? 'bg-white/10 text-ink' : 'text-ink-soft hover:bg-white/5'
              }`}
            >
              {name}
              {selected === name && <StatusPill tone="brand">selected</StatusPill>}
            </button>
          ))}
        </Card>
        <Button
          variant="outline"
          onClick={() => setModal('confirm')}
          className="focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
        >
          Focus ring on a pill
        </Button>
      </Block>

      <Block title="Anchored inside a clipping card">
        <Card className="flex w-full max-w-sm items-center justify-between gap-4 overflow-clip p-6">
          <span className="text-sm text-ink-soft">overflow-clip, like the real cards</span>
          <Dropdown
            label="Card actions"
            align="end"
            items={items}
            trigger={({ toggle }) => (
              <Tooltip label="These escape the clip">
                <button
                  type="button"
                  onClick={toggle}
                  aria-label="Card actions"
                  className="grid size-9 place-items-center rounded-tile text-ink-soft transition duration-150 hover:bg-white/10 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
                >
                  <IconChevronDown />
                </button>
              </Tooltip>
            )}
          />
        </Card>
      </Block>

      <Modal
        open={modal === 'detail'}
        onClose={() => setModal(null)}
        title="Session summary"
        description="Two collaborators, one shared buffer, and the tests that decided the outcome."
        footer={
          <>
            <Button variant="outline" onClick={() => setModal(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setModal(null)
                push({ title: 'Submitted for review', tone: 'success' })
              }}
            >
              Submit
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3 rounded-card bg-code p-4">
          <span className="font-mono text-sm text-ink-soft">4 tests passed in 0.12s</span>
          <span className="font-mono text-sm text-ink-soft">peer: Alex Morgan · edits 3</span>
        </div>
      </Modal>

      <Modal
        open={modal === 'confirm'}
        onClose={() => setModal(null)}
        size="sm"
        title="Delete this project?"
        description="This cannot be undone. The mock data would disappear with it."
        footer={
          <>
            <Button variant="outline" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setModal(null)
                push({ title: 'Project deleted', description: 'Mock only — nothing was removed.', tone: 'error' })
              }}
            >
              Delete
            </Button>
          </>
        }
      />

      <Drawer
        open={drawer !== null}
        onClose={() => setDrawer(null)}
        side={drawer ?? 'right'}
        title="Project details"
        description="Everything the rail shows on desktop, sliding in on narrow screens."
        footer={
          <Button
            onClick={() => {
              setDrawer(null)
              push({ title: 'Changes saved', tone: 'success' })
            }}
          >
            Save changes
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          {['Stack', 'Tests', 'Peer reviews', 'Submission'].map((row) => (
            <div key={row} className="flex items-center justify-between gap-4 rounded-card bg-code p-4">
              <span className="text-sm text-ink-soft">{row}</span>
              <StatusPill>ready</StatusPill>
            </div>
          ))}
        </div>
      </Drawer>
    </main>
  )
}
