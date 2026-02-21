"use client";

import { useEffect, useState } from "react";
import { fetchNgoRequests } from "@/lib/adminApi";
import NgoRequestsTable from "@/component/admin/NgoRequestsTable";

export default function NgoRequestsPage() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchNgoRequests(page).then(setData).catch(console.error);
  }, [page]);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pending NGO Requests</h1>
      <NgoRequestsTable
        data={data.data}
        pagination={data.pagination}
        setPage={setPage}
      />
    </div>
  );
}
