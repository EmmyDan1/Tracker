'use client'

import { use } from 'react'
import { useAgentPortal } from '@/lib/useAgentPortal'
import AgentCard from '@/components/riders/agent/AgentCard'
import AgentDeliveryCard from '@/components/riders/agent/AgentDeliveryCard'

export default function AgentPortalPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = use(params)
  const { rider, deliveries, loading, notFound, updating, updateStatus } =
    useAgentPortal(code)

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg)' }}
      >
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg)' }}
      >
        <div className="text-center space-y-2">
          <p
            className="text-lg font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Portal not found
          </p>
          <p
            className="text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            This link is invalid or has been deactivated
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg)' }}
    >
      {/* Header */}
      <div
        className="px-4 py-4 border-b"
        style={{
          background: '#060606',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <span
            className="text-sm font-black tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Shippa
          </span>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-muted)',
            }}
          >
            Agent Portal
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Agent info card */}
        {rider && (
          <AgentCard
            rider={rider}
            deliveryCount={deliveries.length}
          />
        )}

        {/* Deliveries */}
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--text-muted)' }}
          >
            Active Deliveries
          </p>

          {deliveries.length === 0 ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                No active deliveries
              </p>
              <p
                className="text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                New deliveries assigned to you will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {deliveries.map((d) => (
                <AgentDeliveryCard
                  key={d.id}
                  delivery={d}
                  updating={updating === d.id}
                  onUpdate={updateStatus}
                />
              ))}
            </div>
          )}
        </div>

        <p
          className="text-center text-xs pb-6"
          style={{ color: 'var(--text-muted)' }}
        >
          Powered by{' '}
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
            Shippa
          </span>
        </p>
      </div>
    </div>
  )
}