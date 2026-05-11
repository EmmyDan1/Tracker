import { Rider } from "@/types";

import { DeliveryZone } from "@/types";

interface Props {
  form: {
    customer_name: string;
    customer_phone: string;
    pickup_address: string;
    delivery_address: string;
    rider_id: string;
    notes: string;
    zone_id: string;
  };
  riders: Rider[];
  zones: DeliveryZone[];
  update: (key: string, val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onAddressBlur: () => void;
  error: string;
  isPending: boolean;
  calculating: boolean;
  locationError: string;
  distance: number | null;
  cost: number | null;
}

export default function DeliveryForm({
  form,
  riders,
  zones,
  update,
  onSubmit,
  onClose,

  error,
  isPending,

}: Props) {
  const labelStyle = { color: "var(--text-muted)" };

  return (
    <form onSubmit={onSubmit} className="p-5 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            className="text-xs font-semibold uppercase tracking-wider"
            style={labelStyle}
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
            style={labelStyle}
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
          style={labelStyle}
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
          style={labelStyle}
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
          style={labelStyle}
        >
          Delivery Zone
        </label>
        <select
          className="input-base"
          value={form.zone_id}
          onChange={(e) => update("zone_id", e.target.value)}
        >
          <option value="">Select a zone (optional)</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name} — ₦{z.price.toLocaleString()}
            </option>
          ))}
        </select>
        {form.zone_id && zones.find((z) => z.id === form.zone_id) && (
          <p
            className="text-xs font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Cost: ₦
            {zones.find((z) => z.id === form.zone_id)?.price.toLocaleString()}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          className="text-xs font-semibold uppercase tracking-wider"
          style={labelStyle}
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
          style={labelStyle}
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
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Delivery"}
        </button>
      </div>
    </form>
  );
}
