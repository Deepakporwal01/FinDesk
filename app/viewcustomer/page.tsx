"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Customer {
  _id: string;
  name: string;
  fatherName: string;
  contact: string;
  model: string;
  imei1: string;
  imei2: string;
  price: number;
  emiAmount: number;
  downPayment: number;
  emiDetails: string;
}

export default function ViewCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/customers");
        if (!res.ok) throw new Error("Failed to fetch customers");

        const data = await res.json();
        setCustomers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading customers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200 px-6 py-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          Customers
        </h1>
        <p className="mt-2 text-neutral-500">
          Manage and show customer information
        </p>
      </div>

      {/* Grid */}
      <div  className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {customers.map((c) => {
          const initials = c.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <Link href={`/viewcustomer/${c._id}`}
              key={c._id}
              className="group relative rounded-2xl bg-white/70 backdrop-blur-xl
                         border border-neutral-200/60 p-6
                         shadow-sm hover:shadow-xl
                         transition-all duration-300 hover:-translate-y-1"
            >
              {/* Top */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-600
                                flex items-center justify-center text-white font-medium">
                  {initials}
                </div>

                <div>
                  <h2 className="text-lg font-medium text-neutral-900">
                    {c.name}
                  </h2>
                  <p className="text-sm text-neutral-500">
                    {c.model}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="my-5 h-px bg-neutral-200/70" />

              {/* Bottom */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">
                  {c.contact}
                </span>

                <span className="text-sm font-medium text-neutral-900 opacity-0
                                 group-hover:opacity-100 transition">
                  View →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {customers.length === 0 && (
        <div className="text-center text-neutral-500 mt-20">
          No customers found
        </div>
      )}
    </div>
  );
}
