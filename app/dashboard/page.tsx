import Link from "next/link";
import { getDashboardStats } from "@/lib/dashboard";
import StatCards from "@/components/dashboard/StatCards";
import RecentDeliveries from "@/components/dashboard/RecentDeliveries";

export default async function DashboardPage() {
  const { stats, recentDeliveries } = await getDashboardStats();
  console.log("Dashboard deliveries:", recentDeliveries);

  return (
    <div className="pt-14 lg:pt-0 sidebar-bg">
      <div className="page-header">
        <div>
          <h1 className="text-[27px] font-black " style={{color: "var(--alt-bg)"}}>Overview</h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            <span
              className="text-sm mt-0.5 block"
              style={{ color: "var(--text-secondary)" }}
            >
              {new Date().toISOString().split("T")[0]}
            </span>
          </p>
        </div>
        <Link href="/dashboard/deliveries" className="btn-primary">
          New Delivery
        </Link>
      </div>

      <StatCards stats={stats} />
      
      <RecentDeliveries deliveries={recentDeliveries} />
    </div>
  );
}
