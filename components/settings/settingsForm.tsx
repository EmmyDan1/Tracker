'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Company } from '@/types'

interface Props {
  company: Company
}

export default function SettingsForm({ company }: Props) {
  const [ratePerKm, setRatePerKm] = useState(company.rate_per_km ?? 600)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from('companies')
      .update({ rate_per_km: ratePerKm })
      .eq('id', company.id)

    setSaving(false)

    if (error) {
      toast.error('Failed to save settings')
      return
    }

    toast.success('Settings saved')
  }

  return (
    <div className="max-w-md">
      <div
        className="glass-card p-6"
      >
        <h2
          className="text-base font-bold mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          Delivery Pricing
        </h2>
        <p
          className="text-sm mb-6"
          style={{ color: 'var(--text-muted)' }}
        >
          Set your rate per kilometer. This is used to automatically
          calculate delivery costs.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Rate per KM (₦)
            </label>
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-semibold px-3 py-2 rounded-[var(--radius)]"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                }}
              >
                ₦
              </span>
              <input
                type="number"
                className="input-base"
                value={ratePerKm}
                onChange={(e) => setRatePerKm(Number(e.target.value))}
                min={0}
                required
              />
            </div>
            <p
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              Example: 5km delivery at ₦{ratePerKm}/km = ₦{(ratePerKm * 5).toLocaleString()}
            </p>
          </div>

          <div
            className="rounded-[var(--radius)] p-3"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
            }}
          >
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              Company Info
            </p>
            <div className="space-y-1">
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {company.name}
              </p>
              <p
                className="text-xs mono"
                style={{ color: 'var(--text-muted)' }}
              >
                {company.email}
              </p>
              <p
                className="text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                {company.city}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full justify-center"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  )
}