'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  code: string
}

export default function CopyAgentLink({ code }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const url = `${window.location.origin}/agent/${code}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Agent portal link copied')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="mt-3 pt-3 border-t"
      style={{ borderColor: 'var(--border)' }}
    >
      <p
        className="text-xs mb-1.5"
        style={{ color: 'var(--text-muted)' }}
      >
        Agent Portal Link
      </p>
      <div className="flex items-center gap-2">
        <span
          className="text-xs mono truncate flex-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          /agent/{code}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 rounded border font-medium shrink-0 cursor-pointer transition-all"
          style={{
            borderColor: copied ? 'var(--border-strong)' : 'var(--border)',
            color: copied ? 'var(--text-primary)' : 'var(--text-muted)',
            background: copied ? 'rgba(255,255,255,0.06)' : 'transparent',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}