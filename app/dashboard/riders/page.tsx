import { createServerSupabaseClient } from '@/lib/supabase-server'
import { formatDate } from '@/lib/utils'
import AddRiderModal from '@/components/riders/AddRiderModal'
import AgentActions from '@/components/riders/AgentActions'

const VEHICLE_LABEL: Record<string, string> = {
  bike: 'Bike',
  car: 'Car',
  van: 'Van',
}

export default async function AgentsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: riders } = await supabase
    .from('riders')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: deliveryCounts } = await supabase
    .from('deliveries')
    .select('rider_id')

  const countMap: Record<string, number> = {}
  deliveryCounts?.forEach((d) => {
    if (d.rider_id) countMap[d.rider_id] = (countMap[d.rider_id] || 0) + 1
  })

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-black">Agents</h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: 'var(--text-secondary)' }}
          >
            {riders?.filter((r) => r.is_active).length ?? 0} active agents
          </p>
        </div>
        <AddRiderModal />
      </div>

      {!riders || riders.length === 0 ? (
        <div className="glass-card py-20 text-center">
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            No agents yet
          </p>
          <p
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            Add your first agent to start assigning deliveries
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {riders.map((rider) => (
            <div
              key={rider.id}
              className="glass-card p-5"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base"
                  style={{
                    background: 'rgba(240,162,2,0.15)',
                    color: 'var(--accent)',
                  }}
                >
                  {rider.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {VEHICLE_LABEL[rider.vehicle_type]}
                  </span>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={
                      rider.is_active
                        ? {
                            background: 'rgba(34,197,94,0.1)',
                            color: '#22c55e',
                            border: '1px solid rgba(34,197,94,0.2)',
                          }
                        : {
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border)',
                          }
                    }
                  >
                    {rider.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Info */}
              <h3
                className="font-bold text-base mb-0.5"
                style={{ color: 'var(--text-primary)' }}
              >
                {rider.name}
              </h3>
              <p
                className="text-sm mono"
                style={{ color: 'var(--text-secondary)' }}
              >
                {rider.phone}
              </p>

              {/* Footer */}
              <div
                className="mt-4 pt-4 border-t flex items-center justify-between"
                style={{ borderColor: 'var(--border)' }}
              >
                <div>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Deliveries
                  </p>
                  <p
                    className="text-2xl font-black"
                    style={{ color: 'var(--accent)' }}
                  >
                    {countMap[rider.id] ?? 0}
                  </p>
                </div>
                <p
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Since {formatDate(rider.created_at).split(',')[0]}
                </p>
              </div>

              <AgentActions rider={rider} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}