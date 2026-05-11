import { Delivery, DeliveryStatus } from '@/types'
import { STATUS_LABELS, STATUS_COLORS, formatDate } from '@/lib/utils'
import { NEXT_STATUS, NEXT_LABEL } from '@/lib/useAgentPortal'

interface Props {
  delivery: Delivery
  updating: boolean
  onUpdate: (delivery: Delivery) => void
}

export default function AgentDeliveryCard({ delivery, updating, onUpdate }: Props) {
  const nextStatus = NEXT_STATUS[delivery.status]
  const isDelivered = delivery.status === 'delivered'

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: '#111111',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Top accent line based on status */}
      <div
        className="h-0.5 w-full"
        style={{
          background:
            delivery.status === 'pending'
              ? 'rgba(251,191,36,0.6)'
              : delivery.status === 'picked_up'
              ? 'rgba(96,165,250,0.6)'
              : delivery.status === 'in_transit'
              ? 'rgba(167,139,250,0.6)'
              : 'rgba(34,197,94,0.6)',
        }}
      />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span
            className="mono text-base font-black tracking-wider"
            style={{ color: '#ffffff' }}
          >
            {delivery.tracking_id}
          </span>
          <span className={`badge ${STATUS_COLORS[delivery.status]}`}>
            {STATUS_LABELS[delivery.status]}
          </span>
        </div>

        {/* Customer */}
        <div
          className="rounded-xl p-3"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Customer
          </p>
          <p
            className="text-sm font-semibold"
            style={{ color: '#ffffff' }}
          >
            {delivery.customer_name}
          </p>
          <p
            className="text-xs mono mt-0.5"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            {delivery.customer_phone}
          </p>
        </div>

        {/* Route */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center pt-1.5">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: 'rgba(255,255,255,0.6)' }}
            />
            <div
              className="w-px flex-1 my-1.5"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            />
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: '#ffffff' }}
            />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                Pickup
              </p>
              <p
                className="text-sm font-medium leading-snug"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                {delivery.pickup_address}
              </p>
            </div>
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                Deliver to
              </p>
              <p
                className="text-sm font-medium leading-snug"
                style={{ color: '#ffffff' }}
              >
                {delivery.delivery_address}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {delivery.notes && (
          <p
            className="text-xs px-3 py-2 rounded-xl leading-relaxed"
            style={{
              background: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {delivery.notes}
          </p>
        )}

        {/* Date */}
        <p
          className="text-xs"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          Assigned {formatDate(delivery.created_at)}
        </p>

        {/* Action */}
        {nextStatus && (
          <button
            onClick={() => onUpdate(delivery)}
            disabled={updating}
            className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200"
            style={{
              background: updating
                ? 'rgba(255,255,255,0.06)'
                : '#ffffff',
              color: updating ? 'rgba(255,255,255,0.3)' : '#09090B',
              cursor: updating ? 'not-allowed' : 'pointer',
            }}
          >
            {updating ? 'Updating...' : NEXT_LABEL[delivery.status]}
          </button>
        )}

        {isDelivered && (
          <div
            className="w-full py-3 rounded-xl text-sm font-bold text-center tracking-wide"
            style={{
              background: 'rgba(34,197,94,0.08)',
              color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.15)',
            }}
          >
            Delivered ✓
          </div>
        )}
      </div>
    </div>
  )
}