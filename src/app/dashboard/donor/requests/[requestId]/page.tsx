"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import Link from "next/link";

type RequestData = {
  _id: string;
  status: "open" | "accepted" | "rejected";
  quantityRequested: number;
  message?: string;
  receiver: {
    name: string;
    email: string;
  };
  donation: {
    title: string;
    quantity: number;
    unit: string;
  };
};

type OrderData = {
  _id: string;
  status:
    | "created"
    | "pickup_scheduled"
    | "picked_up"
    | "delivered"
    | "cancelled";
  pickupTime?: string;
};

export default function DonorRequestActionPage() {
  const { requestId } = useParams<{ requestId: string }>();
  console.log(requestId);

  const router = useRouter();

  const [request, setRequest] = useState<RequestData | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequest = async () => {
    try {

      const res = await axios.get(`/api/request/${requestId}`)
      const data = res.data

      console.log(data)
      setRequest(data.request)

      
      try {
        const orderRes = await axios.get(
          `/api/order/by-request/${data.request._id}`
        )

        setOrder(orderRes.data.order)
      } catch (orderErr: any) {
        if (orderErr.response?.status !== 404) {
          throw orderErr
        }
      }

    } catch (err: any) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }
useEffect(() => {


  if (requestId) fetchRequest()
}, [requestId])


const handleAction = async (action: "accept" | "reject") => {
  if (!request) return

  setActionLoading(true)
  setError(null)

  try {
    const res = await axios.post(`/api/request/actions/${request._id}`, {
      action,
    })

    const data = res.data
    setRequest(data.request)

  } catch (err: any) {
    setError(err.response?.data?.error || "Action failed")
  } finally {
    setActionLoading(false)
  }
}


  if (loading) {
    return <p className="p-6">Loading request...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!request) return null;

  return (
    <section className="flex justify-center p-6">
      <Card className="w-full max-w-lg">
        <Button variant="default">
            <Link href="/dashboard/donor">Home</Link>
        </Button>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>Review receiver request</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <p>
            <span className="font-medium">Donation:</span>{" "}
            {request.donation.title}
          </p>

          <p>
            <span className="font-medium">Requested Quantity:</span>{" "}
            {request.quantityRequested} {request.donation.unit}
          </p>

          <p>
            <span className="font-medium">Receiver:</span>{" "}
            {request.receiver.name} ({request.receiver.email})
          </p>

          {request.message && (
            <p>
              <span className="font-medium">Message:</span> {request.message}
            </p>
          )}

          <p>
            <span className="font-medium">Status:</span>{" "}
            <span className="capitalize">{request.status}</span>
          </p>
          <button
              onClick={fetchRequest}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Refresh Status
            </button>


          {request.status === "accepted" && order && (
            <div className="border-t pt-3 space-y-2">
              <p className="font-medium">Logistics Status</p>

              {order.status === "created" && (
                <p className="text-muted-foreground">
                  Waiting for receiver to schedule pickup
                </p>
              )}

              {order.status === "pickup_scheduled" && (
                <Button
                  className="w-full"
                  onClick={async () => {
                    await fetch(`/api/order/${order._id}/pickup`, {
                      method: "POST",
                    });
                    router.refresh();
                  }}
                >
                  Confirm Pickup
                </Button>
              )}

              {order.status === "picked_up" && (
                <span className="inline-block rounded bg-yellow-100 px-2 py-1 text-xs">
                  Picked up
                </span>
              )}

              {order.status === "delivered" && (
                <span className="inline-block rounded bg-green-100 px-2 py-1 text-xs">
                  Delivered successfully
                </span>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button
            className="w-full"
            disabled={request.status !== "open" || actionLoading}
            onClick={() => handleAction("accept")}
          >
            Accept
          </Button>

          <Button
            variant="outline"
            className="w-full"
            disabled={request.status !== "open" || actionLoading}
            onClick={() => handleAction("reject")}
          >
            Reject
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
