"use client";

import { useState } from "react";
import { verifyNgo } from "@/lib/adminApi";

export default function VerifyModal({ user, onClose }: any) {
  const [reason, setReason] = useState("");

  const handleAction = async (action: "approve" | "reject") => {
    await verifyNgo(user._id, action, reason);
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">
          Review {user.name}
        </h2>

        <textarea
          placeholder="Rejection reason (optional)"
          className="w-full border p-2 mb-4"
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => handleAction("reject")}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Reject
          </button>
          <button
            onClick={() => handleAction("approve")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
