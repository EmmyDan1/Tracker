'use client'

import { useZoneManager } from '@/lib/useZoneManager'
import { DeliveryZone } from '@/types'

interface Props {
  companyId: string
  initialZones: DeliveryZone[]
}

export default function ZoneManager({ companyId, initialZones }: Props) {
  const {
    zones,
    name,
    setName,
    price,
    setPrice,
    adding,
    handleAdd,
    handleDelete,
    handlePriceUpdate,
  } = useZoneManager(companyId, initialZones)

  return (
    <div className="glass-card p-6 mt-4">
      <h2
        className="text-base font-bold mb-1"
        style={{ color: 'var(--text-primary)' }}
      >
        Delivery Zones
      </h2>
      <p
        className="text-sm mb-6"
        style={{ color: 'var(--text-muted)' }}
      >
        Set your delivery zones and prices. Agents and customers will see these.
      </p>

      {/* Existing zones */}
      {zones.length > 0 && (
        <div className="space-y-2 mb-6">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
              }}
            >
              <p
                className="flex-1 text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {zone.name}
              </p>
              <div className="flex items-center gap-1">
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  ₦
                </span>
                <input
                  type="number"
                  className="w-24 px-2 py-1 text-sm rounded-lg outline-none text-right"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  defaultValue={zone.price}
                  onBlur={(e) =>
                    handlePriceUpdate(zone.id, parseInt(e.target.value))
                  }
                />
              </div>
              <button
                onClick={() => handleDelete(zone.id)}
                className="text-xs px-2 py-1 rounded-lg transition-colors"
                style={{
                  color: '#f87171',
                  background: 'rgba(239,68,68,0.06)',
                  border: '1px solid rgba(239,68,68,0.15)',
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new zone */}
      <form onSubmit={handleAdd} className="space-y-3">
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          Add New Zone
        </p>
        <div className="flex gap-2 flex-wrap">
          <input
            className="input-base flex-1"
            placeholder="e.g. Across Town"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="flex items-center gap-1 shrink-0">
            <span
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              ₦
            </span>
            <input
              type="number"
              className="input-base w-28"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min={0}
            />
          </div>
          <button
            type="submit"
            className="btn-primary shrink-0"
            disabled={adding}
          >
            {adding ? 'Adding...' : 'Add Zone'}
          </button>
        </div>
      </form>
    </div>
  )
}