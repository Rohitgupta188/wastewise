"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { StatCard } from "@/component/StatCard/StatCardUI";
import { Button } from "@/Components/ui/button";
import { http } from "@/lib/http";
import { Donation } from "@/types/donation";
import { ListingItem } from "@/component/ListingItem/ListingCardUI";
import { Navbar } from "@/component/DonorNavbar/Navbar";

export default function DonorDashboard() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchDonations = async () => {
      try {
        const res = await http.get("/donation");

        if (!mounted) return;

        setDonations(res.data.donations || []);
      } catch (err) {
        if (!mounted) return;
        setError("Failed to load donations");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    Promise.resolve().then(fetchDonations);

    return () => {
      mounted = false;
    };
  }, []);

  const analytics = useMemo(() => {
    const active = donations.filter((d) => d.status === "listed").length;
    const total = donations.reduce((acc, d) => acc + d.quantity, 0);
    const helped = donations.filter((d) => d.status === "delivered").length;

    return { active, total, helped };
  }, [donations]);

  if (loading) return <DashboardSkeleton />;
  if (error)
    return (
      <h1 className="text-center text-red-500 py-20">
        Failed to load dashboard.
      </h1>
    );

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8 text-slate-900">
          Donor Dashboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard title="Active Listings" value={analytics.active} />
          <StatCard title="Food Rescued (kg)" value={analytics.total} />
          <StatCard title="NGOs Helped" value={analytics.helped} />
        </div>

        <div className="flex gap-4 mb-8">
          <Link href="/dashboard/donor/create">
            <Button className="shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Post Donation
            </Button>
          </Link>
        </div>

        {donations.length === 0 ? (
          <h2 className="text-center text-slate-400 py-20 border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
            No donations yet. Start by creating one.
          </h2>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
            {donations.map((d) => (
              <ListingItem key={d._id} donation={d} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
      <div className="animate-pulse">Loading dashboard analytics...</div>
    </div>
  );
}
