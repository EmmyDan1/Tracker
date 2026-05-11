"use client";

import { useState } from "react";
import { Rider, DeliveryZone } from "@/types";
import { useDeliveryForm } from "@/lib/useDeliveryForm";
import DeliveryForm from "./DeliveryForm";
import DeliverySuccess from "./DeliverySuccess";

interface Props {
  riders: Rider[];
  zones: DeliveryZone[];
  onCreated?: () => void;
}

export default function CreateDeliveryModal({
  riders,
  zones,
  onCreated,
}: Props) {
  const [open, setOpen] = useState(false);

  const {
    form,
    update,
    error,
    isPending,
    createdTrackingId,
    copied,
    distance,
    cost,
    calculating,
    locationError,
    handleSubmit,
    handleAddressBlur,
    copyLink,
    reset,
  } = useDeliveryForm(riders, zones, onCreated);

  function closeAndReset() {
    setOpen(false);
    reset();
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
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={(e) => e.target === e.currentTarget && closeAndReset()}
        >
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto"
            style={{
              background: "#1C1C1C",
              border: "1px solid #2A2A2A",
              borderRadius: "12px",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "#2A2A2A" }}
            >
              <h2
                className="text-base font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {createdTrackingId ? "Delivery Created" : "New Delivery"}
              </h2>
              <button
                onClick={closeAndReset}
                className="text-xl leading-none"
                style={{ color: "var(--text-muted)" }}
              >
                ×
              </button>
            </div>

            {createdTrackingId ? (
              <DeliverySuccess
                trackingId={createdTrackingId}
                copied={copied}
                onCopy={copyLink}
                onClose={closeAndReset}
              />
            ) : (
              <DeliveryForm
                form={form}
                riders={riders}
                zones={zones}
                update={update}
                onSubmit={handleSubmit}
                onClose={closeAndReset}
                onAddressBlur={handleAddressBlur}
                error={error}
                isPending={isPending}
                calculating={calculating}
                locationError={locationError}
                distance={distance}
                cost={cost}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
