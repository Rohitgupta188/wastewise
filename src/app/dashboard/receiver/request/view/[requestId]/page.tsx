"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

import axios from "axios";

type RequestStatus = "open" | "accepted" | "rejected";

interface RequestType {
  _id: string;
  status: RequestStatus;
}

type OrderStatus =
  | "created"
  | "pickup_scheduled"
  | "picked_up"
  | "delivered";

interface OrderType {
  _id: string;
  receiver: string;
  status: OrderStatus;
}


const ReceiverRequestDetailsPage: React.FC = () => {
  const params = useParams<{ requestId: string }>();
  const requestId = params?.requestId;

  const [request, setRequest] = useState<RequestType | null>(null);
  const [order, setOrder] = useState<OrderType | null>(null);
  const [pickupTime, setPickupTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");


  const fetchData = useCallback(async (): Promise<void> => {
    if (!requestId) return;

    try {
      
      setPageLoading(true);
      setError("");

      const [requestRes, orderRes] = await Promise.all([
        axios.get<{ request: RequestType }>(`/api/request/view/${requestId}`),
        axios.get<{ order: OrderType | null }>(`/api/order/by-request/${requestId}`),
      ]);

      
      setRequest(requestRes.data.request ?? null);
      setOrder(orderRes.data.order ?? null);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err?.response?.data?.error || "Failed to load data");
    } finally {
      setPageLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  useEffect(() => {
    if (order) {
      console.log("Order updated and ready:", order);
    }
  }, [order]);

 
  const handleSchedulePickup = async (): Promise<void> => {
    if (!pickupTime || !order) {
      alert("Please select a pickup time");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`/api/order/${order._id}/schedule`, { pickupTime });
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to schedule pickup");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async (): Promise<void> => {
    if (!order) return;
    try {
      setLoading(true);
      await axios.post(`/api/order/${order._id}/delivery`);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to confirm delivery");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Loading details...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg">
        
        <p className="text-red-700 font-semibold">Error: {error}</p>
        <button 
          onClick={() => fetchData()} 
          className="mt-4 text-sm text-red-600 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Request not found.
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Request Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Request Status: <span className="font-bold text-blue-600 uppercase tracking-wide text-sm">{request.status}</span>
        </p>
        <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Refresh Status
            </button>
      </header>

      {order ? (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Order Tracking</h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-bold uppercase">
                ID: {order._id.slice(-6)}
              </span>
            </div>

            {/* Render based on Order Status */}
            <div className="space-y-4">
              {order.status === "created" && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-blue-800 text-sm mb-3 font-medium">Step 1: Schedule your pickup</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="datetime-local"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="flex-1 border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={handleSchedulePickup}
                      disabled={loading || !pickupTime}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 transition-all active:scale-95"
                    >
                      {loading ? "Processing..." : "Confirm Time"}
                    </button>
                  </div>
                </div>
              )}

              {order.status === "pickup_scheduled" && (
                <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse mr-3" />
                  <p>Pickup is scheduled. Waiting for the donor to hand over items.</p>
                </div>
              )}

              {order.status === "picked_up" && (
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                  <p className="text-green-800 mb-4 font-medium">The items are in transit. Have you received them?</p>
                  <button
                    onClick={handleConfirmDelivery}
                    disabled={loading}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-md font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                  >
                    {loading ? "Confirming Receipt..." : "Confirm Delivery Receipt"}
                  </button>
                </div>
              )}

              {order.status === "delivered" && (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">🎉</div>
                  <h3 className="text-lg font-bold text-green-700">Donation Complete!</h3>
                  <p className="text-gray-500 text-sm">Thank you for confirming the delivery.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-10 border-2 border-dashed rounded-xl text-center text-gray-400">
          Waiting for an order to be generated for this request...
        </div>
      )}
    </div>
  );
};

export default ReceiverRequestDetailsPage;