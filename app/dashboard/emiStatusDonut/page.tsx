"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  paid: number;
  partial: number;
  pending: number;
  overdue: number;
}

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

export default function EmiStatusDonut({
  paid,
  partial,
  pending,
  overdue,
}: Props) {
  const data = [
    { name: "Paid", value: paid },
    { name: "Partial", value: partial },
    { name: "Pending", value: pending },
    { name: "Overdue", value: overdue },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        EMI Status Breakdown
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Distribution of EMI statuses
      </p>

      <div className="h-70">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
