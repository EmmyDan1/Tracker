"use client";

import { useState, useTransition } from "react";

import { createClient } from "@/lib/supabase";
import { Rider } from "@/types";
import { generateTrackingId } from "@/lib/utils";

interface Props {
  riders: Rider[];
  onCreated?: () => void;
}

export default function CreateDeliveryModal({ riders, onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [createdTrackingId, setCreatedTrackingId] = useState<string | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    pickup_address: "",
    delivery_address: "",
    rider_id: "",
    notes: "",
  });

  function update(key: string, val: string) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("email", user.email!)
      .single();

    if (!company) {
      setError("Company not found. Please contact support.");
      return;
    }

    // Generate unique tracking ID
    let tracking_id = generateTrackingId();
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from("deliveries")
        .select("id")
        .eq("tracking_id", tracking_id)
        .single();
      if (!existing) break;
      tracking_id = generateTrackingId();
      attempts++;
    }

    const { error: insertError } = await supabase.from("deliveries").insert({
      tracking_id,
      company_id: company.id,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      pickup_address: form.pickup_address,
      delivery_address: form.delivery_address,
      rider_id: form.rider_id || null,
      notes: form.notes || null,
      status: "pending",
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setCreatedTrackingId(tracking_id);
    if (onCreated) onCreated();
  }

  function copyLink() {
    const url = `${window.location.origin}/track/${createdTrackingId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function closeAndReset() {
    setOpen(false);
    setCreatedTrackingId(null);
    setError("");
    setCopied(false);
    setForm({
      customer_name: "",
      customer_phone: "",
      pickup_address: "",
      delivery_address: "",
      rider_id: "",
      notes: "",
    });
  }

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        New Delivery
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.80)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={(e) => e.target === e.currentTarget && closeAndReset()}
        >
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto"
            style={{
              background: "#0D0D0D",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <h2 className="text-base font-bold">New Delivery</h2>
              <button
                onClick={closeAndReset}
                className="text-xl leading-none"
                style={{ color: "var(--text-muted)" }}
              >
                ×
              </button>
            </div>

            {createdTrackingId ? (
              /* Success state */
              <div className="p-5 space-y-4">
                <div>
                  <p className="font-black text-lg mb-1">Delivery Created</p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Share this tracking link with your customer
                  </p>
                </div>

                <div
                  className="rounded-[var(--radius)] p-4 text-center"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Tracking ID
                  </p>
                  <p className="mono font-black text-2xl tracking-widest">
                    {createdTrackingId}
                  </p>
                </div>

                <div
                  className="flex items-center gap-2 p-2 rounded-[var(--radius)]"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span
                    className="flex-1 truncate text-left mono text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {typeof window !== "undefined"
                      ? window.location.origin
                      : ""}
                    /track/{createdTrackingId}
                  </span>
                  <button
                    onClick={copyLink}
                    className="btn-primary shrink-0 py-1 px-3 text-xs"
                  >
                    {copied ? "Copied" : "Copy Link"}
                  </button>
                </div>

                <button
                  onClick={closeAndReset}
                  className="btn-secondary w-full justify-center"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Customer Name
                    </label>
                    <input
                      className="input-base"
                      placeholder="Funmi Adeyemi"
                      value={form.customer_name}
                      onChange={(e) => update("customer_name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Customer Phone
                    </label>
                    <input
                      className="input-base"
                      placeholder="0801 234 5678"
                      value={form.customer_phone}
                      onChange={(e) => update("customer_phone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Pickup Address
                  </label>
                  <input
                    className="input-base"
                    placeholder="12 Ring Road, Challenge, Ibadan"
                    value={form.pickup_address}
                    onChange={(e) => update("pickup_address", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Delivery Address
                  </label>
                  <input
                    className="input-base"
                    placeholder="45 Bodija Market Road, Ibadan"
                    value={form.delivery_address}
                    onChange={(e) => update("delivery_address", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Assign Agent
                  </label>
                  <select
                    className="input-base"
                    value={form.rider_id}
                    onChange={(e) => update("rider_id", e.target.value)}
                  >
                    <option value="">Select an agent (optional)</option>
                    {riders.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — {r.vehicle_type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Notes
                  </label>
                  <textarea
                    className="input-base resize-none"
                    rows={2}
                    placeholder="Fragile, call before delivery, etc."
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded border border-red-100">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={closeAndReset}
                    className="btn-secondary flex-1 justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 justify-center"
                    disabled={isPending}
                  >
                    {isPending ? "Creating..." : "Create Delivery"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
