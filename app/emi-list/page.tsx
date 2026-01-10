"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
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
  paidAmount: number;
  dueDate: string;
  paidDate: string | null;
  status: "PENDING" | "PARTIAL" | "PAID";
}

/* =========================
   INTERNAL CONTENT
========================= */
function EmiListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") || "total";

  const [emis, setEmis] = useState<EmiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [payAmount, setPayAmount] = useState<
    Record<number, number | undefined>
  >({});

  /* =========================
      FETCH EMI LIST
  ========================= */
  const fetchEmis = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/emi-list?type=${type}`);
      const data = await res.json();
      setEmis(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch EMI list", err);
      setEmis([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmis();
  }, [type]);

  /* =========================
      ADD PAYMENT
  ========================= */
  const payEmi = async (customerId: string, emiIndex: number) => {
    const amount = payAmount[emiIndex];

    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      await fetch(`/api/customers/${customerId}/emi/${emiIndex}/pay`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ amount }),
      });

      setPayAmount((prev) => ({
        ...prev,
        [emiIndex]: undefined,
      }));

      fetchEmis();
    } catch (err) {
      console.error("Payment failed", err);
    }
  };

  /* =========================
      DATE HELPER
  ========================= */
  const isOverdue = (emi: EmiItem) => {
    if (emi.status === "PAID") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(emi.dueDate);
    due.setHours(0, 0, 0, 0);

    return due < today;
  };

  /* =========================
      LOADING
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-700">
        Loading EMI list...
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
        <button
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 capitalize">
          {type.replace("-", " ")} EMI Customers
        </h1>
      </div>

      {emis.length === 0 ? (
        <div className="text-center text-gray-600 mt-20">
          No EMI records found
        </div>
      ) : (
        <div className="space-y-5">
          {emis.map((emi) => {
            const remaining = emi.amount - emi.paidAmount;
            const overdue = isOverdue(emi);

            return (
              <div
                key={`${emi.customerId}-${emi.emiIndex}`}   // ✅ FIXED KEY
                className={`relative rounded-2xl border border-gray-200 shadow-sm p-6 flex justify-between ${
                  overdue ? "bg-red-50" : "bg-white"
                }`}
              >
                {/* STATUS STRIP */}
                <span
                  className={`absolute left-0 top-0 h-full w-1.5 rounded-l-2xl ${
                    emi.status === "PAID"
                      ? "bg-green-500"
                      : overdue
                      ? "bg-red-500"
                      : emi.status === "PARTIAL"
                      ? "bg-blue-500"
                      : "bg-yellow-400"
                  }`}
                />

                {/* LEFT */}
                <div className="pl-4 space-y-1">
                  <p className="text-lg font-semibold text-gray-900">
                    {emi.name}
                  </p>

                  <p className="text-sm text-gray-700">
                    {emi.model} • {emi.contact}
                  </p>

                  <p className="text-sm text-gray-800">
                    Due: {new Date(emi.dueDate).toDateString()}
                  </p>

                  {overdue && (
                    <p className="text-xs font-semibold text-red-600">
                      ⚠ OVERDUE
                    </p>
                  )}

                  {emi.status !== "PENDING" && (
                    <p className="text-sm text-green-600">
                      Paid ₹{emi.paidAmount}
                    </p>
                  )}

                  {emi.status === "PAID" && emi.paidDate && (
                    <p className="text-sm text-green-700">
                      Completed on{" "}
                      {new Date(emi.paidDate).toDateString()}
                    </p>
                  )}

                  {emi.status !== "PAID" && (
                    <p className="text-xs text-red-600">
                      Remaining ₹{remaining}
                    </p>
                  )}
                </div>

                {/* RIGHT */}
                <div className="text-right flex flex-col gap-3 items-end">
                  <p className="text-xl font-bold text-gray-900">
                    ₹{emi.amount}
                  </p>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      emi.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : overdue
                        ? "bg-red-100 text-red-700"
                        : emi.status === "PARTIAL"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {overdue ? "OVERDUE" : emi.status}
                  </span>

                  {emi.status !== "PAID" && (
                    <>
                      <input
                        type="number"
                        placeholder={`Remaining ₹${remaining}`}
                        value={payAmount[emi.emiIndex] ?? ""}
                        onChange={(e) =>
                          setPayAmount((prev) => ({
                            ...prev,
                            [emi.emiIndex]:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          }))
                        }
                        className="
                          w-36 px-3 py-2 rounded-lg
                          border border-gray-300
                          bg-white
                          text-sm text-gray-900
                          placeholder:text-gray-500
                          focus:outline-none
                          focus:ring-2 focus:ring-gray-900/20
                          appearance-none
                          [&::-webkit-inner-spin-button]:appearance-none
                          [&::-webkit-outer-spin-button]:appearance-none
                          [-moz-appearance:textfield]
                        "
                      />

                      <button
                        onClick={() =>
                          payEmi(emi.customerId, emi.emiIndex)
                        }
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800"
                      >
                        Pay Now
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================
   EXPORT
========================= */
export default function EmiListPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <EmiListContent />
    </Suspense>
  );
}
