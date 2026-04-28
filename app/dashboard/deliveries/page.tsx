import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Delivery, Rider } from '@/types'
import { STATUS_LABELS, STATUS_COLORS, formatDate } from '@/lib/utils'
import DeliveryActions from '@/components/deliveries/DeliveryActions'
import CreateDeliveryModal from '@/components/deliveries/CreateDeliveryModal'

export default async function DeliveriesPage() {
  const supabase = await createServerSupabaseClient()

  const [{ data: deliveries }, { data: riders }] = await Promise.all([
    supabase
      .from('deliveries')
      .select('*, riders(name, phone, vehicle_type)')
      .order('created_at', { ascending: false }),
    supabase
      .from('riders')
      .select('*')
      .eq('is_active', true)
      .order('name'),
  ])

  return (
    <div className="pt-14 lg:pt-0">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-black">Deliveries</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {deliveries?.length ?? 0} total deliveries
          </p>
        </div>
        <CreateDeliveryModal riders={riders ?? []} />
      </div>

      <div
        className="bg-white rounded-[var(--radius)] border overflow-hidden"
        style={{ borderColor: 'var(--border)' }}
      >
        {!deliveries || deliveries.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm font-semibold mb-1">No deliveries yet</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Click &quot;New Delivery&quot; to create your first one
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
                  {[
                    'Tracking ID',
                    'Customer',
                    'Route',
                    'Agent',
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
                {deliveries.map(
                  (d: Delivery & { riders?: Pick<Rider, 'name' | 'phone' | 'vehicle_type'> }) => (
                    <tr key={d.id} className="table-row">
                      <td className="px-4 py-3">
                        <span className="mono text-xs font-semibold">
                          {d.tracking_id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium whitespace-nowrap">
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
                        <p className="text-xs truncate" title={d.pickup_address}>
                          <span className="font-medium">From:</span>{' '}
                          {d.pickup_address}
                        </p>
                        <p
                          className="text-xs truncate"
                          title={d.delivery_address}
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          <span className="font-medium">To:</span>{' '}
                          {d.delivery_address}
                        </p>
                      </td>
                      <td
                        className="px-4 py-3 whitespace-nowrap"
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
                        className="px-4 py-3 text-xs whitespace-nowrap"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {formatDate(d.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <DeliveryActions
                          delivery={d}
                          riders={riders ?? []}
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}