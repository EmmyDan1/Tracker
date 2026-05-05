"use client";
import { toast } from "sonner";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Delivery, Rider } from "@/types";

interface Props {
  delivery: Delivery;
  riders: Rider[];
  onUpdate: (updated: Delivery) => void;
  onClose: () => void;
}

export default function EditDeliveryModal({
  delivery,
  riders,
  onUpdate,
  onClose,
}: Props) {
  const [form, setForm] = useState({
    customer_name: delivery.customer_name,
    customer_phone: delivery.customer_phone,
    pickup_address: delivery.pickup_address,
    delivery_address: delivery.delivery_address,
    rider_id: delivery.rider_id ?? "",
    notes: delivery.notes ?? "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  function update(key: string, val: string) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const { data, error: err } = await supabase
      .from("deliveries")
      .update({
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        pickup_address: form.pickup_address,
        delivery_address: form.delivery_address,
        rider_id: form.rider_id || null,
        notes: form.notes || null,
      })
      .eq("id", delivery.id)
      .select("*, riders(name, phone, vehicle_type)")
      .single();

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data) {
      onUpdate(data);
      onClose();
      toast.success("Delivery updated");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{
          background: "#0D0D0D",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "16px",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "#2A2A2A" }}
        >
          <h2 className="text-base font-bold">Edit Delivery</h2>
          <button
            onClick={onClose}
            className="text-xl leading-none transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Customer Name
              </label>
              <input
                className="input-base"
                value={form.customer_name}
                onChange={(e) => update("customer_name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Customer Phone
              </label>
              <input
                className="input-base"
                value={form.customer_phone}
                onChange={(e) => update("customer_phone", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Pickup Address
            </label>
            <input
              className="input-base"
              value={form.pickup_address}
              onChange={(e) => update("pickup_address", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Delivery Address
            </label>
            <input
              className="input-base"
              value={form.delivery_address}
              onChange={(e) => update("delivery_address", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Assign Agent
            </label>
            <select
              className="input-base"
              value={form.rider_id}
              onChange={(e) => update("rider_id", e.target.value)}
            >
              <option value="">Unassigned</option>
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
              style={{ color: "var(--text-muted)" }}
            >
              Notes
            </label>
            <textarea
              className="input-base resize-none"
              rows={2}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </div>

          {error && (
            <p
              className="text-xs px-3 py-2 rounded-lg"
              style={{
                background: "rgba(230,57,70,0.1)",
                color: "#E63946",
                border: "1px solid rgba(230,57,70,0.2)",
              }}
            >
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 justify-center"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
