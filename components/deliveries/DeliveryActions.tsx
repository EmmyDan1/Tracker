'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Delivery, DeliveryStatus, Rider } from '@/types'

const NEXT_STATUS: Record<DeliveryStatus, DeliveryStatus | null> = {
  pending: 'picked_up',
  picked_up: 'in_transit',
  in_transit: 'delivered',
  delivered: null,
  cancelled: null,
}

const NEXT_LABEL: Record<DeliveryStatus, string> = {
  pending: 'Mark Picked Up',
  picked_up: 'Mark In Transit',
  in_transit: 'Mark Delivered',
  delivered: '',
  cancelled: '',
}

interface Props {
  delivery: Delivery
  riders: Rider[]
}

export default function DeliveryActions({ delivery }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  const nextStatus = NEXT_STATUS[delivery.status]

  async function advanceStatus() {
    if (!nextStatus) return
    await supabase
      .from('deliveries')
      .update({ status: nextStatus })
      .eq('id', delivery.id)

    startTransition(() => router.refresh())
  }

  function copyLink() {
    const url = `${window.location.origin}/track/${delivery.tracking_id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      {nextStatus && (
        <button
          onClick={advanceStatus}
          disabled={isPending}
          className="text-xs px-2.5 py-1 rounded border font-medium transition-colors whitespace-nowrap"
          style={{
            borderColor: 'var(--border-strong)',
            color: 'var(--text-primary)',
            background: 'white',
          }}
        >
          {isPending ? '...' : NEXT_LABEL[delivery.status]}
        </button>
      )}
      <button
        onClick={copyLink}
        className="text-xs px-2.5 py-1 rounded border font-medium transition-colors whitespace-nowrap"
        style={{
          borderColor: copied ? 'var(--accent-dark)' : 'var(--border)',
          color: copied ? '#5a7a00' : 'var(--text-muted)',
          background: copied ? '#FAFFF0' : 'white',
        }}
      >
        {copied ? 'Copied' : 'Copy Link'}
      </button>
    </div>
  )
}