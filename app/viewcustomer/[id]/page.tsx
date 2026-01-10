"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

function formatDate(dateString: string) {
  const date = new Date(dateString);

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);

  return `${dd}-${mm}-${yy}`;
}

interface Emi {
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: "PENDING" | "PAID";
}

interface Customer {
  _id: string;
  name: string;
  photo?: string;
  fatherName: string;
  address: string;
  contact: string;
  alternateNumber?: string;
  model: string;
  imei: string;

  supplier?: string;        // ✅ Agent Name
  supplierNumber?: string;  // ✅ Agent Contact

  price: number;
  downPayment: number;
  emiAmount: number;
  emis: Emi[];
  status: string;
  createdAt: string;
}

export default function CustomerDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      setCustomer(data);
      setLoading(false);
    };

    if (id) fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading customer details...
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Customer not found
      </div>
    );
  }

  const [imei1, imei2] = customer.imei.split(",");

  return (
    <div className="min-h-screen bg-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-5xl space-y-8">

        {/* HEADER WITH PHOTO */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg border border-slate-300
                       text-slate-700 hover:bg-slate-100 transition"
          >
            ← Back
          </button>

          <div
            className="h-20 w-20 rounded-2xl overflow-hidden
                       border border-slate-300 bg-slate-100
                       flex items-center justify-center"
          >
            {customer.photo ? (
              <img
                src={customer.photo}
                alt={customer.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-slate-600">
                {customer.name.charAt(0)}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {customer.name}
            </h1>
            <p className="text-sm text-slate-500">
              Customer Profile
            </p>
          </div>
        </div>

        {/* BASIC INFO */}
        <Card title="Basic Information">
          <Info label="Father Name" value={customer.fatherName} />
          <Info label="Contact" value={customer.contact} />
          <Info label="Alternate Number" value={customer.alternateNumber} />

          {/* ✅ AGENT DETAILS ADDED */}
          <Info label="Agent Name" value={customer.supplier} />
          <Info label="Agent Contact" value={customer.supplierNumber} />

          <Info label="Address" value={customer.address} />
          <Info label="Model" value={customer.model} />
          <StatusBadge status={customer.status} />
        </Card>

        {/* IMEI */}
        <Card title="Device IMEI">
          <Info label="IMEI 1" value={imei1} />
          <Info label="IMEI 2" value={imei2} />
        </Card>

        {/* PAYMENT */}
        <Card title="Payment Summary">
          <Price label="Total Price" value={customer.price} />
          <Price label="Down Payment" value={customer.downPayment} />
          <Price label="Monthly EMI" value={customer.emiAmount} />
        </Card>

        {/* EMI TABLE */}
        <div className="bg-white border border-black rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b bg-slate-50">
            <h2 className="font-semibold text-slate-800">
              EMI Schedule
            </h2>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-black">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Paid</th>
                <th className="p-3 text-left">Due Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {customer.emis.map((emi, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-slate-50 transition text-black"
                >
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">₹{emi.amount}</td>
                  <td className="p-3">₹{emi.paidAmount}</td>
                  <td className="p-3">
                    {emi.dueDate ? formatDate(emi.dueDate) : "-"}
                  </td>
                  <td className="p-3">
                    <EmiBadge status={emi.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Card({ title, children }: any) {
  return (
    <div className="bg-white border border-black rounded-xl p-6">
      <h2 className="text-lg font-semibold text-black mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 text-black sm:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-slate-900 font-medium">
        {value || "-"}
      </p>
    </div>
  );
}

function Price({ label, value }: any) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-indigo-600 font-semibold text-lg">
        ₹{value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">
        Status
      </p>
      <span
        className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium
        ${
          status === "APPROVED"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function EmiBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium
      ${
        status === "PAID"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {status}
    </span>
  );
}
