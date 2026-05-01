'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase'
import { Delivery, DeliveryStatus, Rider } from '@/types'
import EditDeliveryModal from './EditDeliveryModal'
import DeleteDeliveryConfirm from './DeleteDeliveryConfirm'

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
  onUpdate: (updated: Delivery) => void
  onDelete: (id: string) => void
}

export default function DeliveryActions({ delivery, riders, onUpdate, onDelete }: Props) {
  const [isPending, startTransition] = useTransition()
  const [copied, setCopied] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const supabase = createClient()

  const nextStatus = NEXT_STATUS[delivery.status]

  async function advanceStatus() {
    if (!nextStatus) return
    const { data } = await supabase
      .from('deliveries')
      .update({ status: nextStatus })
      .eq('id', delivery.id)
      .select('*, riders(name, phone, vehicle_type)')
      .single()
    if (data) startTransition(() => onUpdate(data))
  }

  function copyLink() {
    const url = `${window.location.origin}/track/${delivery.tracking_id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {nextStatus && (
          <button
            onClick={advanceStatus}
            disabled={isPending}
            className="text-xs px-2.5 py-1 rounded border font-medium transition-colors whitespace-nowrap"
            style={{
              borderColor: 'var(--border-strong)',
              color: 'var(--text-primary)',
              background: '',
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
            background: copied ? '#FAFFF0' : '',
          }}
        >
          {copied ? 'Copied' : 'Copy Link'}
        </button>
        <button
          onClick={() => setEditOpen(true)}
          className="text-xs px-2.5 py-1 rounded border font-medium transition-colors whitespace-nowrap"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
            background: '',
          }}
        >
          Edit
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          className="text-xs px-2.5 py-1 rounded border font-medium transition-colors whitespace-nowrap"
          style={{
            borderColor: '#fcc',
            color: '#c0392b',
            background: '#fff5f5',
          }}
        >
          Delete
        </button>
      </div>

      {editOpen && (
        <EditDeliveryModal
          delivery={delivery}
          riders={riders}
          onUpdate={onUpdate}
          onClose={() => setEditOpen(false)}
        />
      )}

      {deleteOpen && (
        <DeleteDeliveryConfirm
          delivery={delivery}
          onDelete={onDelete}
          onClose={() => setDeleteOpen(false)}
        />
      )}
    </>
  )
}