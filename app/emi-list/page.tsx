"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/* =========================
   TYPES
========================= */
interface EmiItem {
  customerId: string;
  emiIndex: number;
  name: string;
  contact: string;
  model: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: "PAID" | "PENDING";
}

/* =========================
   COMPONENT
========================= */
export default function EmiListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") || "total";

  const [emis, setEmis] = useState<EmiItem[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH EMI LIST
  ========================= */
  useEffect(() => {
    const fetchEmis = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/emi-list?type=${type}`);
        const data = await res.json();
        setEmis(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch EMI list", error);
        setEmis([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmis();
  }, [type]);

  /* =========================
     MARK EMI AS PAID
  ========================= */
  const markAsPaid = async (customerId: string, emiIndex: number) => {
    try {
      await fetch(`/api/customers/${customerId}/emi/${emiIndex}`, {
        method: "PUT",
      });
      // Re-fetch the EMI list after marking as paid
      const res = await fetch(`/api/emi-list?type=${type}`);
      const data = await res.json();
      setEmis(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to mark EMI as paid", error);
    }
  };

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading EMI list...
        </p>
      </div>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 py-8">
      
      {/* HEADER */}
      <div className="mb-8">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2
                     px-4 py-2 rounded-lg text-sm
                     bg-gray-900 text-white
                     hover:bg-gray-800 transition"
        >
          ← Back
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
          {type.replace("-", " ")} EMI Customers
        </h1>
        <p className="text-gray-500 mt-1">
          Track and manage customer EMI payments
        </p>
      </div>

      {/* EMPTY STATE */}
      {emis.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No EMI records found
        </div>
      ) : (
        <div className="space-y-5">
          {emis.map((emi, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-2xl border border-gray-100
                         shadow-sm hover:shadow-md transition-all duration-200
                         p-6 flex justify-between"
            >
              {/* STATUS STRIP */}
              <span
                className={`absolute left-0 top-0 h-full w-1.5 rounded-l-2xl ${
                  emi.status === "PAID"
                    ? "bg-green-500"
                    : "bg-yellow-400"
                }`}
              />

              {/* LEFT INFO */}
              <div className="pl-4 space-y-1">
                <p className="text-lg font-semibold text-gray-900">
                  {emi.name}
                </p>

                <p className="text-sm text-gray-500">
                  {emi.model} • {emi.contact}
                </p>

                <p className="text-sm text-gray-500">
                  Due on{" "}
                  <span className="font-medium text-gray-700">
                    {new Date(emi.dueDate).toDateString()}
                  </span>
                </p>

                {emi.status === "PAID" && emi.paidDate && (
                  <p className="text-sm font-medium text-green-600">
                    Paid on {new Date(emi.paidDate).toDateString()}
                  </p>
                )}
              </div>

              {/* RIGHT SECTION */}
              <div className="text-right flex flex-col justify-between items-end">
                <p className="text-2xl font-bold text-gray-900">
                  ₹{emi.amount}
                </p>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full mt-1 ${
                    emi.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {emi.status}
                </span>

                {emi.status === "PENDING" && (
                  <button
                    onClick={() =>
                      markAsPaid(emi.customerId, emi.emiIndex)
                    }
                    className="mt-3 px-5 py-2 text-sm font-semibold rounded-xl
                               bg-green-600 text-white
                               hover:bg-green-700 active:scale-95
                               transition-all"
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
