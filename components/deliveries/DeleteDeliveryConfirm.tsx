"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Delivery } from "@/types";

interface Props {
  delivery: Delivery;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function DeleteDeliveryConfirm({
  delivery,
  onDelete,
  onClose,
}: Props) {
  const [deleting, setDeleting] = useState(false);
  const supabase = createClient();

  async function handleDelete() {
    setDeleting(true);
    const { error } = await supabase
      .from("deliveries")
      .delete()
      .eq("id", delivery.id);

    if (error) {
      console.error("Delete error:", error);
      setDeleting(false);
      return;
    }

    onDelete(delivery.id);
    onClose();
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
        className="w-full max-w-sm p-6"
        style={{
          background: "#0D0D0D",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "16px",
        }}
      >
        <h2 className="text-base font-bold mb-2">Delete Delivery</h2>
        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
          Are you sure you want to delete this delivery? This cannot be undone.
        </p>
        <p className="mono text-xs mb-6" style={{ color: "var(--text-muted)" }}>
          {delivery.tracking_id} — {delivery.customer_name}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn-secondary flex-1 justify-center"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 justify-center inline-flex items-center px-4 py-2 rounded-[var(--radius)] text-sm font-semibold"
            style={{ background: "#c0392b", color: "white" }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
