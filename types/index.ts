export type DeliveryStatus =
  | 'pending'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'

export type VehicleType = 'bike' | 'car' | 'van'

export interface Company {
  id: string
  name: string
  email: string
  phone?: string
  city: string
  created_at: string
  rate_per_km: number
}

export interface Rider {
  id: string
  company_id: string
  name: string
  phone: string
  vehicle_type: VehicleType
  is_active: boolean
  created_at: string
}

export interface Delivery {
  id: string
  tracking_id: string
  company_id: string
  rider_id?: string
  customer_name: string
  customer_phone: string
  pickup_address: string
  delivery_address: string
  status: DeliveryStatus
  notes?: string
  created_at: string
  updated_at: string
  delivered_at?: string
  riders?: Pick<Rider, 'name' | 'phone' | 'vehicle_type'>
  distance_km?: number | null
  cost?: number | null
}

export interface DashboardStats {
  total: number
  pending: number
  in_transit: number
  delivered: number
}