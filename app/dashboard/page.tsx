import Link from "next/link"
import { getDashboardStats } from "@/lib/dashboard"
import StatCards from "@/components/dashboard/StatCards"
import RecentDeliveries from "@/components/dashboard/RecentDeliveries"
import AIBriefing from "@/components/dashboard/AIBriefing"

export default async function DashboardPage() {
  const { stats, recentDeliveries } = await getDashboardStats()

  return (
    <div className="min-h-screen bg-black pt-16 lg:pt-6">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">

        {/* HEADER */}
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">

          <div className="space-y-4">

            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">
                Logistics Control Center
              </p>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.06em] text-white">
                Operations Overview
              </h1>

              <p className="text-sm text-white/50 max-w-md">
                Real-time tracking of deliveries, dispatch flow, and system performance
              </p>
            </div>

            <p className="text-xs text-white/40">
              {new Date().toLocaleDateString("en-NG", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>

          </div>

          <Link
            href="/dashboard/deliveries"
            className="
              w-full sm:w-auto
              inline-flex items-center justify-center -translate-y-12

              rounded-2xl
              bg-white/10
              border border-white/10
              backdrop-blur-xl

              px-5 py-3
              text-sm font-medium text-white

              transition
              hover:bg-white/15
              hover:border-white/20
              hover:shadow-[0_0_25px_rgba(255,255,255,0.08)]
            "
          >
            New Delivery
            <span className="ml-2 text-white/40">→</span>
          </Link>

        </div>

        {/* KPI SECTION */}
        <section className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">
            System Metrics
          </p>
          <StatCards stats={stats} />
        </section>

        {/* AI SECTION */}
        <section className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">
            Intelligence Layer
          </p>
          <AIBriefing />
        </section>

        {/* DELIVERIES */}
        <section className="space-y-4 pb-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">
            Recent Activity
          </p>
          <RecentDeliveries deliveries={recentDeliveries} />
        </section>

      </div>
    </div>
  )
}