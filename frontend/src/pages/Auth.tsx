import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthIllustration from '@/components/AuthIllustration'
import AuthLayout from '@/components/AuthLayout'
import Button from '@/components/Button'
import Input from '@/components/Input'
import OAuthButton from '@/components/OAuthButton'
import Tabs from '@/components/Tabs'
import arrowRight from '@/assets/icons/arrow-right.svg'
import sparkle from '@/assets/icons/sparkle.svg'

const TABS = [
  { id: 'signup', label: 'Sign Up' },
  { id: 'login', label: 'Log In' },
]

const COPY = {
  signup: {
    heading: 'Create your account',
    subtitle: 'Start building verified skills today.',
    submit: 'Create Account',
  },
  login: {
    heading: 'Welcome back',
    subtitle: 'Continue your path to the next rank.',
    submit: 'Log In',
  },
} as const

function Marketing() {
  return (
    <div className="flex w-full max-w-[592px] flex-col items-center gap-24">
      <div className="flex w-full max-w-[520px] flex-col gap-6">
        <div className="inline-flex h-[34px] w-fit shrink-0 items-center gap-2 rounded-full bg-accent-tint px-[14px] py-2">
          <img src={sparkle} alt="" width={16} height={16} />
          <span className="text-xs leading-[18px] font-bold tracking-[0.72px] text-ink-violet uppercase">
            Start your quest
          </span>
        </div>
        <h1 className="text-hero-sm text-ink">
          Join the
          <br />
          Developer Rank
        </h1>
        <p className="max-w-[480px] text-lg leading-8 text-ink-soft">
          Level up your coding skills with AI-audited Proof-of-Work.
        </p>
      </div>
      <AuthIllustration />
    </div>
  )
}

interface AuthProps {
  /** Both frames are the same screen in two modes; the tab row switches between them. */
  mode: 'signup' | 'login'
}

export default function Auth({ mode }: AuthProps) {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const isSignup = mode === 'signup'
  const copy = COPY[mode]

  return (
    <AuthLayout aside={<Marketing />}>
      <Tabs
        tabs={TABS}
        value={mode}
        onChange={(id) => navigate(id === 'signup' ? '/signup' : '/login')}
      />

      <div className="flex flex-col gap-3 pt-8">
        <h2 className="text-3xl font-bold text-ink">{copy.heading}</h2>
        <p className="text-sm leading-6 text-ink-soft">{copy.subtitle}</p>
      </div>

      <form className="flex flex-col gap-6 pt-8" onSubmit={(event) => event.preventDefault()}>
        {isSignup && (
          <Input
            label="Full Name"
            placeholder="Alex Morgan"
            autoComplete="name"
            value={fullName}
            onChange={setFullName}
          />
        )}
        <Input
          label="Email"
          type="email"
          placeholder="alex@example.com"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          value={password}
          onChange={setPassword}
        />
        <div className="pt-2">
          <Button
            size="lg"
            type="submit"
            className="w-full"
            icon={<img src={arrowRight} alt="" width={18} height={18} />}
          >
            {copy.submit}
          </Button>
        </div>
      </form>

      <div className="flex items-center gap-4 pt-8">
        <span className="h-px flex-1 bg-white/20" />
        <span className="text-xs font-medium text-ink-soft">or continue with</span>
        <span className="h-px flex-1 bg-white/20" />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-8">
        <OAuthButton label="GitHub" mark="GH" />
        <OAuthButton label="Google" mark="G" markClassName="text-lg font-black" />
      </div>
    </AuthLayout>
  )
}
