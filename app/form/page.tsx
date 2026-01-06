"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Page() {
  // handling the form
const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    contact: "",
    model: "",
    imei: "",
    price: "",
    emiAmount: "",
    downPayment: "",
    emiDetails: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Customer added successfully");
      setFormData({
        name: "",
        fatherName: "",
        contact: "",
        model: "",
        imei: "",
        price: "",
        emiAmount: "",
        downPayment: "",
        emiDetails: "",
      });
      router.push('/');
    } else {
      alert("Error adding customer");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <form className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 space-y-5" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          EMI Customer Details
        </h2>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="Enter customer name"
            className="border text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Father Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Father&apos;s Name</label>
          <input
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            type="text"
            placeholder="Enter father's name"
            className="border text-black  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Contact Number</label>
          <input
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            type="tel"
            placeholder="Enter contact number"
            className="border text-black  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Model */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Phone Model</label>
          <input
            name="model"
            value={formData.model}
            onChange={handleChange}
            type="text"
            placeholder="Enter phone model"
            className="border text-black  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* IMEI */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">IMEI Number</label>
          <input
            name="imei"
            value={formData.imei}
            onChange={handleChange}
            type="text"
            placeholder="Enter IMEI1,IMEI2 number"
            className="border text-black  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Price (₹)</label>
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            type="number"
            placeholder="Enter total price"
            className="border text-black  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* EMI Amount */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">EMI Amount (₹)</label>
          <input
            name="emiAmount"
            value={formData.emiAmount}
            onChange={handleChange}
            type="number"
            placeholder="Enter EMI amount"
            className="border text-black  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Down Payment */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Down Payment (₹)</label>
          <input
            name="downPayment"
            value={formData.downPayment}
            onChange={handleChange}
            type="number"
            placeholder="Enter down payment"
            className="border text-black  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* EMI Details */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">EMI Details</label>
          <input
            name="emiDetails"
            value={formData.emiDetails}
            onChange={handleChange}
            type="text"
            placeholder="Monthly / Duration details"
            className="border text-black  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-4 bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg  font-semibold hover:opacity-90 transition"
        >
          Submit Details
        </button>
      </form>
    </div>
  );
}
