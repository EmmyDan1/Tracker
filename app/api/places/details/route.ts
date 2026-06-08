import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const placeId = searchParams.get('placeId')

  if (!placeId) {
    return NextResponse.json({ result: null })
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,geometry&key=${process.env.GOOGLE_MAPS_KEY}`,
      { next: { revalidate: 0 } }
    )

    const data = await res.json()
    return NextResponse.json({ result: data.result ?? null })
  } catch {
    return NextResponse.json({ result: null })
  }
}