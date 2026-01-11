"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditCustomer() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setForm(data);
      setLoading(false);
    };

    fetchCustomer();
  }, [id]);

  const updateField = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    await fetch(`/api/customers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    router.push(`/viewcustomer/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="flex gap-4 items-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg border text-black border-slate-300"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Edit Customer
          </h1>
        </div>

        {/* BASIC INFO */}
        <Section title="Basic Information">
          <Input label="Name" value={form.name} onChange={(v) => updateField("name", v)} />
          <Input label="Father Name" value={form.fatherName} onChange={(v) => updateField("fatherName", v)} />
          <Input label="Contact" value={form.contact} onChange={(v) => updateField("contact", v)} />
          <Input label="Alternate Number" value={form.alternateNumber} onChange={(v) => updateField("alternateNumber", v)} />
          <Input label="Address" value={form.address} onChange={(v) => updateField("address", v)} />
          <Input label="Model" value={form.model} onChange={(v) => updateField("model", v)} />
        </Section>

        {/* AGENT */}
        <Section title="Agent Details">
          <Input label="Agent Name" value={form.supplier} onChange={(v) => updateField("supplier", v)} />
          <Input label="Agent Contact" value={form.supplierNumber} onChange={(v) => updateField("supplierNumber", v)} />
        </Section>

        {/* PAYMENT */}
        <Section title="Payment">
          <Input label="Price" value={form.price} onChange={(v) => updateField("price", Number(v))} />
          <Input label="Down Payment" value={form.downPayment} onChange={(v) => updateField("downPayment", Number(v))} />
          <Input label="Monthly EMI" value={form.emiAmount} onChange={(v) => updateField("emiAmount", Number(v))} />
        </Section>

        {/* SAVE */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-indigo-600
                     text-white font-semibold hover:bg-indigo-700"
        >
          Save Changes
        </button>

      </div>
    </div>
  );
}

/* ======= UI HELPERS (NO DESIGN CHANGE) ======= */

function Section({ title, children }: any) {
  return (
    <div className="border text-black border-black rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-xs uppercase text-slate-500">
        {label}
      </label>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-slate-300
                   rounded-lg px-3 py-2 text-black"
      />
    </div>
  );
}
