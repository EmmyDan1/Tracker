import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createServerSupabaseClient } from '@/lib/supabase-server'

webpush.setVapidDetails(
  'mailto:admin@Shippa.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { riderId, title, body, url } = await request.json()
       console.log('Push send received:', { riderId, title })

    if (!riderId) {
      return NextResponse.json({ error: 'Missing riderId' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('rider_id', riderId)

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    const payload = JSON.stringify({ title, body, url })

    await Promise.all(
      subscriptions.map((s) =>
        webpush.sendNotification(s.subscription, payload).catch(console.error)
      )
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}