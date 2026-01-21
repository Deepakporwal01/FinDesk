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
  penalty?: number; // ✅ ADDED
  paidAmount: number;
  dueDate: string;
  paidDate: Date | null;
  status: "PENDING" | "PARTIAL" | "PAID";
  payments?: {
    amount: number;
    date: string;
  }[];
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

  const [penaltyAmount, setPenaltyAmount] = useState<
    Record<number, number | undefined>
  >({}); // ✅ ADDED

  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  /* =========================
      FETCH EMI LIST
  ========================= */
  const fetchEmis = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/emi-list?type=${type}&search=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setEmis(Array.isArray(data) ? data : []);
    } catch {
      setEmis([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmis(searchQuery);
  }, [type, searchQuery]);

  /* =========================
      ADD PAYMENT
  ========================= */
  const payEmi = async (customerId: string, emiIndex: number) => {
    const amount = payAmount[emiIndex];

    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

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

    fetchEmis(searchQuery);
  };

  /* =========================
      ADD PENALTY (NEW)
  ========================= */
  const addPenalty = async (customerId: string, emiIndex: number) => {
    const amount = penaltyAmount[emiIndex];

    if (!amount || amount <= 0) {
      alert("Enter valid penalty amount");
      return;
    }
 
    await fetch(
      `/api/customers/${customerId}/emi/${emiIndex}/penalty`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ penalty: amount }),
      }
    );

    setPenaltyAmount((prev) => ({
      ...prev,
      [emiIndex]: undefined,
    }));

    fetchEmis(searchQuery);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-700">
        Loading EMI list...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 capitalize">
          {type.replace("-", " ")} EMI Customers
        </h1>

        <div className="relative mt-4 w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name or mobile number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm text-black"
          />
          <button
            onClick={() => setSearchQuery(search)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            🔍
          </button>
        </div>
      </div>

      {emis.length === 0 ? (
        <div className="text-center text-gray-600 mt-20">
          No EMI records found
        </div>
      ) : (
        <div className="space-y-5">
          {emis.map((emi) => {
            const overdue = isOverdue(emi);
 
            const remaining =
              emi.amount +
              (emi.penalty || 0) -
              emi.paidAmount; // ✅ UPDATED

            return (
              <div
                key={`${emi.customerId}-${emi.emiIndex}`}
                onClick={() =>
                  router.push(`/viewcustomer/${emi.customerId}`)
                }
                className={`relative rounded-2xl border border-gray-200 shadow-sm p-6 flex justify-between ${
                  overdue ? "bg-red-50" : "bg-white"
                }`}
              >
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
                    Name : {emi.name}
                  </p>
                  <p className="text-md text-gray-700">
                    Model: {emi.model}
                  </p>
                  <p className="text-md text-black">
                    Contact Number : <b>{emi.contact}</b>
                  </p>
                  <p className="text-sm text-gray-800">
                    Due Date:{" "}
                    {new Date(emi.dueDate).toDateString()}
                  </p>

                  {overdue && (
                    <p className="text-sm font-semibold text-red-600">
                      ⚠ OVERDUE
                    </p>
                  )}

                  {emi.payments?.map((p, i) => (
                    <p key={i} className="text-green-600">
                      Paid ₹{p.amount} on{" "}
                      {new Date(p.date).toDateString()}
                    </p>
                  ))}

                  {emi.status !== "PAID" && (
                    <p className="text-sm text-red-600">
                      Remaining Amount ₹ : {remaining}
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
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          setPayAmount((prev) => ({
                            ...prev,
                            [emi.emiIndex]:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          }))
                        }
                        className="w-36 px-3 py-2 rounded-lg border border-black bg-white text-sm text-black"
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          payEmi(
                            emi.customerId,
                            emi.emiIndex
                          );
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-800"
                      >
                        Pay Now
                      </button>

                      {/* ✅ ADD PENALTY (ONLY OVERDUE) */}
                      {overdue && (
                        <>
                          <input
                            type="number"
                            placeholder="Penalty ₹"
                            value={
                              penaltyAmount[emi.emiIndex] ??
                              ""
                            }
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            onChange={(e) =>
                              setPenaltyAmount((prev) => ({
                                ...prev,
                                [emi.emiIndex]:
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value),
                              }))
                            }
                            className="w-36 px-3 py-2 rounded-lg border border-black bg-white text-sm text-black"
                          />

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addPenalty(
                                emi.customerId,
                                emi.emiIndex
                              );
                            }}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-800"
                          >
                            Add Penalty
                          </button>
                        </>
                      )}
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
