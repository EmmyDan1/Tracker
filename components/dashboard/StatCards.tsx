interface Stat {
  label: string
  value: number
  sub: string
  accent?: boolean
}

interface Props {
  stats: Stat[]
}

export default function StatCards({ stats }: Props) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-9">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="
            group
            relative
            overflow-hidden
            rounded-2xl
            border
            bg-[var(--card-bg)]
            p-5
            transition-all
            duration-300
            hover:-translate-y-[2px]
          "
          style={{
            borderColor: stat.accent
              ? 'var(--card-border)'
              : 'var(--card-border)',
          }}
        >
          {/* label */}
          <p
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.18em]
              mb-6
            "
            style={{ color: 'var(--text-muted)' }}
          >
            {stat.label}
          </p>

          {/* value + sub */}
          <div className="space-y-1">
            <p
              className="
                text-3xl lg:text-4xl
                font-semibold
                tracking-[-0.05em]
                leading-none
              "
              style={{
                color: stat.accent
                  ? 'var(--text-primary)'
                  : 'var(--text-primary)',
              }}
            >
              {stat.value}
            </p>

            <p
              className="text-xs leading-relaxed max-w-[18ch]"
              style={{ color: 'var(--text-muted)' }}
            >
              {stat.sub}
            </p>
          </div>

          {/* subtle hover feel only (no color shift) */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/[0.02] transition-opacity pointer-events-none" />
        </div>
      ))}
    </section>
  )
}