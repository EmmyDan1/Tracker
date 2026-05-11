import { useState } from "react";

interface Props {
  trackingId: string;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
}

export default function DeliverySuccess({
  trackingId,
  copied,
  onCopy,
  onClose,
}: Props) {
  const [message, setMessage] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  async function generateMessage() {
    setGenerating(true);
    const response = await fetch("/api/ai/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingId }),
    });
    const data = await response.json();
    setMessage(data.message);
    setGenerating(false);
  }

  function copyMessage() {
    navigator.clipboard.writeText(message);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  }

  return (
    <div className="p-5 space-y-4">
      <div
        className="rounded-xl p-4 text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border)",
        }}
      >
        <p
          className="font-bold text-lg mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Delivery Created
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Share the tracking link with your customer
        </p>
      </div>

      <div
        className="rounded-xl p-4 text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          Tracking ID
        </p>
        <p
          className="mono font-black text-2xl tracking-widest"
          style={{ color: "var(--text-primary)" }}
        >
          {trackingId}
        </p>
      </div>

      <div
        className="flex items-center gap-2 p-3 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border)",
        }}
      >
        <span
          className="flex-1 truncate text-xs mono"
          style={{ color: "var(--text-muted)" }}
        >
          {typeof window !== "undefined" ? window.location.origin : ""}/track/
          {trackingId}
        </span>
        <button
          onClick={onCopy}
          className="btn-primary shrink-0 py-1 px-3 text-xs"
        >
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
      <div
        className="rounded-xl p-4 space-y-3"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--border)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          WhatsApp Message
        </p>

        {!message ? (
          <button
            onClick={generateMessage}
            disabled={generating}
            className="btn-secondary w-full justify-center text-xs"
          >
            {generating ? "Generating..." : "Generate WhatsApp Message"}
          </button>
        ) : (
          <div className="space-y-2">
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {message}
            </p>
            <button
              onClick={copyMessage}
              className="btn-primary w-full justify-center text-xs py-2"
            >
              {copiedMsg ? "Copied!" : "Copy Message"}
            </button>
          </div>
        )}
      </div>
      <button onClick={onClose} className="btn-secondary w-full justify-center">
        Done
      </button>
    </div>
  );
}
