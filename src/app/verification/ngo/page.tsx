"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { http } from "@/lib/http";
import { Button } from "@/Components/ui/button";

export default function NgoVerificationPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    try {
      const res = await http.get("/verification/status");
      setStatus(res.data.NGOStatus);
    } catch (err) {
      console.error("Failed to fetch status");
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    
    const validFiles = selectedFiles.filter(
      (file) =>
        file.type === "application/pdf" || file.type.startsWith("image/"),
    );

    if (validFiles.length !== selectedFiles.length) {
      setError("Only PDF or image files are allowed.");
      return;
    }

    setFiles(validFiles);
    setError("");
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError("Please upload at least one document.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("documents", file);
      });

      await axios.post("/api/verification/ngo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("pending");
    } catch (err: any) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
    console.log(status);
    if (!status) return <p>Loading...</p>;
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <Button variant="default" onClick={fetchStatus}>
        refesh{" "}
      </Button>
      <h1 className="text-2xl font-semibold mb-4">NGO Verification</h1>

      <p className="text-sm text-gray-600 mb-4">
        Upload registration certificate, trust deed, or other official
        documents.
      </p>

      <input
        type="file"
        multiple
        accept="application/pdf,image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Submit for Verification"}
      </button>
      {status === "pending" && (
        <p className="text-yellow-600">Your documents are under review.</p>
      )}

      {status === "verified" && (
        <button
          onClick={() => router.replace("/dashboard/receiver/request")}
          className="w-full bg-black text-white py-2 rounded"
        >
          Go to Dashboard
        </button>
      )}
    </div>
  );
}
