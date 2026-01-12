"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  monthlySales: Record<string, number>;
  monthlyCash: Record<string, number>;
}

export default function SalesGrowthChart({
  monthlySales,
  monthlyCash,
}: Props) {
  const data = Object.keys(monthlySales).map((month) => ({
    month,
    sales: monthlySales[month] || 0,
    cash: monthlyCash[month] || 0,
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Sales & Cash Growth
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Monthly performance trend
      </p>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#6366f1"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="cash"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
