"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Customer {
  _id: string;
  name: string;
  fatherName: string;
  contact: string;
  model: string;
  imei: string;
  price: number;
  emiAmount: number;
  downPayment: number;
  emiDetails: [];
}

export default function ViewCustomers() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const res = await fetch("/api/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : null;

        if (!res.ok) {
          throw new Error(data?.error || "Failed to fetch customers");
        }

        setCustomers(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  /* ================= DELETE CUSTOMER ================= */
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to delete customer");
      }

      // ✅ Remove from UI
      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      alert(err.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading customers...
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200 px-4 sm:px-6 py-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <button
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 rounded-lg text-sm
                     bg-neutral-900 text-white
                     hover:bg-neutral-800 transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl sm:text-4xl font-semibold text-neutral-900">
          Customers
        </h1>
        <p className="mt-2 text-neutral-500">
          Manage and view customer information
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {customers.map((c) => {
          const initials = c.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={c._id}
              className="relative group rounded-2xl bg-white
                         border border-neutral-200 p-6
                         shadow-sm hover:shadow-lg
                         transition-all hover:-translate-y-1"
            >
              {/* 🗑 DELETE ICON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(c._id);
                }}
                disabled={deletingId === c._id}
                className="absolute top-3 right-3 text-xl text-red-500
                           hover:text-red-600 transition
                           disabled:opacity-50 cursor-pointer"
                title="Delete customer"
              >
                🗑
              </button>

              {/* CARD CONTENT (LINK) */}
              <Link href={`/viewcustomer/${c._id}`} className="block">
                <div className="flex items-center gap-4">
                  <div
                    className="h-12 w-12 rounded-xl bg-neutral-800
                               flex items-center justify-center
                               text-white font-medium"
                  >
                    {initials}
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-neutral-900">
                      {c.name}
                    </h2>
                    <p className="text-sm text-neutral-500">{c.model}</p>
                  </div>
                </div>

                <div className="my-5 h-px bg-neutral-200" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">{c.contact}</span>

                  <span
                    className="text-sm font-medium text-neutral-900 opacity-0
                               group-hover:opacity-100 transition"
                  >
                    View →
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {customers.length === 0 && (
        <div className="text-center text-neutral-500 mt-20">
          No customers found
        </div>
      )}
    </div>
  );
}
