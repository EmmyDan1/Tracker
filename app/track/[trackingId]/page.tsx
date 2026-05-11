"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { Delivery } from "@/types";
import { STATUS_LABELS, STATUS_ORDER, formatDate } from "@/lib/utils";
import { use } from "react";

function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export default function TrackingPage({
  params,
}: {
  params: Promise<{ trackingId: string }>;
}) {
  const { trackingId } = use(params);
  const [delivery, setDelivery] = useState<
    | (Delivery & {
        riders?: { name: string; phone: string };
        companies?: { name: string };
      })
    | null
  >(null);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    const supabase = createPublicClient();

    async function fetchDelivery() {
      const { data } = await supabase
        .from("deliveries")
        .select("*, riders(name, phone), companies(name)")
        .eq("tracking_id", trackingId.toUpperCase())
        .single();
      console.log("Polling fetch result:", data?.status);
      if (!data) {
        setNotFoundState(true);
        return;
      }
      setDelivery(data);
    }

    // Initial fetch
    fetchDelivery();

    // Poll every 5 seconds
    const interval = setInterval(fetchDelivery, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [trackingId]);

  if (notFoundState) notFound();
  if (!delivery) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    );
  }

  const d = delivery as Delivery & {
    riders?: { name: string; phone: string };
    companies?: { name: string };
  };
  console.log(d);
  const currentStep = STATUS_ORDER.indexOf(d.status);
  const isCancelled = d.status === "cancelled";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div
        className="border-b"
        style={{
          background: "#060606",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <span
            className="text-sm font-black tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Shippa
          </span>
          {d.companies?.name && (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {d.companies.name}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {/* Tracking ID */}
        <div
          className="rounded-xl p-5"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Tracking ID
          </p>
          <p className="mono font-black text-2xl tracking-widest">
            {d.tracking_id}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Created {formatDate(d.created_at)}
          </p>
        </div>
        {/* Cost Summary */}
        {d.cost != null && (
          <div
            className="rounded-xl p-5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              Total Cost
            </p>
            <p
              className="text-2xl font-black"
              style={{ color: "var(--text-primary)" }}
            >
              ₦{d.cost.toLocaleString()}
            </p>
          </div>
        )}

        {/* Current status */}
        <div
          className="rounded-xl p-5"
          style={{
            background: isCancelled
              ? "rgba(230,57,70,0.08)"
              : "rgba(255,255,255,0.06)",
            border: `1px solid ${
              isCancelled ? "rgba(230,57,70,0.2)" : "var(--border-strong)"
            }`,
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: "var(--text-muted)" }}
          >
            Current Status
          </p>
          <p
            className="text-2xl font-black"
            style={{
              color: isCancelled ? "#E63946" : "var(--text-primary)",
            }}
          >
            {STATUS_LABELS[d.status]}
          </p>
        </div>

        {/* Progress stepper */}
        {!isCancelled && (
          <div
            className="rounded-xl p-5"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-5"
              style={{ color: "var(--text-muted)" }}
            >
              Progress
            </p>
            <div className="space-y-4">
              {STATUS_ORDER.map((step, idx) => {
                const done = idx <= currentStep;
                const current = idx === currentStep;
                return (
                  <div key={step} className="flex items-center gap-4">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black transition-all"
                      style={{
                        background: done
                          ? "var(--text-primary)"
                          : "transparent",
                        color: done
                          ? "var(--accent-text)"
                          : "var(--text-muted)",
                        border: done
                          ? "none"
                          : "1.5px solid var(--border-strong)",
                      }}
                    >
                      {done && !current ? "✓" : idx + 1}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color: done
                            ? "var(--text-primary)"
                            : "var(--text-muted)",
                        }}
                      >
                        {STATUS_LABELS[step]}
                      </p>
                      {current && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: "var(--text-primary)",
                            color: "var(--accent-text)",
                          }}
                        >
                          Now
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Route */}
        <div
          className="rounded-xl p-5"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Route
          </p>
          <div className="flex gap-4">
            <div className="flex flex-col items-center pt-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "var(--text-primary)" }}
              />
              <div
                className="w-px flex-1 my-1.5"
                style={{ background: "var(--border)" }}
              />
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "var(--text-primary)" }}
              />
            </div>
            <div className="flex flex-col justify-between gap-4 flex-1">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Pickup
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {d.pickup_address}
                </p>
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Delivery
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {d.delivery_address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent */}
        {d.riders && (
          <div
            className="rounded-xl p-5"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Your Agent
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "var(--text-primary)",
                }}
              >
                {d.riders.name.charAt(0)}
              </div>
              <div>
                <p
                  className="font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {d.riders.name}
                </p>
                <p
                  className="text-sm mono"
                  style={{ color: "var(--text-muted)" }}
                >
                  {d.riders.phone}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {d.notes && (
          <div
            className="rounded-xl p-5"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              Notes
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {d.notes}
            </p>
          </div>
        )}

        <p
          className="text-center text-xs pb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Powered by <span className="font-bold">Shippa</span>
        </p>
      </div>
    </div>
  );
}
