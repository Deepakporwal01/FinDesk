"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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
  const type = searchParams.get("type") || "total";

  const [emis, setEmis] = useState<EmiItem[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH EMI LIST
  ========================= */
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

  useEffect(() => {
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

      // Refresh list after update
      fetchEmis();
    } catch (error) {
      console.error("Failed to mark EMI as paid", error);
    }
  };

  /* =========================
     UI STATES
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading EMI list...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {type.replace("-", " ")} EMI Customers
      </h1>

      {emis.length === 0 ? (
        <p className="text-gray-500">No records found</p>
      ) : (
        <div className="space-y-4">
          {emis.map((emi, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
            >
              {/* LEFT SECTION */}
              <div>
                <p className="font-semibold text-gray-800">{emi.name}</p>

                <p className="text-sm text-gray-500">
                  {emi.model} • {emi.contact}
                </p>

                <p className="text-sm text-gray-500">
                  Due: {new Date(emi.dueDate).toDateString()}
                </p>

                {/* PAID DATE (ONLY IF PAID) */}
                {emi.status === "PAID" && emi.paidDate && (
                  <p className="text-sm text-green-600">
                    Paid on: {new Date(emi.paidDate).toDateString()}
                  </p>
                )}
              </div>

              {/* RIGHT SECTION */}
              <div className="text-right">
                <p className="font-bold text-lg">₹{emi.amount}</p>

                <span
                  className={`inline-block mt-1 text-sm px-3 py-1 rounded-full ${
                    emi.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {emi.status}
                </span>

                {/* MARK PAID BUTTON */}
                {emi.status === "PENDING" && (
                  <button
                    onClick={() => markAsPaid(emi.customerId, emi.emiIndex)}
                    className="block mt-2 text-sm px-4 py-1.5 rounded-lg
                               bg-green-600 text-white
                               hover:bg-green-700 transition"
                  >
                    Mark Paid
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
