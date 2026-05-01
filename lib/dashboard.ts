import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function getDashboardStats() {
  const supabase = await createServerSupabaseClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

  const [
    { count: totalCount },
    { count: pendingCount },
    { count: inTransitCount },
    { count: deliveredCount },
    { count: todayCount },
    { count: todayDeliveredCount },
    { data: recentDeliveries },
  ] = await Promise.all([
    supabase.from('deliveries').select('*', { count: 'exact', head: true }),
    supabase.from('deliveries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('deliveries').select('*', { count: 'exact', head: true }).in('status', ['picked_up', 'in_transit']),
    supabase.from('deliveries').select('*', { count: 'exact', head: true }).eq('status', 'delivered'),
    supabase.from('deliveries').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
    supabase.from('deliveries').select('*', { count: 'exact', head: true }).eq('status', 'delivered').gte('created_at', todayISO),
    supabase.from('deliveries').select('*, riders(name)').order('created_at', { ascending: false }).limit(8),
  ])

  const stats = [
    { label: 'Today', value: todayCount ?? 0, sub: 'Deliveries created today', accent: true },
    { label: 'Delivered Today', value: todayDeliveredCount ?? 0, sub: 'Completed today', accent: false },
    { label: 'In Transit', value: inTransitCount ?? 0, sub: 'Currently on the road', accent: false },
    { label: 'Pending', value: pendingCount ?? 0, sub: 'Awaiting pickup', accent: false },
   
  ]

  return { stats, recentDeliveries: recentDeliveries ?? [] }
}