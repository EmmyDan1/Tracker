"use client";
import { toast } from 'sonner'
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { VehicleType } from "@/types";

const VEHICLE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: "bike", label: "Bike" },
  { value: "car", label: "Car" },
  { value: "van", label: "Van" },
];

export default function AddRiderModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("bike");

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
      setError("Company not found.");
      return;
    }

    const { error: err } = await supabase.from("riders").insert({
      company_id: company.id,
      name: name.trim(),
      phone: phone.trim(),
      vehicle_type: vehicleType,
    });

    if (err) {
      setError(err.message);
      return;
    }

    setName("");
    setPhone("");
    setVehicleType("bike");
    setOpen(false);
    startTransition(() => router.refresh());
    toast.success('Agent added successfully')
  }

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        Add Agent
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            className="w-full max-w-sm"
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
              <h2 className="text-base font-bold">Add Agent</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-xl leading-none"
                style={{ color: "var(--text-muted)" }}
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Full Name
                </label>
                <input
                  className="input-base"
                  placeholder="Tunde Okafor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold uppercase tracking-wider"
style={{ color: 'var(--text-muted)' }}
                >
                  Phone Number
                </label>
                <input
                  className="input-base"
                  placeholder="0812 345 6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Vehicle Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {VEHICLE_OPTIONS.map((v) => (
                    <button
                      key={v.value}
                      type="button"
                      onClick={() => setVehicleType(v.value)}
                      className="py-3 px-2 border text-sm font-semibold transition-all"
                      style={{
                        borderColor:
                          vehicleType === v.value
                            ? "var(--text-primary)"
                            : "var(--border)",
                        background:
                          vehicleType === v.value
                            ? "var(--sidebar-bg)"
                            : "white",
                        color:
                          vehicleType === v.value
                            ? "var(--accent)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
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
                  onClick={() => setOpen(false)}
                  className="btn-secondary flex-1 justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 justify-center"
                  disabled={isPending}
                >
                  {isPending ? "Adding..." : "Add Agent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
