import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Delivery, Rider, DeliveryStatus, DeliveryZone } from '@/types'

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [riders, setRiders] = useState<Rider[]>([])
  const [zones, setZones] = useState<DeliveryZone[]>([])
  const [filter, setFilter] = useState<DeliveryStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const PER_PAGE = 20

  useEffect(() => {
    async function load() {
      const supabase = createClient()

      const [
        { data: deliveryData },
        { data: riderData },
        { data: zoneData },
      ] = await Promise.all([
        supabase
          .from('deliveries')
          .select('*, riders(name, phone, vehicle_type)')
          .order('created_at', { ascending: false }),
        supabase
          .from('riders')
          .select('*')
          .eq('is_active', true)
          .order('name'),
        supabase
          .from('delivery_zones')
          .select('*')
          .order('created_at', { ascending: true }),
      ])

      setDeliveries(deliveryData ?? [])
      setRiders(riderData ?? [])
      setZones(zoneData ?? [])
      setLoading(false)
      setPage(1)
    }

    load()
  }, [])

  const filtered = deliveries
    .filter((d) => filter === 'all' || d.status === filter)
    .filter((d) => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        d.customer_name.toLowerCase().includes(q) ||
        d.customer_phone.includes(q) ||
        d.tracking_id.toLowerCase().includes(q) ||
        d.pickup_address.toLowerCase().includes(q) ||
        d.delivery_address.toLowerCase().includes(q)
      )
    })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function handleFilterChange(val: DeliveryStatus | 'all') {
    setFilter(val)
    setPage(1)
  }

  function handleSearchChange(val: string) {
    setSearch(val)
    setPage(1)
  }

  function handleUpdate(updatedDelivery: Delivery) {
    setDeliveries((prev) =>
      prev.map((item) =>
        item.id === updatedDelivery.id ? updatedDelivery : item
      )
    )
  }

  function handleDelete(id: string) {
    setDeliveries((prev) => prev.filter((item) => item.id !== id))
  }

  function handleCreated() {
    const supabase = createClient()
    supabase
      .from('deliveries')
      .select('*, riders(name, phone, vehicle_type)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setDeliveries(data ?? []))
  }

  return {
    deliveries,
    riders,
    zones,
    filter,
    search,
    loading,
    page,
    setPage,
    totalPages,
    paginated,
    filtered,
    PER_PAGE,
    handleFilterChange,
    handleSearchChange,
    handleUpdate,
    handleDelete,
    handleCreated,
  }
}