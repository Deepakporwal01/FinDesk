"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalEmis: number;
  paidEmis: number;
  pendingEmis: number;
  dueToday: number;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/Pawanlogo.jpg"
              alt="Porwal Mobile"
              width={45}
              height={45}
              className="rounded-lg"
            />
            <h1 className="text-2xl font-bold text-green-600">
              Porwal Mobile
            </h1>
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            <Link
              href="/form"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              + Add Customer
            </Link>
            <Link
              href="/viewcustomers"
              className="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition"
            >
              View Customers
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard Cards */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total EMIs"
          value={stats?.totalEmis ?? "--"}
        />
        <DashboardCard
          title="Paid EMIs"
          value={stats?.paidEmis ?? "--"}
          color="green"
        />
        <DashboardCard
          title="Pending EMIs"
          value={stats?.pendingEmis ?? "--"}
          color="yellow"
        />
        <DashboardCard
          title="Due Today"
          value={stats?.dueToday ?? "--"}
          color="red"
        />
      </section>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 leading-tight">
            Admin Dashboard for <br />
            <span className="text-green-600">EMI & Customer Management</span>
          </h2>

          <p className="mt-4 text-gray-600 text-lg">
            Track EMI status, pending dues, and customer records in one place.
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src="/mobile-shop.png"
            alt="Mobile Store"
            width={400}
            height={300}
            className="rounded-xl shadow-lg"
          />
        </div>
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  color = "gray",
}: {
  title: string;
  value: number | string;
  color?: "gray" | "green" | "yellow" | "red";
}) {
  const colorMap = {
    gray: "bg-gray-100 text-gray-800",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p
        className={`mt-2 text-3xl font-bold inline-block px-4 py-2 rounded-lg ${colorMap[color]}`}
      >
        {value}
      </p>
    </div>
  );
}
