"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CustomerRequest {
  _id: string;
  name: string;
  contact: string;
  model: string;
  imei: string;
  createdAt: string;
  supplier?: string;
  supplierNumber?: string;
}

export default function RequestsPage() {
  const router = useRouter();

  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  /* ============================
     FETCH REQUESTS
  ============================ */
  useEffect(() => {
    let mounted = true;

    const loadRequests = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch("/api/customers/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setError("Unauthorized or failed to fetch");
          return;
        }

        const data = await res.json();
        if (mounted) setRequests(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setError("Failed to load requests");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadRequests();
    return () => {
      mounted = false;
    };
  }, [router]);

  /* ============================
     APPROVE / REJECT
  ============================ */
  const handleAction = async (
    customerId: string,
    action: "APPROVE" | "REJECT"
  ) => {
    setActionLoading(customerId);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `/api/customers/${customerId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        }
      );

      if (!res.ok) {
        alert("Action failed");
        return;
      }

      setRequests((prev) =>
        prev.filter((r) => r._id !== customerId)
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* ============================
     STATES
  ============================ */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading requests…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  /* ============================
     UI
  ============================ */
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-black"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Requests
          </h1>
          <div />
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-xl py-24 text-center text-gray-500 shadow">
            No pending requests
          </div>
        ) : (
          <div className="grid gap-5">
            {requests.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:shadow-md transition"
              >
                {/* LEFT INFO */}
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-gray-900">
                    {c.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    {c.model} • {c.contact}
                  </p>

                  <p className="text-xs text-gray-400">
                    IMEI: {c.imei}
                  </p>

                  <p className="text-xs text-gray-400">
                    Requested on{" "}
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>

                  {/* AGENT INFO */}
                  <div className="mt-2 inline-flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                 Agent Name: {c.supplier} Agent Number{" "}
                    {c.supplierNumber}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">
                  <button
                    disabled={actionLoading === c._id}
                    onClick={() =>
                      handleAction(c._id, "APPROVE")
                    }
                    className="px-5 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    ✔ Approve
                  </button>

                  <button
                    disabled={actionLoading === c._id}
                    onClick={() =>
                      handleAction(c._id, "REJECT")
                    }
                    className="px-5 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50"
                  >
                    ✖ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
