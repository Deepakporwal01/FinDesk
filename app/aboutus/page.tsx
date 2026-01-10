"use client";

import { useRouter } from "next/navigation";

export default function AboutUs() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition"
        >
          ← Back
        </button>

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            About <span className="text-green-600">Porwal Mobile</span>
          </h1>
          <div className="w-24 h-1 bg-green-600 mx-auto mt-4 rounded-full" />
          <p className="mt-6 text-gray-600 text-lg">
            Your trusted destination for the latest smartphones and easy EMI options in Bhanpura.
          </p>
        </div>

        {/* CONTENT CARD */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
          <p className="text-gray-700 leading-relaxed text-lg ">
            <span className="font-semibold">Porwal Mobile</span> is a trusted mobile
            shop located at <span className="font-medium">Punjabi Colony Road, Bhanpura</span>,
            offering all major smartphone brands with easy EMI facilities.
          </p>

          <div className="border-l-4 border-green-600 pl-4 text-gray-700">
            We believe in honest pricing, genuine products, and customer satisfaction.
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              "All latest smartphones available",
              "Easy EMI options",
              "100% genuine products",
              "Trusted local service",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border"
              >
                <span className="text-green-600">✔</span>
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t">
            <h2 className="text-xl text-black font-semibold">Owner</h2>
            <p className="mt-2 text-gray-700">
              <span className="font-medium">Pawan Porwal</span> – serving customers with trust and care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
