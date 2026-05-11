"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
}

interface Suggestion {
  full_address: string;
  name: string;
  place_formatted: string;
}

export default function AddressInput({
  value,
  onChange,
  onBlur,
  placeholder,
  required,
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

  async function fetchSuggestions(query: string) {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(query + ", Ibadan, Nigeria")}&language=en&country=ng&proximity=3.9209,7.3776&session_token=Shippa-session&access_token=${token}`,
      );
      const data = await response.json();
      setSuggestions(data.suggestions ?? []);
    } catch {
      setSuggestions([]);
    }
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
      setShowSuggestions(true);
    }, 300);
  }

  function handleSelect(suggestion: Suggestion) {
    const address = suggestion.full_address || suggestion.name;
    onChange(address);
    setSuggestions([]);
    setShowSuggestions(false);
    if (onBlur) onBlur();
  }

  function handleBlur() {
    setTimeout(() => {
      setShowSuggestions(false);
      if (onBlur) onBlur();
    }, 200);
  }

  return (
    <div className="relative">
      <input
        className="input-base"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        required={required}
      />

      {loading && (
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Searching...
        </p>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute z-50 w-full mt-1 rounded-[var(--radius)] overflow-hidden"
          style={{
            background: "#1C1C1C",
            border: "1px solid var(--border-strong)",
          }}
        >
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-left px-3 py-2.5 text-sm transition-colors"
              style={{ color: "var(--text-primary)" }}
              onMouseDown={() => handleSelect(s)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <p className="font-medium">{s.name}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {s.place_formatted}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
