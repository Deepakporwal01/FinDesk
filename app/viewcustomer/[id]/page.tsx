"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Customer {
  name: string;
  fatherName: string;
  contact: string;
  model: string;
  imei: string;
  price: number;
  downPayment: number;
  emiAmount: number;
  emiDetails: string;
}

export default function CustomerDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      const res = await fetch(`/api/customers/${id}`);
      const data = await res.json();
      setCustomer(data);
      setLoading(false);
    };
    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 animate-pulse">
          Loading customer details...
        </p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        Customer not found
      </div>
    );
  }

  const s = customer.imei.split(",");
  const imei1 = s[0];
  const imei2 = s[1];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 flex justify-center items-center">
      <div className="w-full max-w-3xl">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white
                       hover:bg-gray-800 transition text-sm"
          >
            ← Back
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Customer Details
          </h1>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-8">
          
          {/* BASIC INFO */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
              <p><b>Name:</b> {customer.name}</p>
              <p><b>Father Name:</b> {customer.fatherName}</p>
              <p><b>Contact:</b> {customer.contact}</p>
              <p><b>Model:</b> {customer.model}</p>
            </div>
          </section>

          {/* IMEI INFO */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
              IMEI Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
              <p><b>IMEI 1:</b> {imei1}</p>
              <p><b>IMEI 2:</b> {imei2}</p>
            </div>
          </section>

          {/* PAYMENT INFO */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
              Payment Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
              <p><b>Price:</b> ₹{customer.price}</p>
              <p><b>Down Payment:</b> ₹{customer.downPayment}</p>
              <p><b>EMI Amount:</b> ₹{customer.emiAmount}</p>
              <p><b>EMI Details:</b> {customer.emiDetails}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
