interface Props {
  trackingId: string
  copied: boolean
  onCopy: () => void
  onClose: () => void
}

export default function DeliverySuccess({
  trackingId,
  copied,
  onCopy,
  onClose,
}: Props) {
  return (
    <div className="p-5 space-y-4">
      <div
        className="rounded-xl p-4 text-center"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
        }}
      >
        <p
          className="font-bold text-lg mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          Delivery Created
        </p>
        <p
          className="text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          Share the tracking link with your customer
        </p>
      </div>

      <div
        className="rounded-xl p-4 text-center"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          Tracking ID
        </p>
        <p
          className="mono font-black text-2xl tracking-widest"
          style={{ color: 'var(--text-primary)' }}
        >
          {trackingId}
        </p>
      </div>

      <div
        className="flex items-center gap-2 p-3 rounded-xl"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
        }}
      >
        <span
          className="flex-1 truncate text-xs mono"
          style={{ color: 'var(--text-muted)' }}
        >
          {typeof window !== 'undefined' ? window.location.origin : ''}/track/{trackingId}
        </span>
        <button
          onClick={onCopy}
          className="btn-primary shrink-0 py-1 px-3 text-xs"
        >
          {copied ? 'Copied' : 'Copy Link'}
        </button>
      </div>

      <button
        onClick={onClose}
        className="btn-secondary w-full justify-center"
      >
        Done
      </button>
    </div>
  )
}