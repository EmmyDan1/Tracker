'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--bg)' }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10"
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        <div>
          <div className="mb-16">
            <span
              className="text-xl font-black tracking-tight"
              style={{ color: 'var(--accent)' }}
            >
              TRACKER
            </span>
          </div>

          <div className="space-y-6">
            <p
              className="text-4xl font-black leading-tight"
              style={{ color: 'white' }}
            >
              Logistics,<br />
              <span style={{ color: 'var(--accent)' }}>
                simplified.
              </span>
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--sidebar-text)' }}
            >
              Manage your agents, track deliveries in
              real-time, and share tracking links with
              customers — no phone calls needed.
            </p>
          </div>
        </div>

        <div
          className="space-y-5 border-t pt-8"
          style={{ borderColor: 'var(--sidebar-border)' }}
        >
          {[
            {
              label: 'Agent management',
              sub: 'Bike, car and van agents in one place',
            },
            {
              label: 'Delivery tracking',
              sub: 'Real-time status updates',
            },
            {
              label: 'Shareable links',
              sub: 'No app needed for customers',
            },
          ].map((item) => (
            <div key={item.label}>
              <p
                className="text-sm font-semibold"
                style={{ color: 'white' }}
              >
                {item.label}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: 'var(--sidebar-text)' }}
              >
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-10 lg:hidden">
            <span
              className="text-lg font-black tracking-tight"
              style={{ color: 'var(--accent)' }}
            >
              TRACKER
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-black mb-1">
              Sign in
            </h1>
            <p
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Access your logistics dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-secondary)' }}
              >
                Email
              </label>
              <input
                type="email"
                className="input-base"
                placeholder="company@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-secondary)' }}
              >
                Password
              </label>
              <input
                type="password"
                className="input-base"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div
                className="text-xs px-3 py-2 rounded-lg"
                style={{
                  background: 'rgba(230,57,70,0.1)',
                  color: '#E63946',
                  border: '1px solid rgba(230,57,70,0.2)',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full justify-center py-2.5"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p
            className="mt-6 text-xs text-center"
            style={{ color: 'var(--text-muted)' }}
          >
            Contact your administrator to create an account.
          </p>
        </div>
      </div>
    </div>
  )
}