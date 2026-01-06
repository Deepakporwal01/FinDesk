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
      console.log(res);
      const data = await res.json();
      setCustomer(data);
      setLoading(false);
    };
    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading details...
      </div>
    );
  }

  if (!customer) {
    return <div className="p-6">Customer not found</div>;
  }
 
  const s = customer.imei.split(",");
  const imei1 = s[0];
  const imei2 = s[1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 
    flex flex-col items-center justify-center"> 
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Customer Details
        </h1>
      
      </div>

      {/* Card */}
      <div className=" w-200 h-150 bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
        >
          ← Back
        </button>
        {/* Basic Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Basic Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-gray-600">
            <p><b>Name:</b> {customer.name}</p>
            <p><b>Father Name:</b> {customer.fatherName}</p>
            <p><b>Contact:</b> {customer.contact}</p>
            <p><b>Model:</b> {customer.model}</p>
          </div>
        </div>

        {/* IMEI */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            IMEI Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-gray-600">
            <p><b>IMEI 1:</b> {imei1}</p>
            <p><b>IMEI 2:</b> {imei2}</p>
          </div>
        </div>

        {/* Payment */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Payment Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-gray-600">
            <p><b>Price:</b> ₹{customer.price}</p>
            <p><b>Down Payment:</b> ₹{customer.downPayment}</p>
            <p><b>EMI Amount:</b> ₹{customer.emiAmount}</p>
            <p><b>EMI Details:</b> {customer.emiDetails}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
