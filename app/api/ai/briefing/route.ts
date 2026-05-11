import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()

    const [
      { count: todayCount },
      { count: pendingCount },
      { count: inTransitCount },
      { count: deliveredCount },
      { data: topAgents },
    ] = await Promise.all([
      supabase
        .from('deliveries')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO),
      supabase
        .from('deliveries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      supabase
        .from('deliveries')
        .select('*', { count: 'exact', head: true })
        .in('status', ['picked_up', 'in_transit']),
      supabase
        .from('deliveries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'delivered')
        .gte('created_at', todayISO),
      supabase
        .from('riders')
        .select('name, deliveries(count)')
        .eq('is_active', true)
        .limit(3),
    ])

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: `You are a logistics operations assistant. Generate a brief, intelligent daily briefing for a Nigerian logistics company dashboard.

Data:
- Deliveries created today: ${todayCount ?? 0}
- Delivered today: ${deliveredCount ?? 0}
- Currently in transit: ${inTransitCount ?? 0}
- Pending pickup: ${pendingCount ?? 0}
- Day of week: ${today.toLocaleDateString('en-NG', { weekday: 'long' })}

Requirements:
- 2 sentences maximum
- Professional but warm Nigerian business tone
- Highlight what needs attention
- No emojis
- No markdown
- Plain text only
- Sound like a smart operations manager briefing their boss`,
        },
      ],
    })

    const briefing =
      completion.choices[0]?.message?.content ?? 'Unable to generate briefing'

    return NextResponse.json({ briefing })
  } catch (err) {
    console.error('Briefing error:', err)
    return NextResponse.json(
      { error: 'Failed to generate briefing' },
      { status: 500 }
    )
  }
}