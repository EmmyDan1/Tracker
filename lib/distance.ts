export async function calculateDistance(
  pickup: string,
  delivery: string
): Promise<number | null> {
  const apiKey = process.env.NEXT_PUBLIC_ORS_API_KEY
  if (!apiKey) return null

  try {
    const [pickupCoords, deliveryCoords] = await Promise.all([
      geocodeAddress(pickup, apiKey),
      geocodeAddress(delivery, apiKey),
    ])

    console.log('Pickup coords:', pickupCoords)
    console.log('Delivery coords:', deliveryCoords)

    if (!pickupCoords || !deliveryCoords) return null

    const response = await fetch(
      'https://api.openrouteservice.org/v2/directions/driving-car',
      {
        method: 'POST',
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: [
            [pickupCoords.lng, pickupCoords.lat],
            [deliveryCoords.lng, deliveryCoords.lat],
          ],
        }),
      }
    )

    const data = await response.json()
    console.log('ORS directions response:', data)

    if (!data.routes?.[0]?.summary?.distance) return null

 
const distanceKm = Math.round((data.routes[0].summary.distance / 1000) * 10) / 10
    return distanceKm
  } catch (err) {
    console.error('Distance calc error:', err)
    return null
  }
}

async function geocodeAddress(
  address: string,
  apiKey: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    // Try with just the address + Nigeria first
    const encoded = encodeURIComponent(address + ', Nigeria')
    const response = await fetch(
      `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encoded}&size=1&boundary.country=NG&boundary.rect.min_lon=3.7&boundary.rect.min_lat=7.0&boundary.rect.max_lon=4.1&boundary.rect.max_lat=7.6`
    )
    const data = await response.json()
    console.log('Geocode result for:', address, data)

    if (!data.features?.[0]) return null

    const [lng, lat] = data.features[0].geometry.coordinates
    return { lat, lng }
  } catch (err) {
    console.error('Geocode error:', err)
    return null
  }
}