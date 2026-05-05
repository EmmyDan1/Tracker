import { useState, useTransition, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Rider } from '@/types'
import { generateTrackingId } from '@/lib/utils'
import { calculateDistance } from '@/lib/distance'

export function useDeliveryForm(
  riders: Rider[],
  onCreated?: () => void
) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [createdTrackingId, setCreatedTrackingId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [distance, setDistance] = useState<number | null>(null)
  const [cost, setCost] = useState<number | null>(null)
  const [calculating, setCalculating] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [ratePerKm, setRatePerKm] = useState(600)

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    pickup_address: '',
    delivery_address: '',
    rider_id: '',
    notes: '',
  })

  const supabase = createClient()

  useEffect(() => {
    async function fetchRate() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: company } = await supabase
        .from('companies')
        .select('rate_per_km')
        .eq('email', user.email!)
        .single()
      if (company) setRatePerKm(company.rate_per_km)
    }
    fetchRate()
  }, [])

  function update(key: string, val: string) {
    setForm((p) => ({ ...p, [key]: val }))
  }

  async function handleAddressBlur() {
    if (!form.pickup_address || !form.delivery_address) return
    setDistance(null)
    setCost(null)
    setLocationError('')
    setCalculating(true)
    const km = await calculateDistance(
      form.pickup_address,
      form.delivery_address
    )
    if (km) {
      setDistance(km)
      setCost(Math.round(km * ratePerKm))
    } else {
      setLocationError('Location not found. Check the addresses and try again.')
    }
    setCalculating(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('email', user.email!)
      .single()

    if (!company) {
      setError('Company not found. Please contact support.')
      return
    }

    let tracking_id = generateTrackingId()
    let attempts = 0
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from('deliveries')
        .select('id')
        .eq('tracking_id', tracking_id)
        .single()
      if (!existing) break
      tracking_id = generateTrackingId()
      attempts++
    }

    const { error: insertError } = await supabase.from('deliveries').insert({
      tracking_id,
      company_id: company.id,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      pickup_address: form.pickup_address,
      delivery_address: form.delivery_address,
      rider_id: form.rider_id || null,
      notes: form.notes || null,
      status: 'pending',
      distance_km: distance || null,
      cost: cost || null,
    })

    if (insertError) {
      setError(insertError.message)
      return
    }

    setCreatedTrackingId(tracking_id)
    if (onCreated) onCreated()
    startTransition(() => {})
  }

  function copyLink() {
    const url = `${window.location.origin}/track/${createdTrackingId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function reset() {
    setCreatedTrackingId(null)
    setError('')
    setCopied(false)
    setDistance(null)
    setCost(null)
    setCalculating(false)
    setLocationError('')
    setForm({
      customer_name: '',
      customer_phone: '',
      pickup_address: '',
      delivery_address: '',
      rider_id: '',
      notes: '',
    })
  }

  return {
    form,
    update,
    error,
    isPending,
    createdTrackingId,
    copied,
    distance,
    cost,
    calculating,
    locationError,
    ratePerKm,
    handleSubmit,
    handleAddressBlur,
    copyLink,
    reset,
  }
}