import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const origins = searchParams.get('origins')
  const destinations = searchParams.get('destinations')

  if (!origins || !destinations) {
    return NextResponse.json({ km: null })
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${process.env.GOOGLE_MAPS_KEY}&units=metric`
    )

    const data = await res.json()

    if (data.rows?.[0]?.elements?.[0]?.status !== 'OK') {
      return NextResponse.json({ km: null })
    }

    const meters = data.rows[0].elements[0].distance.value
    const km = Math.round((meters / 1000) * 10) / 10

    return NextResponse.json({ km })
  } catch {
    return NextResponse.json({ km: null })
  }
}