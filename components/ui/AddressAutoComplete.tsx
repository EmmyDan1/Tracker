'use client'

import { useEffect, useRef, useState } from 'react'

interface Suggestion {
  display_name: string
  lat: string
  lon: string
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
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function fetchSuggestions(query: string) {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const encoded = encodeURIComponent(query + ' Ibadan Nigeria')
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=5&countrycodes=ng&viewbox=3.7,7.6,4.1,7.0&bounded=0`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'ShippaLogistics/1.0',
          },
        }
      )
      const data = await res.json()
      setSuggestions(data ?? [])
      setShowSuggestions(true)
    } catch {
      setSuggestions([])
    }
    setLoading(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    onChange(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 400)
  }

  function handleSelect(suggestion: Suggestion) {
    onChange(
      suggestion.display_name,
      parseFloat(suggestion.lat),
      parseFloat(suggestion.lon)
    )
    setSuggestions([])
    setShowSuggestions(false)
    if (onBlur) onBlur()
  }

  function handleBlur() {
    setTimeout(() => {
      setShowSuggestions(false)
      if (onBlur) onBlur()
    }, 200)
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

      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden"
          style={{
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-left px-4 py-3 text-sm transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseDown={() => handleSelect(s)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <p
                className="font-medium text-xs truncate"
                style={{ color: '#ffffff' }}
              >
                {s.display_name.split(',')[0]}
              </p>
              <p
                className="text-xs truncate mt-0.5"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {s.display_name.split(',').slice(1, 3).join(',')}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}