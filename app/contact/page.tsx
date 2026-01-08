"use client";

import { useRouter } from "next/navigation";

export default function ContactUs() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm font-medium text-green-600 hover:underline"
        >
          ← Back
        </button>

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Contact <span className="text-green-600">Us</span>
          </h1>
          <div className="w-24 h-1 bg-green-600 mx-auto mt-4 rounded-full" />
          <p className="mt-6 text-gray-600 text-lg">
            We’re here to help you choose the best mobile phone with easy EMI options.
          </p>
        </div>

        {/* CONTACT CARD */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 grid gap-6 sm:grid-cols-2">

          <div className="space-y-5">
            <div>
              <h2 className="text-sm uppercase tracking-wide text-gray-500">
                Shop Name
              </h2>
              <p className="text-xl font-semibold text-gray-900">
                Porwal Mobile
              </p>
            </div>

            <div>
              <h2 className="text-sm uppercase tracking-wide text-gray-500">
                Owner
              </h2>
              <p className="text-lg text-gray-800">Pawan Porwal</p>
            </div>

            <div>
              <h2 className="text-sm uppercase tracking-wide text-gray-500">
                Phone
              </h2>
              <a
                href="tel:9754813627"
                className="text-lg font-medium text-green-600 hover:underline"
              >
                9754813627
              </a>
            </div>

            <div>
              <h2 className="text-sm uppercase tracking-wide text-gray-500">
                Address
              </h2>
              <p className="text-gray-700">
                Punjabi Colony Road,<br />
                Bhanpura
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Our Services
            </h3>

            <ul className="space-y-3 text-gray-700">
              <li>✔ All brand smartphones available</li>
              <li>✔ Easy EMI facility</li>
              <li>✔ Best price & support</li>
              <li>✔ Genuine products only</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
