'use client'

import { useRef, useState } from 'react'

interface Prediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

interface Props {
  value: string
  onChange: (value: string, lat?: number, lng?: number) => void
  onBlur?: () => void
  placeholder?: string
  required?: boolean
}

export default function AddressAutocomplete({
  value,
  onChange,
  onBlur,
  placeholder,
  required,
}: Props) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function fetchPredictions(input: string) {
    if (input.length < 3) {
      setPredictions([])
      return
    }

    setLoading(true)
    try {
      const res = await fetch(
        `/api/places/autocomplete?input=${encodeURIComponent(input)}`
      )
      const data = await res.json()
      setPredictions(data.predictions ?? [])
      setShowPredictions(true)
    } catch {
      setPredictions([])
    }
    setLoading(false)
  }

  async function handleSelect(prediction: Prediction) {
    setShowPredictions(false)
    setPredictions([])

    try {
      const res = await fetch(
        `/api/places/details?placeId=${prediction.place_id}`
      )
      const data = await res.json()

      if (data.result) {
        const lat = data.result.geometry.location.lat
        const lng = data.result.geometry.location.lng
        onChange(data.result.formatted_address, lat, lng)
      } else {
        onChange(prediction.description)
      }
    } catch {
      onChange(prediction.description)
    }

    if (onBlur) onBlur()
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(
      () => fetchPredictions(e.target.value),
      350
    )
  }

  return (
    <div className="relative">
      <input
        className="input-base"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setShowPredictions(false), 200)}
        onFocus={() => predictions.length > 0 && setShowPredictions(true)}
        required={required}
        autoComplete="off"
      />

      {loading && (
        <p
          className="text-xs mt-1"
          style={{ color: 'var(--text-muted)' }}
        >
          Searching...
        </p>
      )}

      {showPredictions && predictions.length > 0 && (
        <div
          className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden"
          style={{
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          {predictions.map((p) => (
            <button
              key={p.place_id}
              type="button"
              className="w-full text-left px-4 py-3 transition-colors border-b last:border-0"
              style={{
                borderColor: 'rgba(255,255,255,0.05)',
              }}
              onMouseDown={() => handleSelect(p)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <p
                className="text-xs font-medium truncate"
                style={{ color: '#ffffff' }}
              >
                {p.structured_formatting.main_text}
              </p>
              <p
                className="text-xs truncate mt-0.5"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {p.structured_formatting.secondary_text}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}