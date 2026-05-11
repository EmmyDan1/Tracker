import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { riderId, subscription } = await request.json()

    if (!riderId || !subscription) {
      return NextResponse.json(
        { error: 'Missing riderId or subscription' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Delete existing subscription for this rider
    await supabase
      .from('push_subscriptions')
      .delete()
      .eq('rider_id', riderId)

    // Save new subscription
    const { error } = await supabase
      .from('push_subscriptions')
      .insert({ rider_id: riderId, subscription })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}