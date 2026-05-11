export async function calculateDistance(
  pickup: string,
  delivery: string
): Promise<number | null> {
  const orsKey = process.env.NEXT_PUBLIC_ORS_API_KEY
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  if (!orsKey || !mapboxToken) return null

  try {
    const [pickupCoords, deliveryCoords] = await Promise.all([
      geocodeAddress(pickup, mapboxToken),
      geocodeAddress(delivery, mapboxToken),
    ])

    console.log('Pickup coords:', pickupCoords)
    console.log('Delivery coords:', deliveryCoords)

    if (!pickupCoords || !deliveryCoords) return null

    const response = await fetch(
      'https://api.openrouteservice.org/v2/directions/driving-car',
      {
        method: 'POST',
        headers: {
          Authorization: orsKey,
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

    const distanceKm =
      Math.round((data.routes[0].summary.distance / 1000) * 10) / 10

    return distanceKm
  } catch (err) {
    console.error('Distance calc error:', err)
    return null
  }
}

async function geocodeAddress(
  address: string,
  token: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const encoded = encodeURIComponent(address)
    const response = await fetch(
`https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${token}&country=ng&proximity=3.9209,7.3776&bbox=3.7,7.0,4.1,7.6&limit=1`
    )
    const data = await response.json()
    console.log('Mapbox geocode for:', address, data)

    if (!data.features?.[0]) return null

    const [lng, lat] = data.features[0].geometry.coordinates
    return { lat, lng }
  } catch (err) {
    console.error('Geocode error:', err)
    return null
  }
}