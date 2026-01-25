"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"; 

interface Props {
  monthlySales?: Record<string, number>;
  monthlyCash?: Record<string, number>;
}

export default function DashboardCharts({
  monthlySales = {},
  monthlyCash = {},
}: Props) {
  const chartData = Object.keys(monthlySales).map((month) => ({
    month,
    sales: monthlySales[month] || 0,
    cash: monthlyCash[month] || 0,
  }));

  if (chartData.length === 0) {
    return (
      <div className="mt-12 text-center text-gray-400">
        No chart data available
      </div>
    );
  }

  return (
    <div className="mt-14 grid grid-cols-1 gap-8">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Monthly Sales & Cash
          </h2>
          <p className="text-sm text-gray-500">
            Sales vs cash received per month
          </p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="cash" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
