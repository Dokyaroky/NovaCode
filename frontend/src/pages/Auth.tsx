import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthIllustration from '@/components/AuthIllustration'
import AuthLayout from '@/components/AuthLayout'
import Button from '@/components/Button'
import Input from '@/components/Input'
import OAuthButton from '@/components/OAuthButton'
import Tabs from '@/components/Tabs'
import { useToast } from '@/components/Toast'
import arrowRight from '@/assets/icons/arrow-right.svg'
import sparkle from '@/assets/icons/sparkle.svg'
import { api, ApiError } from '@/lib/api'
import { resetCurrentUserCache } from '@/lib/currentUser'

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
  check: 'Checking your credentials…',
  signedIn: 'Signed in',
  oauthTitle: (provider: string) => `${provider} sign-in is not connected`,
  oauthBody: 'This build only accepts the email form on this screen.',
  errors: {
    fullName: 'Enter the name on your account.',
    email: 'Enter a valid email address.',
    password: 'Use at least 8 characters.',
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
  const { push } = useToast()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string }>({})
  const [pending, setPending] = useState(false)
  const isSignup = mode === 'signup'
  const copy = COPY[mode]

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const next: typeof errors = {}
    if (isSignup && !fullName.trim()) next.fullName = COPY.errors.fullName
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = COPY.errors.email
    if (password.length < 8) next.password = COPY.errors.password
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setPending(true)
    try {
      if (isSignup) {
        await api.post('/api/register', {
          name: fullName.trim(),
          email: email.trim(),
          password,
        })
      } else {
        await api.post('/api/login', { email: email.trim(), password })
      }

      resetCurrentUserCache()

      push({
        title: COPY.signedIn,
        description: 'Your session is ready.',
        tone: 'success',
      })
      navigate('/dashboard')
    } catch (error) {
      push({
        title: 'Unable to sign in',
        description: error instanceof ApiError ? error.message : 'Please try again.',
        tone: 'error',
      })
    } finally {
      setPending(false)
    }
  }

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

      <form className="flex flex-col gap-6 pt-8" onSubmit={handleSubmit} aria-busy={pending}>
        {isSignup && (
          <Input
            label="Full Name"
            name="fullName"
            placeholder="Alex Morgan"
            autoComplete="name"
            value={fullName}
            onChange={(value) => {
              setFullName(value)
              setErrors((current) => ({ ...current, fullName: undefined }))
            }}
            error={errors.fullName}
          />
        )}
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="alex@example.com"
          autoComplete="email"
          value={email}
          onChange={(value) => {
            setEmail(value)
            setErrors((current) => ({ ...current, email: undefined }))
          }}
          error={errors.email}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          value={password}
          onChange={(value) => {
            setPassword(value)
            setErrors((current) => ({ ...current, password: undefined }))
          }}
          error={errors.password}
        />
        <div className="pt-2">
          <Button
            size="lg"
            type="submit"
            className="w-full"
            disabled={pending}
            icon={<img src={arrowRight} alt="" width={18} height={18} />}
          >
            {pending ? COPY.check : copy.submit}
          </Button>
        </div>
      </form>

      <div className="flex items-center gap-4 pt-8">
        <span className="h-px flex-1 bg-white/20" />
        <span className="text-xs font-medium text-ink-soft">or continue with</span>
        <span className="h-px flex-1 bg-white/20" />
      </div>

      {/* The providers are not wired to anything in this build; the buttons say so rather than
          pretending to sign the user in. */}
      <div className="grid grid-cols-2 gap-4 pt-8">
        <OAuthButton
          label="GitHub"
          mark="GH"
          onClick={() =>
            push({
              title: COPY.oauthTitle('GitHub'),
              description: COPY.oauthBody,
              tone: 'info',
            })
          }
        />
        <OAuthButton
          label="Google"
          mark="G"
          markClassName="text-lg font-black"
          onClick={() =>
            push({
              title: COPY.oauthTitle('Google'),
              description: COPY.oauthBody,
              tone: 'info',
            })
          }
        />
      </div>
    </AuthLayout>
  )
}
