import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    // Initialize Groq INSIDE the handler
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { trackingId } = await request.json()

    const supabase = await createServerSupabaseClient()

    const { data: delivery } = await supabase
      .from('deliveries')
      .select('*, riders(name), companies(name)')
      .eq('tracking_id', trackingId)
      .single()

    if (!delivery) {
      return NextResponse.json(
        { error: 'Delivery not found' },
        { status: 404 }
      )
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', 
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Generate a short friendly WhatsApp message for a Nigerian logistics company to send to their customer.

Delivery details:
- Customer name: ${delivery.customer_name}
- Pickup: ${delivery.pickup_address}
- Delivery address: ${delivery.delivery_address}
- Agent: ${delivery.riders?.name ?? 'our agent'}
- Tracking ID: ${delivery.tracking_id}
- Tracking link: ${process.env.NEXT_PUBLIC_APP_URL}/track/${delivery.tracking_id}

Requirements:
- 3-4 lines maximum
- Friendly and professional Nigerian tone
- Include the tracking link
- No emojis
- No asterisks or markdown formatting
- Plain text only`,
        },
      ],
    })

    const message =
      completion.choices[0]?.message?.content ?? 'Could not generate message'

    return NextResponse.json({ message })
  } catch (err) {
    console.error('AI message error:', err)
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    )
  }
}