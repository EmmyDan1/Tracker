'use client'

import { useEffect, useState } from 'react'

export default function AIBriefing() {
  const [briefing, setBriefing] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBriefing() {
      try {
        const res = await fetch('/api/ai/briefing', { method: 'POST' })
        const data = await res.json()
        setBriefing(data.briefing)
      } catch {
        setBriefing('Unable to load briefing.')
      }
      setLoading(false)
    }
    fetchBriefing()
  }, [])

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 mb-6"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #111111 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Subtle glow */}
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10"
        style={{
          background: '#ffffff',
          transform: 'translate(30%, -30%)',
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: '#4ade80' }}
          />
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            AI Briefing · {new Date().toLocaleDateString('en-NG', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-2">
            <div
              className="h-4 rounded-full w-3/4 animate-pulse"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            />
            <div
              className="h-4 rounded-full w-1/2 animate-pulse"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            />
          </div>
        ) : (
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            {briefing}
          </p>
        )}
      </div>
    </div>
  )
}