"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    contact: "",
    model: "",
    imei: "",
    price: "",
    downPayment: "",
    emiAmount: "",
    emiMonths: "",
    firstEmiDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        price: Number(formData.price),
        downPayment: Number(formData.downPayment),
        emiAmount: Number(formData.emiAmount),
        emiMonths: Number(formData.emiMonths),
      }),
    });

    if (res.ok) {
      alert("Customer added successfully");
      router.push("/");
    } else {
      alert("Error adding customer");
    }
  };

  /* =========================
     EMI PREVIEW (ADMIN CONFIDENCE)
  ========================= */
  const previewEmis = () => {
    if (
      !formData.emiMonths ||
      !formData.firstEmiDate ||
      !formData.emiAmount
    )
      return [];

    const emis = [];
    let date = new Date(formData.firstEmiDate);

    for (let i = 0; i < Number(formData.emiMonths); i++) {
      emis.push({
        amount: formData.emiAmount,
        dueDate: new Date(date),
      });
      date.setMonth(date.getMonth() + 1);
    }

    return emis;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 space-y-5"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          EMI Customer Details
        </h2>

        {/* BASIC DETAILS */}
        {[
          { name: "name", label: "Name" },
          { name: "fatherName", label: "Father's Name" },
          { name: "contact", label: "Contact Number" },
          { name: "model", label: "Phone Model" },
          { name: "imei", label: "IMEI Number" },
        ].map((f) => (
          <Input
            key={f.name}
            {...f}
            value={formData[f.name as keyof typeof formData]}
            onChange={handleChange}
          />
        ))}

        {/* FINANCE */}
        <Input
          name="price"
          label="Price (₹)"
          type="number"
          value={formData.price}
          onChange={handleChange}
        />

        <Input
          name="downPayment"
          label="Down Payment (₹)"
          type="number"
          value={formData.downPayment}
          onChange={handleChange}
        />

        <Input
          name="emiAmount"
          label="EMI Amount (₹)"
          type="number"
          value={formData.emiAmount}
          onChange={handleChange}
        />

        <Input
          name="emiMonths"
          label="EMI Months"
          type="number"
          value={formData.emiMonths}
          onChange={handleChange}
        />

        <Input
          name="firstEmiDate"
          label="First EMI Date"
          type="date"
          value={formData.firstEmiDate}
          onChange={handleChange}
        />

        {/* EMI PREVIEW */}
        {previewEmis().length > 0 && (
          <div className="bg-black p-4 rounded-xl text-sm">
            <p className="font-semibold mb-2">
              EMI Schedule Preview
            </p>
            {previewEmis().map((emi, i) => (
              <div
                key={i}
                className="flex justify-between"
              >
                <span>Month {i + 1}</span>
                <span>
                  ₹{emi.amount} –{" "}
                  {emi.dueDate.toDateString()}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
      
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Submit Details
        </button>
      </form>
    </div>
  );
}

/* =========================
   REUSABLE INPUT
========================= */
function Input({
  label,
  ...props
}: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">
        {label}
      </label>
      <input
        {...props}
        className="border text-black rounded-lg px-4 py-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
