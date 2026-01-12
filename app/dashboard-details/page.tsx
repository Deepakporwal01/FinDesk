"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardCard from "../dashboard/page";
import TopDefaulters from "../dashboard/TopDefaulters/page";
import SalesGrowthChart from "../dashboard/SalesGrowth/page";
import EmiStatusDonut from "../dashboard/emiStatusDonut/page";

interface DashboardStats {
  totalCustomers: number;
  totalSales: number;
  totalCashReceived: number;
  pendingCash: number;

  totalEmis: number;
  paidEmis: number;
  pendingEmis: number;
  partialEmis: number;
  overdueEmis: number;
  dueToday: number;

  monthlySales: Record<string, number>;
  monthlyCash: Record<string, number>;

  topDefaulters: {
    name: string;
    contact: string;
    pendingAmount: number;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/emi-stats")
      .then((res) => res.json())
      .then(setStats)
      .catch((err) => console.error("Dashboard fetch failed", err));
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ================= HEADER ================= */}
        <div className="mb-12">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Business & EMI performance overview
          </p>
        </div>

        {/* ================= KPI CARDS ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Total Customers" value={stats.totalCustomers} />
          <DashboardCard
            title="Total Sales ₹"
            value={stats.totalSales}
            color="green"
          />
          <DashboardCard
            title="Cash Received ₹"
            value={stats.totalCashReceived}
            color="blue"
          />
          <DashboardCard
            title="Pending Cash ₹"
            value={stats.pendingCash}
            color="yellow"
          />
        </div>

        {/* ===== SECTION DIVIDER ===== */}
        <div className="relative my-14">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-500" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-4 text-md font-medium text-black">
              EMI Overview
            </span>
          </div>
        </div>

        {/* ================= EMI STATS ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6">
          <DashboardCard title="Total EMIs" value={stats.totalEmis} />
          <DashboardCard title="Paid EMIs" value={stats.paidEmis} color="green" />
          <DashboardCard
            title="Partial EMIs"
            value={stats.partialEmis}
            color="blue"
          />
          <DashboardCard
            title="Pending EMIs"
            value={stats.pendingEmis}
            color="yellow"
          />
          <DashboardCard title="Due Today" value={stats.dueToday} color="red" />
          <DashboardCard
            title="Overdue EMIs"
            value={stats.overdueEmis}
            color="overdue"
          />
        </div>

        {/* ===== SECTION DIVIDER ===== */}
        <div className="relative my-14">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-500" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-4 text-md font-medium text-black">
              Analytics & Insights
            </span>
          </div>
        </div>

        {/* ================= ANALYTICS ================= */}
        <div className="grid lg:grid-cols-3 gap-8">
          <EmiStatusDonut
            paid={stats.paidEmis}
            partial={stats.partialEmis}
            pending={stats.pendingEmis}
            overdue={stats.overdueEmis}
          />

          <SalesGrowthChart
            monthlySales={stats.monthlySales}
            monthlyCash={stats.monthlyCash}
          />

          <TopDefaulters defaulters={stats.topDefaulters || []} />
        </div>
      </div>
    </section>
  );
}
