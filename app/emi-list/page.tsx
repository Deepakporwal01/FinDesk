"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface EmiItem {
  customerId: string;
  name: string;
  contact: string;
  model: string;
  amount: number;
  dueDate: string;
  status: "PAID" | "PENDING";
}

export default function EmiListPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [emis, setEmis] = useState<EmiItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmis = async () => {
      const res = await fetch(`/api/admin/emi-list?type=${type}`);
      const data = await res.json();
      setEmis(data);
      setLoading(false);
    };

    fetchEmis();
  }, [type]);

  if (loading) {
    return <div className="p-6">Loading EMI list...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {type} EMI Customers
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
              <div>
                <p className="font-semibold">{emi.name}</p>
                <p className="text-sm text-gray-500">
                  {emi.model} • {emi.contact}
                </p>
                <p className="text-sm text-gray-500">
                  Due: {new Date(emi.dueDate).toDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold">₹{emi.amount}</p>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    emi.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {emi.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
