"use client";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Rider } from "@/types";

interface Props {
  rider: Rider;
}

export default function AgentActions({ rider }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState(false);
  const supabase = createClient();

  async function handleDelete() {
    const supabase = createClient();
    await supabase.from("riders").delete().eq("id", rider.id);
    toast.success("Agent deleted");
    startTransition(() => {
      router.refresh();
      setConfirm(false);
    });
  }

  async function toggleActive() {
    await supabase
      .from("riders")
      .update({ is_active: !rider.is_active })
      .eq("id", rider.id);

    startTransition(() => {
      router.refresh();
      setConfirm(false);
    });
    toast.success(rider.is_active ? "Agent deactivated" : "Agent reactivated");
  }

  return (
    <>
      <button
        onClick={() => setConfirm(true)}
        className="text-xs px-2.5 py-1 rounded border font-medium transition-colors w-full mt-3"
        style={{
          borderColor: rider.is_active ? "#fcc" : "var(--border)",
          color: rider.is_active ? "#c0392b" : "#2a7a2a",
          background: rider.is_active ? "#fff5f5" : "#EFFFEC",
        }}
      >
        {rider.is_active ? "Deactivate" : "Reactivate"}
      </button>

      {confirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={(e) => e.target === e.currentTarget && setConfirm(false)}
        >
          <div
            className="w-full max-w-sm p-6"
            style={{
              background: "#0D0D0D",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px",
            }}
          >
            <h2 className="text-base font-bold mb-2">
              {rider.is_active ? "Deactivate Agent" : "Reactivate Agent"}
            </h2>
            <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
              {rider.is_active
                ? `${rider.name} will no longer appear in delivery assignments.`
                : `${rider.name} will be available for delivery assignments again.`}
            </p>
            <p
              className="mono text-xs mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              {rider.vehicle_type} — {rider.phone}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirm(false)}
                className="btn-secondary flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 justify-center inline-flex items-center px-4 py-2 rounded-[var(--radius)] text-sm font-semibold"
                style={{ background: "#c0392b", color: "white" }}
              >
                {isPending ? "Deleting..." : "Delete Agent"}
              </button>
              <button
                onClick={toggleActive}
                disabled={isPending}
                className="flex-1 justify-center inline-flex items-center px-4 py-2 rounded-[var(--radius)] text-sm font-semibold"
                style={{
                  background: rider.is_active ? "#1a1a1a" : "#2a7a2a",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {isPending
                  ? "Updating..."
                  : rider.is_active
                    ? "Deactivate"
                    : "Reactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
