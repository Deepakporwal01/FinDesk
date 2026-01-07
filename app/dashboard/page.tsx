 export default function DashboardCard({
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