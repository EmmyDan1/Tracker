import Link from 'next/link'
import { Delivery } from '@/types'
import { STATUS_LABELS, STATUS_COLORS, formatDate } from '@/lib/utils'

interface Props {
  deliveries: (Delivery & { riders?: { name: string } })[]
}

export default function RecentDeliveries({ deliveries }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold">
          Recent Deliveries{' '}
          <span
            className="text-xs font-normal"
            style={{ color: 'var(--text-muted)' }}
          >
            — last 8
          </span>
        </h2>
        <Link
          href="/dashboard/deliveries"
          className="text-xs font-medium transition-colors"
          style={{ color: 'var(--accent)' }}
        >
          View all →
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        {deliveries.length === 0 ? (
          <div className="py- text-center">
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              No deliveries yet
            </p>
            <p
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              Create your first delivery to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xl">
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: 'rgba(255,255,255,0.02)',
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
                {deliveries.map((d) => (
                  <tr key={d.id} className="table-row">
                    <td className="px-4 py-3">
                      <span
                        className="mono text-xs font-semibold"
                        style={{ color: 'var(--accent)' }}
                      >
                        {d.tracking_id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className="font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {d.customer_name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {d.customer_phone}
                      </p>
                    </td>
                    <td
                      className="px-4 py-3 text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {d.riders?.name ?? (
                        <span style={{ color: 'var(--text-muted)' }}>
                          Unassigned
                        </span>
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
  )
}