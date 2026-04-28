import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DeliveryStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a unique tracking ID
 * Format: TRK-XXXXX
 * Example: TRK-48K2M
 */
export function generateTrackingId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const random = Array.from({ length: 5 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  return `IBD-${random}`
}

export const STATUS_LABELS: Record<DeliveryStatus, string> = {
  pending: 'Pending',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const STATUS_COLORS: Record<DeliveryStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  picked_up: 'bg-blue-100 text-blue-800 border-blue-200',
  in_transit: 'bg-violet-100 text-violet-800 border-violet-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

export const STATUS_ORDER: DeliveryStatus[] = [
  'pending',
  'picked_up',
  'in_transit',
  'delivered',
]

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}