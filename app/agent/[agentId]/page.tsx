"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Customer {
  _id: string;
  name: string;
  contact?: string;
  imei: string;
  status: string;
  createdAt: string;
}

interface AgentData {
  agentName?: string;          // ✅ ADDED
  totalCustomers: number;
  totalSales: number;
  pendingCash: number;
  totalEmis: number;
  customers: Customer[];
}

export default function AgentDetailPage() {
  const { agentId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<AgentData | null>(null);

  useEffect(() => {
    fetch(`/api/agents/${agentId}`)
      .then((res) => res.json())
      .then(setData);
  }, [agentId]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-400">
        Loading agent customers...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* ================= HEADER ================= */}
        <div className="mb-10">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Agent Customers
          </h1>

          {/* ✅ AGENT NAME INDICATOR */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">
              Customers added by
            </span>
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
              {data.agentName || "Agent"}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Click a customer to view complete details
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          <Stat title="Customers" value={data.totalCustomers} color="indigo" />
          <Stat title="Total Sales ₹" value={data.totalSales} color="emerald" />
          <Stat title="Pending Cash ₹" value={data.pendingCash} color="amber" />
          <Stat title="Total EMIs" value={data.totalEmis} color="rose" />
        </div>

        {/* ================= CUSTOMER TABLE ================= */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-sm">
              <thead className="bg-gradient-to-r from-indigo-50 to-white text-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Contact</th>
                  <th className="px-6 py-4 text-left">IMEI</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Added</th>
                </tr>
              </thead>

              <tbody>
                {data.customers.map((c) => (
                  <tr
                    key={c._id}
                    onClick={() => router.push(`/viewcustomer/${c._id}`)}
                    className="group border-t cursor-pointer transition hover:bg-indigo-50/40"
                  >
                    <td className="px-6 py-4 text-gray-900 relative">
                      <span className="absolute left-0 top-0 h-full w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition" />
                      {c.name}
                    </td>

                    <td className="px-6 py-4 text-black">
                      {c.contact || "-"}
                    </td>

                    <td className="px-6 py-4 text-black">
                      {c.imei}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          c.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-black">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {data.customers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-14 text-center text-gray-400"
                    >
                      No customers found for this agent
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ================= COLORFUL STAT CARD ================= */
function Stat({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "indigo" | "emerald" | "amber" | "rose";
}) {
  const colorMap = {
    indigo: "from-indigo-50 to-white text-indigo-700",
    emerald: "from-emerald-50 to-white text-emerald-700",
    amber: "from-amber-50 to-white text-amber-700",
    rose: "from-rose-50 to-white text-rose-700",
  };

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-gradient-to-br ${colorMap[color]} p-5 shadow-sm`}
    >
      <p className="text-xs font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}
