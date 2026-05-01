interface Props {
  page: number
  totalPages: number
  total: number
  perPage: number
  onNext: () => void
  onPrev: () => void
}

export default function Pagination({
  page,
  totalPages,
  total,
  perPage,
  onNext,
  onPrev,
}: Props) {
  if (totalPages <= 1) return null

  const from = (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)

  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-t"
      style={{ borderColor: 'var(--border)' }}
    >
      <p
        className="text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        Showing {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="text-xs px-3 py-1.5 rounded border font-medium transition-colors"
          style={{
            borderColor: 'var(--border)',
            color: page === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
            background: 'white',
            opacity: page === 1 ? 0.5 : 1,
          }}
        >
          Previous
        </button>
        <span
          className="text-xs font-semibold px-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {page} / {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={page === totalPages}
          className="text-xs px-3 py-1.5 rounded border font-medium transition-colors"
          style={{
            borderColor: 'var(--border)',
            color: page === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
            background: 'white',
            opacity: page === totalPages ? 0.5 : 1,
          }}
        >
          Next
        </button>
      </div>
    </div>
  )
}