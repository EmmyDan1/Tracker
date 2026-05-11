import { DeliveryStatus } from '@/types'
import { STATUS_LABELS } from '@/lib/utils'

const FILTERS: { label: string; value: DeliveryStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Picked Up', value: 'picked_up' },
  { label: 'In Transit', value: 'in_transit' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
]

interface Props {
  filter: DeliveryStatus | 'all'
  search: string
  deliveryCount: number
  counts: Record<string, number>
  onFilterChange: (val: DeliveryStatus | 'all') => void
  onSearchChange: (val: string) => void
}

export default function DeliveryFilters({
  filter,
  search,
  deliveryCount,
  counts,
  onFilterChange,
  onSearchChange,
}: Props) {
  return (
    <div className="space-y-3 mb-4">
      {/* Search */}
      <input
        className="input-base max-w-sm"
        placeholder="Search by name, phone, tracking ID..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const count =
            f.value === 'all'
              ? deliveryCount
              : counts[f.value] ?? 0

          return (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background:
                  filter === f.value
                    ? 'var(--text-primary)'
                    : 'rgba(255,255,255,0.05)',
                color:
                  filter === f.value
                    ? 'var(--accent-text)'
                    : 'var(--text-secondary)',
                border:
                  filter === f.value
                    ? 'none'
                    : '1px solid var(--border)',
              }}
            >
              {f.label}{' '}
              <span style={{ opacity: 0.7 }}>{count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}