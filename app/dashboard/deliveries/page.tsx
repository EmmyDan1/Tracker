'use client'

import { useDeliveries } from '@/lib/useDeliveries'
import CreateDeliveryModal from '@/components/deliveries/CreateDeliveryModal'
import DeliveryFilters from '@/components/deliveries/DeliveryFilters'
import DeliveryTable from '@/components/deliveries/DeliveryTable'

export default function DeliveriesPage() {
  const {
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
  } = useDeliveries()

  const counts = deliveries.reduce(
    (acc, d) => {
      acc[d.status] = (acc[d.status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
<div className="page-wrapper space-y-8">

  {/* HEADER */}
  <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

    <div className="space-y-1.5">

      <h1 className="text-2xl font-black tracking-[-0.04em]">
        Deliveries
      </h1>

      <p
        className="text-sm"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span className="font-medium text-[13px]">
          {deliveries.length}
        </span>{' '}
        total deliveries
      </p>

    </div>

    <div className="w-full sm:w-auto">
      <CreateDeliveryModal
        riders={riders}
        zones={zones}
        onCreated={handleCreated}
      />
    </div>

  </div>

  {/* FILTERS */}
  <div className="pt-1">
    <DeliveryFilters
      filter={filter}
      search={search}
      deliveryCount={deliveries.length}
      counts={counts}
      onFilterChange={handleFilterChange}
      onSearchChange={handleSearchChange}
    />
  </div>

  {/* TABLE */}
  <div className="pt-1">
    <DeliveryTable
      deliveries={paginated}
      riders={riders}
      loading={loading}
      filter={filter}
      page={page}
      totalPages={totalPages}
      total={filtered.length}
      perPage={PER_PAGE}
      onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      onPrev={() => setPage((p) => Math.max(1, p - 1))}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  </div>

</div>
  )
}