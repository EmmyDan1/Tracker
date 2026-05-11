import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { trackingId } = await request.json()

    const supabase = await createServerSupabaseClient()

    const { data: delivery } = await supabase
      .from('deliveries')
      .select('*, riders(name)')
      .eq('tracking_id', trackingId)
      .single()

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 })
    }

    const prompt = `Generate a short, friendly WhatsApp message for a Nigerian logistics company to send to their customer.

Delivery details:
- Customer name: ${delivery.customer_name}
- Pickup: ${delivery.pickup_address}
- Delivery address: ${delivery.delivery_address}
- Rider/Agent: ${delivery.riders?.name ?? 'our agent'}
- Tracking ID: ${delivery.tracking_id}
- Tracking link: ${process.env.NEXT_PUBLIC_APP_URL}/track/${delivery.tracking_id}

Requirements:
- Keep it short (3-4 lines max)
- Friendly and professional Nigerian tone
- Include the tracking link
- No emojis
- End with the tracking link on its own line`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ message: text })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate message' }, { status: 500 })
  }
}