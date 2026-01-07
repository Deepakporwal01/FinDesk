"use client";

import Image from "next/image";
import Link from "next/link";
import DashboardCard from "@/app/dashboard/page";
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
      const res = await fetch("/api/emi-stats");
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* LOGO */}
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Image
              src="/Pawanlogo.jpg"
              alt="Porwal Mobile"
              width={42}
              height={42}
              className="rounded-lg"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-green-600">
              Porwal Mobile
            </h1>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-2">
            <Link
              href="/form"
              className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-700 transition"
            >
              + Add Customer
            </Link>

            <Link
              href="/viewcustomer"
              className="border border-green-600 text-green-600 px-4 py-2 text-sm rounded-lg hover:bg-green-50 transition"
            >
              View Customers
            </Link>

            <Link
              href="/dashboard-details"
              className="border border-green-600 text-green-600 px-4 py-2 text-sm rounded-lg hover:bg-green-50 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* DASHBOARD CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link href="/emi-list?type=total">
          <DashboardCard title="Total EMIs" value={stats?.totalEmis ?? "--"} />
        </Link>

        <Link href="/emi-list?type=paid">
          <DashboardCard
            title="Paid EMIs"
            value={stats?.paidEmis ?? "--"}
            color="green"
          />
        </Link>

        <Link href="/emi-list?type=pending">
          <DashboardCard
            title="Pending EMIs"
            value={stats?.pendingEmis ?? "--"}
            color="yellow"
          />
        </Link>

        <Link href="/emi-list?type=due-today">
          <DashboardCard
            title="Due Today"
            value={stats?.dueToday ?? "--"}
            color="red"
          />
        </Link>
      </section>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* TEXT */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">
            Admin Dashboard for <br />
            <span className="text-green-600">
              EMI & Customer Management
            </span>
          </h2>

          <p className="mt-4 text-gray-600 text-base sm:text-lg">
            Track EMI status, pending dues, and customer records in one place.
          </p>
        </div>

        {/* IMAGE */}
        <div className="flex justify-center">
          <Image
            src="/mobile-shop.png"
            alt="Mobile Store"
            width={360}
            height={260}
            className="rounded-xl shadow-lg w-full max-w-sm sm:max-w-md"
          />
        </div>
      </main>
    </div>
  );
}
