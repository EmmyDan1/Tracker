interface Stat {
  label: string
  value: number
  sub: string
  accent: boolean
}

interface Props {
  stats: Stat[]
}

export default function StatCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8 ">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="stat-card "
          style={
            stat.accent
              ? {
                  borderColor: 'rgba(240,162,2,0.3)',
                  background: 'rgba(240,162,2,0.06)',
                }
              : {}
          }
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--text-muted)' }}
          >
            {stat.label}
          </p>
          <p
            className="text-4xl font-black mb-1"
            style={{
              letterSpacing: '-0.03em',
              color: stat.accent ? 'var(--accent)' : 'var(--text-primary)',
            }}
          >
            {stat.value}
          </p>
          <p
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            {stat.sub}
          </p>
        </div>
      ))}
    </div>
  )
}