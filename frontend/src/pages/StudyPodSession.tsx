import { useNavigate } from 'react-router-dom'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { SESSION, SESSION_CODE, SESSION_PEERS } from '@/data/studypod'
import cameraOff from '@/assets/icons/camera-off.svg'
import checkSm from '@/assets/icons/check-sm.svg'
import groupChallenge from '@/assets/icons/group-challenge.svg'
import micOff from '@/assets/icons/mic-off.svg'
import play from '@/assets/icons/play.svg'
import terminal from '@/assets/icons/terminal.svg'

function CallControl({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        className="grid size-12 place-items-center rounded-full bg-muted transition hover:brightness-110 active:scale-[0.98]"
      >
        <img src={icon} alt="" width={21} height={21} />
      </button>
      <span className="text-xs leading-4 whitespace-nowrap text-ink-soft">{label}</span>
    </div>
  )
}

/** Full-bleed session workspace: the frame is a 504 | 936 split with no sidebar. */
export default function StudyPodSession() {
  const navigate = useNavigate()

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[504px_minmax(0,1fr)]">
      <div className="flex flex-col gap-6 bg-shell p-6">
        <Card className="flex flex-col overflow-clip p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-2">
              <span className="text-xs leading-4 font-bold tracking-[0.96px] text-ink-soft uppercase">
                {SESSION.eyebrow}
              </span>
              <h1 className="text-2xl font-bold text-ink">{SESSION.title}</h1>
            </div>
            <span className="flex h-8 shrink-0 items-center gap-2 rounded-full bg-success-tint px-3 py-2">
              <span className="size-2 rounded-full bg-success" />
              <span className="text-xs font-bold whitespace-nowrap text-ink-soft">
                {SESSION.status}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6">
            {SESSION_PEERS.map((peer) => (
              <div
                key={peer.id}
                className="relative flex aspect-square flex-col items-center justify-center gap-3 overflow-clip rounded-card bg-code"
              >
                <span
                  className={`grid size-24 shrink-0 place-items-center rounded-full ${peer.gradient}`}
                >
                  <span className="text-2xl font-black text-white">{peer.initials}</span>
                </span>
                <span className="text-sm font-semibold text-white">{peer.name}</span>
                <span className="absolute top-4 right-4 size-3 rounded-full border-[1.8px] border-code bg-success" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 pt-6">
            <CallControl icon={micOff} label="Mute" />
            <CallControl icon={cameraOff} label="Turn Off Camera" />
          </div>
        </Card>

        <Card className="flex flex-1 flex-col gap-6 overflow-clip p-6">
          <div className="flex items-center gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-tile bg-brand-tint">
              <img src={groupChallenge} alt="" width={22} height={22} />
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <span className="text-xs leading-4 font-bold tracking-[0.96px] text-ink-soft uppercase">
                {SESSION.challengeEyebrow}
              </span>
              <h2 className="text-xl font-bold text-ink">{SESSION.challengeTitle}</h2>
            </div>
          </div>

          <p className="text-sm leading-6 text-ink-soft">{SESSION.challengeBody}</p>

          <ul className="flex flex-col gap-4">
            {SESSION.objectives.map((objective) => (
              <li key={objective} className="flex items-start gap-3">
                <span className="mt-1 grid size-4 shrink-0 place-items-center rounded-full bg-success-tint-strong">
                  <img src={checkSm} alt="" width={11} height={11} />
                </span>
                <span className="text-sm leading-5 text-ink-soft">{objective}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="flex min-w-0 flex-col border-t border-white/10 bg-[#0b1120] lg:border-t-0 lg:border-l">
        <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b-[0.9px] border-white/10 px-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-tile bg-brand">
              <img src={groupChallenge} alt="" width={22} height={22} />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="truncate text-xl font-bold text-white">{SESSION.editorTitle}</h1>
              <span className="truncate text-xs leading-4 text-ink-soft">{SESSION.editorMeta}</span>
            </div>
          </div>
          <span className="flex h-9 shrink-0 items-center gap-3 rounded-full bg-success-tint px-4 py-2">
            <span className="size-2 rounded-full bg-success opacity-95" />
            <span className="text-sm leading-5 font-semibold whitespace-nowrap text-ink-soft">
              {SESSION.peerStatus}
            </span>
          </span>
        </header>

        <div className="no-scrollbar flex flex-1 flex-col overflow-auto p-8">
          {SESSION_CODE.map((line, index) => {
            const lineNumber = index + 1

            return (
              <div key={lineNumber} className="flex h-9 items-start gap-8">
                <span className="w-6 shrink-0 text-right font-mono text-[15px] leading-9 text-ink-soft">
                  {lineNumber}
                </span>
                <span className="font-mono text-[15px] leading-9 whitespace-pre text-ink-soft">
                  {line}
                  {lineNumber === SESSION.caretLine && (
                    <span className="ml-0.5 inline-block h-5 w-0.5 translate-y-1 bg-brand opacity-95" />
                  )}
                </span>
              </div>
            )
          })}
        </div>

        <div className="px-6 pb-6">
          <div className="flex h-13 items-center gap-3 overflow-clip rounded-card bg-code p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <img src={terminal} alt="" width={17} height={17} />
            <span className="font-mono text-sm leading-5 text-ink-soft">{SESSION.runStatus}</span>
          </div>
        </div>

        <footer className="flex h-24 shrink-0 flex-wrap items-center justify-between gap-4 border-t-[0.9px] border-white/10 px-6">
          <p className="text-sm leading-5 text-ink-soft">{SESSION.footerNote}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="outline"
              iconPosition="start"
              icon={<img src={play} alt="" width={18} height={18} />}
            >
              Run Test
            </Button>
            <Button onClick={() => navigate('/dashboard')}>Submit Group Work</Button>
          </div>
        </footer>
      </div>
    </div>
  )
}
