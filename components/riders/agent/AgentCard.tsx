import { Rider } from '@/types'

const VEHICLE_LABEL: Record<string, string> = {
  bike: 'Bike',
  car: 'Car',
  van: 'Van',
}

interface Props {
  rider: Rider
  deliveryCount: number
}

export default function AgentCard({ rider, deliveryCount }: Props) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
        style={{ background: '#ffffff', transform: 'translate(30%, -30%)' }}
      />

      <div className="relative flex items-center gap-4">
        {/* Avatar */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#ffffff',
          }}
        >
          {rider.name.charAt(0)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold tracking-tight truncate"
            style={{ color: '#ffffff' }}
          >
            {rider.name}
          </p>
          <p className="text-sm mono mt-0.5"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            {rider.phone}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div
        className="mt-5 pt-4 grid grid-cols-2 gap-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="rounded-xl p-3"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <p className="text-xs font-medium mb-1"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            Active Deliveries
          </p>
          <p className="text-2xl font-black"
            style={{ color: '#ffffff' }}
          >
            {deliveryCount}
          </p>
        </div>
        <div
          className="rounded-xl p-3"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <p className="text-xs font-medium mb-1"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            Vehicle
          </p>
          <p className="text-lg font-bold"
            style={{ color: '#ffffff' }}
          >
            {VEHICLE_LABEL[rider.vehicle_type]}
          </p>
        </div>
      </div>
    </div>
  )
}