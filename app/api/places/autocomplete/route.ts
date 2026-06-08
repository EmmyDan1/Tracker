import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const input = searchParams.get('input')

  if (!input) {
    return NextResponse.json({ predictions: [] })
  }

  

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&components=country:ng&location=7.3776,3.9209&radius=50000&key=${process.env.GOOGLE_MAPS_KEY}`,
      { next: { revalidate: 0 } }
    )

    const data = await res.json()
    console.log('Google response:', JSON.stringify(data))
    return NextResponse.json({ predictions: data.predictions ?? [] })
  } catch {
    return NextResponse.json({ predictions: [] })
  }
}