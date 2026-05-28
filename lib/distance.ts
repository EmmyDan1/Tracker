export async function calculateDistance(
  pickupLat: number,
  pickupLng: number,
  deliveryLat: number,
  deliveryLng: number
): Promise<number | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${deliveryLng},${deliveryLat}?overview=false`

    const res = await fetch(url)
    const data = await res.json()

    if (!data.routes?.[0]?.distance) return null

    const km = Math.round((data.routes[0].distance / 1000) * 10) / 10
    return km
  } catch {
    return null
  }
}