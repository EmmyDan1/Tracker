import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Delivery } from '@/types'
import { STATUS_LABELS, STATUS_COLORS, formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const [
    { count: totalCount },
    { count: pendingCount },
    { count: inTransitCount },
    { count: deliveredCount },
    { data: recentDeliveries },
  ] = await Promise.all([
    supabase.from('deliveries').select('*', { count: 'exact', head: true }),
    supabase.from('deliveries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('deliveries').select('*', { count: 'exact', head: true }).in('status', ['picked_up', 'in_transit']),
    supabase.from('deliveries').select('*', { count: 'exact', head: true }).eq('status', 'delivered'),
    supabase.from('deliveries').select('*, riders(name)').order('created_at', { ascending: false }).limit(8),
  ])

  const STATS = [
    { label: 'Total', value: totalCount ?? 0, sub: 'All deliveries' },
    { label: 'Pending', value: pendingCount ?? 0, sub: 'Awaiting pickup' },
    { label: 'In Transit', value: inTransitCount ?? 0, sub: 'On the road', accent: true },
    { label: 'Delivered', value: deliveredCount ?? 0, sub: 'Completed' },
  ]

  return (
    <div className="pt-14 lg:pt-0">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-black">Overview</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Today&apos;s operations at a glance
          </p>
        </div>
        <Link href="/dashboard/deliveries" className="btn-primary">
          New Delivery
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="stat-card"
            style={
              stat.accent
                ? { borderColor: 'var(--accent)', background: '#FAFFF0' }
                : {}
            }
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {stat.label}
            </p>
            <p className="text-3xl font-black" style={{ letterSpacing: '-0.03em' }}>
              {stat.value}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Recent deliveries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">Recent Deliveries</h2>
          <Link
            href="/dashboard/deliveries"
            className="text-xs font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            View all →
          </Link>
        </div>

        <div
          className="bg-white rounded-[var(--radius)] border overflow-hidden"
          style={{ borderColor: 'var(--border)' }}
        >
          {!recentDeliveries || recentDeliveries.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm font-semibold mb-1">No deliveries yet</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Create your first delivery to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid var(--border)',
                      background: 'var(--bg)',
                    }}
                  >
                    {['Tracking ID', 'Customer', 'Agent', 'Status', 'Date'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentDeliveries.map((d: Delivery & { riders?: { name: string } }) => (
                    <tr key={d.id} className="table-row">
                      <td className="px-4 py-3">
                        <span className="mono text-xs font-semibold">
                          {d.tracking_id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{d.customer_name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {d.customer_phone}
                        </p>
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                        {d.riders?.name ?? (
                          <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${STATUS_COLORS[d.status]}`}>
                          {STATUS_LABELS[d.status]}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {formatDate(d.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}