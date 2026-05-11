'use client'

import { useAIChat, SUGGESTIONS } from '@/lib/useAIChat'

export default function AIChat() {
  const {
    open,
    toggleOpen,
    messages,
    input,
    setInput,
    loading,
    bottomRef,
    sendMessage,
  } = useAIChat()

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
        style={{
          background: open ? '#1a1a1a' : '#ffffff',
          border: '1px solid rgba(255,255,255,0.12)',
          color: open ? '#ffffff' : '#09090B',
        }}
      >
        {open ? (
          <span className="text-lg">×</span>
        ) : (
          <span className="text-base font-black">AI</span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.08)',
            maxHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 border-b flex items-center gap-3"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#4ade80' }}
            />
            <div>
              <p
                className="text-sm font-bold"
                style={{ color: '#ffffff' }}
              >
                Shippa AI
              </p>
              <p
                className="text-xs"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                Ask me about your operations
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ minHeight: '200px', maxHeight: '400px' }}
          >
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p
                  className="text-xs text-center"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  Ask anything about your deliveries and agents
                </p>
                <div className="space-y-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="w-full text-left text-xs px-3 py-2 rounded-xl transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[85%] px-3 py-2 text-xs leading-relaxed"
                    style={
                      m.role === 'user'
                        ? {
                            background: '#ffffff',
                            color: '#09090B',
                            borderRadius: '16px 16px 4px 16px',
                          }
                        : {
                            background: 'rgba(255,255,255,0.06)',
                            color: 'rgba(255,255,255,0.85)',
                            borderRadius: '16px 16px 16px 4px',
                          }
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="px-3 py-2"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '16px 16px 16px 4px',
                  }}
                >
                  <div className="flex gap-1 items-center px-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{
                          background: 'rgba(255,255,255,0.4)',
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="p-3 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <div className="flex gap-2">
              <input
                className="flex-1 text-xs px-3 py-2 rounded-xl outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#ffffff',
                }}
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage(input)
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0"
                style={{
                  background: input.trim()
                    ? '#ffffff'
                    : 'rgba(255,255,255,0.06)',
                  color: input.trim()
                    ? '#09090B'
                    : 'rgba(255,255,255,0.3)',
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}