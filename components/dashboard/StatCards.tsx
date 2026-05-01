interface Stat {
  label: string;
  value: number;
  sub: string;
  accent: boolean;
}

interface Props {
  stats: Stat[];
}

export default function StatCards({ stats }: Props) {
  return (
    <>
      {/* Mobile — circles */}
      <div className="grid grid-cols-2 gap-4 mb-8 lg:hidden">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center text-center aspect-square rounded-full transition-all duration-200"
            style={
              stat.accent
                ? {
                    borderColor: "rgba(240,162,2,0.4)",
                    border: "1px solid rgba(240,162,2,0.4)",
                    background: "rgba(240,162,2,0.08)",
                  }
                : {
                    border: "1px solid var(--card-border)",
                    background: "var(--card-bg)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }
            }
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider px-2"
              style={{ color: "var(--text-muted)" }}
            >
              {stat.label}
            </p>
            <p
              className="text-3xl font-black mb-1"
              style={{
                letterSpacing: "-0.03em",
                color: stat.accent ? "var(--accent)" : "var(--text-primary)",
              }}
            >
              {stat.value}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop — cards */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-3 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="stat-card"
            style={
              stat.accent
                ? {
                    borderColor: "rgba(240,162,2,0.3)",
                    background: "rgba(240,162,2,0.06)",
                  }
                : {}
            }
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              {stat.label}
            </p>
            <p
              className="text-4xl font-black mb-1"
              style={{
                letterSpacing: "-0.03em",
                color: stat.accent ? "var(--accent)" : "var(--text-primary)",
              }}
            >
              {stat.value}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
