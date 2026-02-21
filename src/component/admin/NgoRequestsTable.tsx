"use client";

import { useState } from "react";
import VerifyModal from "./VerifyModal";

export default function NgoRequestsTable({ data, pagination, setPage }: any) {
  const [selectedUser, setSelectedUser] = useState<any>(null);

  return (
    <div className="bg-white rounded shadow p-4">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th>Name</th>
            <th>Email</th>
            <th>Documents</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ngo: any) => (
            <tr key={ngo._id} className="border-b">
              <td>{ngo.name}</td>
              <td>{ngo.email}</td>
              <td>
                {ngo.documents.map((doc: string, i: number) => (
                  <a
                    key={i}
                    href={doc}
                    target="_blank"
                    className="text-blue-600 block"
                  >
                    View Document {i + 1}
                  </a>
                ))}
              </td>
              <td>
                <button
                  onClick={() => setSelectedUser(ngo)}
                  className="bg-black text-white px-3 py-1 rounded"
                >
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button onClick={() => setPage(pagination.page - 1)} disabled={pagination.page === 1}>
          Previous
        </button>
        <button
          onClick={() => setPage(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
        >
          Next
        </button>
      </div>

      {selectedUser && (
        <VerifyModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
