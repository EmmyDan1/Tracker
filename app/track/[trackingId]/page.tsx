import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Delivery } from '@/types'
import { STATUS_LABELS, STATUS_ORDER, formatDate } from '@/lib/utils'

function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export default async function TrackingPage({
  params,
}: {
  params: Promise<{ trackingId: string }>
}) {
  const { trackingId } = await params
  const supabase = createPublicClient()

  const { data: delivery } = await supabase
    .from('deliveries')
    .select('*, riders(name, phone), companies(name)')
    .eq('tracking_id', trackingId.toUpperCase())
    .single()

  if (!delivery) notFound()

  const d = delivery as Delivery & {
    riders?: { name: string; phone: string }
    companies?: { name: string }
  }

  const currentStep = STATUS_ORDER.indexOf(d.status)
  const isCancelled = d.status === 'cancelled'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div
        className="border-b"
        style={{
          background: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <span
            className="text-sm font-black tracking-tight"
            style={{ color: 'var(--accent)' }}
          >
            TRACKER
          </span>
          {d.companies?.name && (
            <span
              className="text-xs"
              style={{ color: 'var(--sidebar-text)' }}
            >
              {d.companies.name}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {/* Tracking ID */}
        <div
          className="rounded-[var(--radius)] p-5"
          style={{ background: 'white', border: '1px solid var(--border)' }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            Tracking ID
          </p>
          <p className="mono font-black text-2xl tracking-widest">
            {d.tracking_id}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Created {formatDate(d.created_at)}
          </p>
        </div>

        {/* Current status */}
        <div
          className="rounded-[var(--radius)] p-5"
          style={{
            background: isCancelled ? '#fff5f5' : '#FAFFF0',
            border: `1px solid ${isCancelled ? '#fcc' : 'var(--accent-dark)'}`,
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: 'var(--text-muted)' }}
          >
            Current Status
          </p>
          <p
            className="text-2xl font-black"
            style={{ color: isCancelled ? '#c0392b' : 'var(--text-primary)' }}
          >
            {STATUS_LABELS[d.status]}
          </p>
        </div>

        {/* Progress stepper */}
        {!isCancelled && (
          <div
            className="rounded-[var(--radius)] p-5"
            style={{ background: 'white', border: '1px solid var(--border)' }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-5"
              style={{ color: 'var(--text-muted)' }}
            >
              Progress
            </p>
            <div className="space-y-4">
              {STATUS_ORDER.map((step, idx) => {
                const done = idx <= currentStep
                const current = idx === currentStep
                return (
                  <div key={step} className="flex items-center gap-4">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black transition-all"
                      style={{
                        background: done ? 'var(--sidebar-bg)' : 'var(--bg)',
                        color: done
                          ? current
                            ? 'var(--accent)'
                            : 'white'
                          : 'var(--text-muted)',
                        border: done ? 'none' : '1.5px solid var(--border)',
                      }}
                    >
                      {done && !current ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color: done
                            ? 'var(--text-primary)'
                            : 'var(--text-muted)',
                        }}
                      >
                        {STATUS_LABELS[step]}
                      </p>
                      {current && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{
                            background: 'var(--accent)',
                            color: 'var(--accent-text)',
                          }}
                        >
                          Now
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Route */}
        <div
          className="rounded-[var(--radius)] p-5"
          style={{ background: 'white', border: '1px solid var(--border)' }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            Route
          </p>
          <div className="flex gap-4">
            <div className="flex flex-col items-center pt-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: 'var(--text-primary)' }}
              />
              <div
                className="w-px flex-1 my-1.5"
                style={{ background: 'var(--border)' }}
              />
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: 'var(--accent)',
                  border: '2px solid var(--accent-dark)',
                }}
              />
            </div>
            <div className="flex flex-col justify-between gap-4 flex-1">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Pickup
                </p>
                <p className="text-sm font-medium">{d.pickup_address}</p>
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Delivery
                </p>
                <p className="text-sm font-medium">{d.delivery_address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent */}
        {d.riders && (
          <div
            className="rounded-[var(--radius)] p-5"
            style={{ background: 'white', border: '1px solid var(--border)' }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              Your Agent
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded flex items-center justify-center font-black text-base"
                style={{
                  background: 'var(--sidebar-bg)',
                  color: 'var(--accent)',
                }}
              >
                {d.riders.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold">{d.riders.name}</p>
                <p
                  className="text-sm mono"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {d.riders.phone}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {d.notes && (
          <div
            className="rounded-[var(--radius)] p-5"
            style={{ background: 'white', border: '1px solid var(--border)' }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: 'var(--text-muted)' }}
            >
              Notes
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {d.notes}
            </p>
          </div>
        )}

        <p
          className="text-center text-xs pb-4"
          style={{ color: 'var(--text-muted)' }}
        >
          Powered by <span className="font-bold">Tracker</span>
        </p>
      </div>
    </div>
  )
}