import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Delivery, Rider, DeliveryStatus } from "@/types";
import { toast } from "sonner";

function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export const NEXT_STATUS: Record<DeliveryStatus, DeliveryStatus | null> = {
  pending: "picked_up",
  picked_up: "in_transit",
  in_transit: "delivered",
  delivered: null,
  cancelled: null,
};

export const NEXT_LABEL: Record<DeliveryStatus, string> = {
  pending: "Mark Picked Up",
  picked_up: "Mark In Transit",
  in_transit: "Mark Delivered",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function useAgentPortal(code: string) {
  const [rider, setRider] = useState<Rider | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createPublicClient();

      const { data: riderData } = await supabase
        .from("riders")
        .select("*")
        .eq("unique_code", code)
        .eq("is_active", true)
        .single();

      if (!riderData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setRider(riderData);
      subscribeToPush(riderData.id);

      const { data: deliveryData } = await supabase
        .from("deliveries")
        .select("*")
        .eq("rider_id", riderData.id)
        .not("status", "in", '("delivered","cancelled")')
        .order("created_at", { ascending: false });

      setDeliveries(deliveryData ?? []);
      setLoading(false);
    }

    load();
  }, [code]);

  async function subscribeToPush(riderId: string) {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      console.log("Service worker registered:", registration);
      await navigator.serviceWorker.ready;
      console.log("Service worker ready");

      console.log("Requesting notification permission...");
      const permission = await Notification.requestPermission();
      console.log("Permission result:", permission);
      if (permission !== "granted") return;

      const existing = await registration.pushManager.getSubscription();
      if (existing) {
        // Already subscribed — save to db anyway
        const res = await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ riderId, subscription: existing }),
        });
        const data = await res.json();
        console.log("Subscribe response:", data);
        return;
      }

      function urlBase64ToUint8Array(base64String: string) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
          .replace(/-/g, "+")
          .replace(/_/g, "/");
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }
      console.log("VAPID KEY:", process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riderId, subscription }),
      });
    } catch (err) {
      console.error("Push subscription error:", err);
    }
  }

  async function updateStatus(delivery: Delivery) {
    const nextStatus = NEXT_STATUS[delivery.status];
    if (!nextStatus) return;

    setUpdating(delivery.id);
    const supabase = createPublicClient();

    const { error } = await supabase
      .from("deliveries")
      .update({ status: nextStatus })
      .eq("id", delivery.id);

    if (error) {
      toast.error("Failed to update status");
      setUpdating(null);
      return;
    }

    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === delivery.id ? { ...d, status: nextStatus } : d,
      ),
    );
    toast.success(`Marked as ${NEXT_LABEL[nextStatus]}`);
    setUpdating(null);
  }

  return {
    rider,
    deliveries,
    loading,
    notFound,
    updating,
    updateStatus,
    subscribeToPush,
  };
}
