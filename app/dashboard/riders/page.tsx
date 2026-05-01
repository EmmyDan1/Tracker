import AgentActions from "@/components/riders/AgentActions";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/utils";
import AddRiderModal from "@/components/riders/AddRiderModal";

const VEHICLE_LABEL: Record<string, string> = {
  bike: "Bike",
  car: "Car",
  van: "Van",
};

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

  return (
    <div className="pt-14 lg:pt-0">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-black">Agents</h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            {riders?.filter((r) => r.is_active).length ?? 0} active agents
          </p>
        </div>
        <AddRiderModal />
      </div>

      {!riders || riders.length === 0 ? (
        <div
          className="bg-white rounded-[var(--radius)] border py-20 text-center"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-sm font-semibold mb-1">No agents yet</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Add your first agent to start assigning deliveries
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {riders.map((rider) => (
            <div
              key={rider.id}
              className="glass-card p-5"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded flex items-center justify-center font-black text-base"
                  style={{
                    background: "var(--sidebar-bg)",
                    color: "var(--accent)",
                  }}
                >
                  {rider.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded border font-semibold"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text-secondary)",
                      background: "var(--bg)",
                    }}
                  >
                    {VEHICLE_LABEL[rider.vehicle_type]}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded border font-semibold"
                    style={
                      rider.is_active
                        ? {
                            background: "#EFFFEC",
                            color: "#2a7a2a",
                            borderColor: "#c8e6c8",
                          }
                        : {
                            background: "#f5f5f5",
                            color: "#888",
                            borderColor: "#ddd",
                          }
                    }
                  >
                    {rider.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Info */}
              <h3 className="font-bold text-base mb-0.5">{rider.name}</h3>
              <p
                className="text-sm mono"
                style={{ color: "var(--text-secondary)" }}
              >
                {rider.phone}
              </p>

              {/* Footer */}
              <div
                className="mt-4 pt-4 border-t flex items-center justify-between"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Deliveries
                  </p>
                  <p className="text-xl font-black">
                    {countMap[rider.id] ?? 0}
                  </p>
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Since {formatDate(rider.created_at).split(",")[0]}
                </p>
              </div>
              <AgentActions rider={rider} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
