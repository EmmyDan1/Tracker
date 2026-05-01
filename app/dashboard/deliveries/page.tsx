"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Delivery, Rider, DeliveryStatus } from "@/types";
import { STATUS_LABELS, STATUS_COLORS, formatDate } from "@/lib/utils";
import DeliveryActions from "@/components/deliveries/DeliveryActions";
import CreateDeliveryModal from "@/components/deliveries/CreateDeliveryModal";
import Pagination from "@/components/ui/Pagination";

const FILTERS: { label: string; value: DeliveryStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Picked Up", value: "picked_up" },
  { label: "In Transit", value: "in_transit" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [filter, setFilter] = useState<DeliveryStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PER_PAGE = 2;

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const [{ data: deliveryData }, { data: riderData }] = await Promise.all([
        supabase
          .from("deliveries")
          .select("*, riders(name, phone, vehicle_type)")
          .order("created_at", { ascending: false }),
        supabase.from("riders").select("*").eq("is_active", true).order("name"),
      ]);

      setDeliveries(deliveryData ?? []);
      setRiders(riderData ?? []);
      setLoading(false);
      setPage(1);
    }

    load();
  }, []);

  const filtered = deliveries
    .filter((d) => filter === "all" || d.status === filter)
    .filter((d) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        d.customer_name.toLowerCase().includes(q) ||
        d.customer_phone.includes(q) ||
        d.tracking_id.toLowerCase().includes(q) ||
        d.pickup_address.toLowerCase().includes(q) ||
        d.delivery_address.toLowerCase().includes(q)
      );
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="pt-14 lg:pt-0">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-black">Deliveries</h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            {deliveries.length} total deliveries
          </p>
        </div>
        <CreateDeliveryModal
          riders={riders}
          onCreated={() => {
            setLoading(true);
            const supabase = createClient();
            supabase
              .from("deliveries")
              .select("*, riders(name, phone, vehicle_type)")
              .order("created_at", { ascending: false })
              .then(({ data }) => {
                setDeliveries(data ?? []);
                setLoading(false);
              });
          }}
        />
      </div>

      {/* Filter tabs */}
      <div className="mb-3">
        <input
          className="input-base max-w-sm"
          placeholder="Search by name, phone, tracking ID or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const count =
            f.value === "all"
              ? deliveries.length
              : deliveries.filter((d) => d.status === f.value).length;

          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="shrink-0 px-3 py-1.5 rounded text-xs font-semibold border transition-all"
              style={{
                background: filter === f.value ? "var(--sidebar-bg)" : "white",
                color:
                  filter === f.value
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                borderColor:
                  filter === f.value ? "var(--sidebar-bg)" : "var(--border)",
              }}
            >
              {f.label}
              <span
                className="ml-1.5 px-1.5 py-0.5 rounded text-xs"
                style={{
                  background:
                    filter === f.value
                      ? "var(--sidebar-active-bg)"
                      : "var(--bg)",
                  color:
                    filter === f.value ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div
        className="glass-card overflow-hidden"
       
      >
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Loading deliveries...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm font-semibold mb-1">No deliveries found</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {filter === "all"
                ? "Create your first delivery to get started"
                : `No ${STATUS_LABELS[filter as DeliveryStatus]} deliveries`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: "var(--bg)",
                  }}
                >
                  {[
                    "Tracking ID",
                    "Customer",
                    "Route",
                    "Agent",
                    "Status",
                    "Created",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(
                  (
                    d: Delivery & {
                      riders?: Pick<Rider, "name" | "phone" | "vehicle_type">;
                    },
                  ) => (
                    <tr key={d.id} className="table-row">
                      <td className="px-4 py-3">
                        <span className="mono text-xs font-semibold">
                          {d.tracking_id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium whitespace-nowrap">
                          {d.customer_name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {d.customer_phone}
                        </p>
                      </td>
                      <td className="px-4 py-3 max-w-[180px]">
                        <p
                          className="text-xs truncate"
                          title={d.pickup_address}
                        >
                          <span className="font-medium">From:</span>{" "}
                          {d.pickup_address}
                        </p>
                        <p
                          className="text-xs truncate"
                          title={d.delivery_address}
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <span className="font-medium">To:</span>{" "}
                          {d.delivery_address}
                        </p>
                      </td>
                      <td
                        className="px-4 py-3 whitespace-nowrap"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {d.riders?.name ?? (
                          <span style={{ color: "var(--text-muted)" }}>
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${STATUS_COLORS[d.status]}`}>
                          {STATUS_LABELS[d.status]}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 text-xs whitespace-nowrap"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {formatDate(d.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <DeliveryActions
                          delivery={d}
                          riders={riders}
                          onUpdate={(updatedDelivery) => {
                            setDeliveries((prev) =>
                              prev.map((item) =>
                                item.id === updatedDelivery.id
                                  ? updatedDelivery
                                  : item,
                              ),
                            );
                          }}
                          onDelete={(id) => {
                            setDeliveries((prev) =>
                              prev.filter((item) => item.id !== id),
                            );
                          }}
                        />
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filtered.length}
          perPage={PER_PAGE}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
        />
      </div>
    </div>
  );
}
