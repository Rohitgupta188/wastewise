"use client";

import { useEffect, useState } from "react";
import { fetchDashboardMetrics } from "@/lib/adminApi";
import MetricsCards from "@/component/admin/MetricsCards";
import { requireAdmin } from "@/lib/adminGuard";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  

  useEffect(() => {
    fetchDashboardMetrics().then(setMetrics).catch(console.error);
  }, []);

  if (!metrics) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <MetricsCards metrics={metrics.metrics} />
    </div>
  );
}
