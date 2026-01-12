interface Defaulter {
  name: string;
  contact: string;
  pendingAmount: number;
}

interface Props {
  defaulters?: Defaulter[];
}

export default function TopDefaulters({ defaulters = [] }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Top Defaulters
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Customers with highest pending amounts
      </p>

      {defaulters.length === 0 ? (
        <p className="text-gray-400 text-sm">No defaulters 🎉</p>
      ) : (
        <ul className="space-y-4">
          {defaulters.map((d, i) => (
            <li key={i} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {d.name}
                </p>
                <p className="text-xs text-gray-500">{d.contact}</p>
              </div>
              <span className="text-sm font-semibold text-rose-600">
                ₹{d.pendingAmount}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
