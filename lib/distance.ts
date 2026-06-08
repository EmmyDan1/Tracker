export async function calculateDistance(
  pickupLat: number,
  pickupLng: number,
  deliveryLat: number,
  deliveryLng: number
): Promise<number | null> {
  try {
    const origins = `${pickupLat},${pickupLng}`
    const destinations = `${deliveryLat},${deliveryLng}`

    const res = await fetch(
      `/api/distance?origins=${origins}&destinations=${destinations}`
    )
    const data = await res.json()
    return data.km ?? null
  } catch {
    return null
  }
}