"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import axios from "axios";

type DonorRequest = {
  _id: string;
  status: "open" | "accepted" | "rejected";
  quantityRequested: number;
  receiver: {
    name: string;
    email: string;
  };
  donation: {
    title: string;
    unit: string;
  };
};

export default function DonorRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<DonorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/request/donor");
        const data = await res.data;
        setRequests(data.requests);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <p className="p-6">Loading requests...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Incoming Requests</h1>

      {requests.length === 0 ? (
        <p className="text-muted-foreground">No requests received yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <Card key={req._id}>
              <CardHeader>
                <CardTitle>{req.donation.title}</CardTitle>
                
                <CardDescription>
                  Requested by {req.receiver.name}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Quantity:</span>{" "}
                  {req.quantityRequested} {req.donation.unit}
                </p>

                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className="capitalize">{req.status}</span>
                  
                </p>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() =>
                    router.push(`/dashboard/donor/requests/${req._id}`)
                  }
                >
                  View Request
                </Button>

                
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
