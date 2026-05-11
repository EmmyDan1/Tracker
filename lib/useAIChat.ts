import { useState, useRef, useEffect } from 'react'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export const SUGGESTIONS = [
  'How many deliveries today?',
  'Which agent has most deliveries?',
  'Show me pending deliveries',
  'How is business going?',
]

export function useAIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return

    const userMessage: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })

      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I could not process that right now.',
        },
      ])
    }

    setLoading(false)
  }

  function toggleOpen() {
    setOpen((prev) => !prev)
  }

  return {
    open,
    toggleOpen,
    messages,
    input,
    setInput,
    loading,
    bottomRef,
    sendMessage,
  }
}