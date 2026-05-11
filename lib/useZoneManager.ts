import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { DeliveryZone } from '@/types'
import { toast } from 'sonner'

export function useZoneManager(companyId: string, initialZones: DeliveryZone[]) {
  const [zones, setZones] = useState<DeliveryZone[]>(initialZones)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [adding, setAdding] = useState(false)
  const supabase = createClient()

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)

    const { data, error } = await supabase
      .from('delivery_zones')
      .insert({
        company_id: companyId,
        name: name.trim(),
        price: parseInt(price),
      })
      .select()
      .single()

    if (error) {
      toast.error('Failed to add zone')
      setAdding(false)
      return
    }

    setZones((prev) => [...prev, data])
    setName('')
    setPrice('')
    setAdding(false)
    toast.success('Zone added')
  }

  async function handleDelete(id: string) {
    await supabase.from('delivery_zones').delete().eq('id', id)
    setZones((prev) => prev.filter((z) => z.id !== id))
    toast.success('Zone deleted')
  }

  async function handlePriceUpdate(id: string, newPrice: number) {
    await supabase
      .from('delivery_zones')
      .update({ price: newPrice })
      .eq('id', id)
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, price: newPrice } : z))
    )
    toast.success('Price updated')
  }

  return {
    zones,
    name,
    setName,
    price,
    setPrice,
    adding,
    handleAdd,
    handleDelete,
    handlePriceUpdate,
  }
}