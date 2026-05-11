import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})
type DeliverySummary = {
  tracking_id: string;
  customer_name: string;
  status: string;
  pickup_address: string;
  delivery_address: string;
  created_at: string;
  riders: {
    name: string;
  }[];
};

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    const supabase = await createServerSupabaseClient()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      { data: deliveries },
      { data: riders },
      { count: todayCount },
      { count: pendingCount },
      { count: inTransitCount },
      { count: deliveredCount },
    ] = await Promise.all([
      supabase
        .from('deliveries')
        .select('tracking_id, customer_name, status, pickup_address, delivery_address, created_at, riders(name)')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('riders')
        .select('name, vehicle_type, is_active'),
      supabase
        .from('deliveries')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString()),
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
        .eq('status', 'delivered'),
    ])

    const systemPrompt = `You are an intelligent logistics operations assistant for a Nigerian logistics company using the Shippa platform.

You have access to their live data:

STATS:
- Total deliveries today: ${todayCount ?? 0}
- Pending: ${pendingCount ?? 0}
- In transit: ${inTransitCount ?? 0}
- Total delivered: ${deliveredCount ?? 0}

AGENTS (${riders?.length ?? 0} total):
${riders?.map(r => `- ${r.name} (${r.vehicle_type}) - ${r.is_active ? 'Active' : 'Inactive'}`).join('\n') ?? 'None'}

RECENT DELIVERIES (last 50):
${deliveries?.map((d: DeliverySummary) => `- ${d.tracking_id}: ${d.customer_name} | ${d.status} | From: ${d.pickup_address} → ${d.delivery_address} | Agent: ${d.riders[0]?.name ?? 'Unassigned'}`).join('\n') ?? 'None'}

Answer questions about this data in a helpful, concise way.
Use a professional but friendly Nigerian business tone.
Keep answers short — 1-3 sentences unless a list is needed.
No markdown formatting. Plain text only.
If asked something outside your data, say you don't have that information.`

    const messages = [
      ...history,
      { role: 'user' as const, content: message },
    ]

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 300,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    })

    const reply =
      completion.choices[0]?.message?.content ?? 'Sorry I could not process that.'

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Chat error:', err)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}