"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import DashboardCard from "@/app/dashboard/page";

interface DashboardStats {
  totalEmis: number;
  paidEmis: number;
  pendingEmis: number;
  dueToday: number;
  overdueEmis: number; // ✅ NEW
}

export default function Page() {
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
    <section className="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <Link href="/emi-list?type=total">
        <DashboardCard
          title="Total EMIs"
          value={stats?.totalEmis ?? "--"}
        />
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

      {/* ✅ OVERDUE CARD */}
      <Link href="/emi-list?type=overdue">
        <DashboardCard
          title="Overdue EMIs"
          value={stats?.overdueEmis ?? "--"}
          color="overdue"
        />
      </Link>
    </section>
  );
}
