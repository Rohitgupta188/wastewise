"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { http } from "@/lib/http";
import { Clock, MapPin, Utensils} from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Dialog, DialogContent, DialogFooter } from "@/Components/ui/dialog";
import { Card, CardContent, CardFooter, CardTitle } from "@/Components/ui/card";
import { Donation } from "@/types/donation";
import { StatCard } from "@/component/StatCard/StatCardUI";
import { Navbar } from "@/component/Receiver/Navbar";



function normalizeDonation(d: any): Donation {
  return {
    _id: String(d._id),
    title: d.title ?? "Untitled Donation",
    foodType: d.foodType ?? "Food",
    quantity: Number(d.quantity ?? 0),
    unit: d.unit ?? "kg",
    area: d.area ?? "Unknown",
    pickupWindow: d.pickupWindow ?? "",
    description: d.description ?? "",
    donorName: d.donorName ?? "Verified Donor",
    urgent: Boolean(d.urgent),
    photos: d.photos,
    status: d.status,
  };
}

export default function ReceiverDonationsPage() {
  const router = useRouter();

  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  const mountedRef = useRef(true);
  const fetchDonations = async () => {
    try {
      const { data } = await http.get("/request/getAllItemForReceiver");
      if (!mountedRef.current) return;
      const safe = Array.isArray(data?.donations)
        ? data.donations.map(normalizeDonation)
        : [];
      setDonations(safe);
      console.log(safe);
    } catch (err: any) {
      if (!mountedRef.current) return;
      if (err?.response?.status === 401) {
        router.replace("/sign-in");
        return;
      }
      console.error("Donation fetch failed:", err);
      setDonations([]);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    fetchDonations();
    return () => {
      mountedRef.current = false;
    };
  }, [router]);

  const handleConfirmRequest = async () => {
    if (!selectedDonation || submitting) return;
    setSubmitting(true);
    router.push(`/dashboard/receiver/request/create/${selectedDonation._id}`);
  };

  const analytics = useMemo(() => {
    const active = donations.filter((d) => d.status === "delivered").length;
    const total = donations.reduce((acc, d) => acc + d.quantity, 0);

    return { active, total };
  }, [donations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Loading details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F6] font-sans text-slate-800">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1A4D2E]">
              Receiver Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome, Green Earth Foundation! Discover nearby surplus and
              manage your pickups.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard title="Active Listings" value={analytics.active} />
          <StatCard title="Food Rescued (kg)" value={analytics.total} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg shadow-sm">
            <Button
              onClick={fetchDonations}
              variant="ghost"
            >
              Refresh Status
            </Button>
            <Button className="bg-[#1A4D2E] hover:bg-[#153e25] text-white text-sm h-9 px-4 rounded-md shadow-sm">
              Browse Surplus
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        ) : donations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No donations available right now.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {donations.map((d) => (
              <Card
                key={`${d._id}-${d.title}`}
                className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group bg-white rounded-xl flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {d.photos ? (
                    <img
                      src={d.photos}
                      alt={d.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Utensils size={28} className="text-slate-300" />
                  )}

                  <div className="relative top-3 left-3 flex flex-wrap gap-2">
                    {d.urgent && (
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-sm px-2 py-0.5 text-xs">
                        Urgent Pickup
                      </Badge>
                    )}
                    <Badge className="bg-green-600 hover:bg-green-700 text-white border-none shadow-sm px-2 py-0.5 text-xs flex items-center gap-1">
                      Verified
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5 flex-1 space-y-3">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
                      {d.title}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1.5 font-medium">
                      {d.quantity}+ Items (Approx {d.quantity} {d.unit})
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-1.5 truncate max-w-[50%]">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">{d.area}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-orange-600 font-semibold whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5" />
                      {d.pickupWindow || "By 7:00 PM"}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-5 pt-0">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 rounded-lg shadow-sm"
                    onClick={() => setSelectedDonation(d)}
                  >
                    View & Request
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog
        open={!!selectedDonation}
        onOpenChange={(open) =>
          !open && !submitting && setSelectedDonation(null)
        }
      >
        <DialogContent className="sm:max-w-137.5 p-0 overflow-hidden gap-0 bg-white rounded-2xl border-none shadow-2xl">
          {selectedDonation && (
            <>
              <div className="relative h-52 w-full">
                {selectedDonation.photos ? (
                  <img
                    src={selectedDonation.photos}
                    alt={selectedDonation.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Utensils size={28} className="text-slate-300" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h2 className="text-white text-2xl font-bold leading-none mb-1">
                    {selectedDonation.title}
                  </h2>
                  <p className="text-gray-300 text-sm flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> {selectedDonation.area}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 transition"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">
                      Quantity
                    </p>
                    <p className="font-semibold text-gray-800 text-base">
                      {selectedDonation.quantity} {selectedDonation.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      Serves approx {selectedDonation.quantity * 2} people
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">
                      Donor
                    </p>
                    <p className="font-semibold text-gray-800 text-base">
                      {selectedDonation.donorName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">
                      Pickup Window
                    </p>
                    <p className="font-semibold text-orange-600 text-base flex items-center gap-1">
                      <Clock className="w-4 h-4" />{" "}
                      {selectedDonation.pickupWindow || "Until 8:00 PM"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">
                      Reliability
                    </p>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200 bg-green-50"
                    >
                      High (98%)
                    </Badge>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-bold block mb-2">
                    Special Notes for Recipient
                  </label>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedDonation.description ||
                      "Please bring your own containers for collection. Call upon arrival."}
                  </p>
                </div>
              </div>

              <DialogFooter className="p-6 pt-0 flex gap-3 sm:justify-between bg-white">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 h-11"
                  onClick={() => setSelectedDonation(null)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-2 bg-[#1A4D2E] hover:bg-[#143d24] text-white h-11 text-base shadow-lg shadow-green-900/10"
                  onClick={handleConfirmRequest}
                  disabled={submitting}
                >
                  {submitting ? "Processing..." : "Confirm Request"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
