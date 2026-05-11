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
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-black">Deliveries</h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: 'var(--text-secondary)' }}
          >
            {deliveries.length} total deliveries
          </p>
        </div>
        <CreateDeliveryModal
          riders={riders}
          zones={zones}
          onCreated={handleCreated}
        />
      </div>

      <DeliveryFilters
        filter={filter}
        search={search}
        deliveryCount={deliveries.length}
        counts={counts}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
      />

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
  )
}