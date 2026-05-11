import CopyAgentLink from "@/components/riders/CopyAgentLink";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/utils";
import AddRiderModal from "@/components/riders/AddRiderModal";
import AgentActions from "@/components/riders/AgentActions";

const VEHICLE_LABEL: Record<string, string> = {
  bike: "Bike",
  car: "Car",
  van: "Van",
};

const VEHICLE_COLOR: Record<string, string> = {
  bike: "rgba(251,191,36,0.15)",
  car: "rgba(96,165,250,0.15)",
  van: "rgba(167,139,250,0.15)",
}

const VEHICLE_TEXT: Record<string, string> = {
  bike: "#fbbf24",
  car: "#60a5fa",
  van: "#a78bfa",
}

export default async function AgentsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: riders } = await supabase
    .from("riders")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: deliveryCounts } = await supabase
    .from("deliveries")
    .select("rider_id");

  const countMap: Record<string, number> = {};
  deliveryCounts?.forEach((d) => {
    if (d.rider_id) countMap[d.rider_id] = (countMap[d.rider_id] || 0) + 1;
  });

  const activeCount = riders?.filter((r) => r.is_active).length ?? 0
  const totalCount = riders?.length ?? 0

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-black">Agents</h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            {activeCount} active · {totalCount} total
          </p>
        </div>
        <AddRiderModal />
      </div>

      {!riders || riders.length === 0 ? (
        <div
          className="rounded-2xl py-20 text-center"
          style={{
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            No agents yet
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Add your first agent to start assigning deliveries
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {riders.map((rider) => (
            <div
              key={rider.id}
              className="relative overflow-hidden rounded-2xl"
              style={{
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Left color accent bar based on vehicle */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                style={{
                  background: VEHICLE_TEXT[rider.vehicle_type],
                  opacity: 0.6,
                }}
              />

              <div className="pl-6 pr-5 py-5">
                {/* Main row */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-2xl flex items-center justify-center font-black text-lg shrink-0"
                    style={{
                      background: VEHICLE_COLOR[rider.vehicle_type],
                      color: VEHICLE_TEXT[rider.vehicle_type],
                    }}
                  >
                    {rider.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className="font-bold text-base"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {rider.name}
                      </h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: VEHICLE_COLOR[rider.vehicle_type],
                          color: VEHICLE_TEXT[rider.vehicle_type],
                        }}
                      >
                        {VEHICLE_LABEL[rider.vehicle_type]}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={
                          rider.is_active
                            ? {
                                background: "rgba(34,197,94,0.1)",
                                color: "#22c55e",
                                border: "1px solid rgba(34,197,94,0.15)",
                              }
                            : {
                                background: "rgba(255,255,255,0.04)",
                                color: "var(--text-muted)",
                                border: "1px solid var(--border)",
                              }
                        }
                      >
                        {rider.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p
                      className="text-sm mono mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {rider.phone}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="text-right shrink-0">
                    <p
                      className="text-3xl font-black leading-none"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {countMap[rider.id] ?? 0}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      deliveries
                    </p>
                  </div>
                </div>

                {/* Bottom row */}
                <div
                  className="mt-4 pt-4 flex items-center justify-between gap-4 flex-wrap"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Since {formatDate(rider.created_at).split(",")[0]}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    {rider.unique_code && (
                      <CopyAgentLink code={rider.unique_code} />
                    )}
                    <AgentActions rider={rider} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}