import { Delivery, Rider } from '@/types'
import { STATUS_LABELS, STATUS_COLORS, formatDate } from '@/lib/utils'
import DeliveryActions from './DeliveryActions'
import Pagination from '@/components/ui/Pagination'

interface Props {
  deliveries: (Delivery & { riders?: Pick<Rider, 'name' | 'phone' | 'vehicle_type'> })[]
  riders: Rider[]
  loading: boolean
  filter: string
  page: number
  totalPages: number
  total: number
  perPage: number
  onNext: () => void
  onPrev: () => void
  onUpdate: (delivery: Delivery) => void
  onDelete: (id: string) => void
}

export default function DeliveryTable({
  deliveries,
  riders,
  loading,
  filter,
  page,
  totalPages,
  total,
  perPage,
  onNext,
  onPrev,
  onUpdate,
  onDelete,
}: Props) {
  return (
    <div className="glass-card overflow-hidden">
      {loading ? (
        <div className="py-20 text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading deliveries...
          </p>
        </div>
      ) : deliveries.length === 0 ? (
        <div className="py-20 text-center">
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            No deliveries found
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {filter === 'all'
              ? 'Create your first delivery to get started'
              : `No ${STATUS_LABELS[filter as keyof typeof STATUS_LABELS]} deliveries`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                {[
                  'Tracking ID',
                  'Customer',
                  'Route',
                  'Agent',
                  'Zone & Cost',
                  'Status',
                  'Created',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
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
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {d.tracking_id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p
                      className="font-medium whitespace-nowrap"
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
                  <td className="px-4 py-3 max-w-[180px]">
                    <p
                      className="text-xs truncate"
                      title={d.pickup_address}
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span style={{ color: 'var(--text-muted)' }}>
                        From:
                      </span>{' '}
                      {d.pickup_address}
                    </p>
                    <p
                      className="text-xs truncate"
                      title={d.delivery_address}
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span style={{ color: 'var(--text-muted)' }}>
                        To:
                      </span>{' '}
                      {d.delivery_address}
                    </p>
                  </td>
                  <td
                    className="px-4 py-3 whitespace-nowrap text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {d.riders?.name ?? (
                      <span style={{ color: 'var(--text-muted)' }}>
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {d.zone_name ? (
                      <div>
                        <p
                          className="text-xs font-medium"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {d.zone_name}
                        </p>
                        {d.cost && (
                          <p
                            className="text-xs mono"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            ₦{d.cost.toLocaleString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_COLORS[d.status]}`}>
                      {STATUS_LABELS[d.status]}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-xs whitespace-nowrap"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {formatDate(d.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <DeliveryActions
                      delivery={d}
                      riders={riders}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        perPage={perPage}
        onNext={onNext}
        onPrev={onPrev}
      />
    </div>
  )
}