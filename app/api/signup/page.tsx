"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "AGENT",
  });

const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "25%" };
    if (score === 2) return { label: "Medium", color: "bg-yellow-500", width: "50%" };
    if (score === 3) return { label: "Good", color: "bg-blue-500", width: "75%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = getPasswordStrength(form.password);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     HANDLE INPUT
  ========================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =========================
     SIGNUP
  ========================= */
  const handleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      alert("Signup successful. Please login.");
      router.push("/api/login");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* HEADER */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">Signup as Admin or Agent</p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-center text-red-600 text-sm bg-red-50 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* NAME */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className="w-full border rounded-lg px-4 py-2 text-black
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full border rounded-lg px-4 py-2 text-black
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create password"
            className="w-full border rounded-lg px-4 py-2 text-black
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
{form.password && (
          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded">
              <div
                className={`h-2 rounded ${strength.color}`}
                style={{ width: strength.width }}
              />
            </div>
            <p className="text-sm mt-1 text-gray-600">
              Strength: <span className="font-medium">{strength.label}</span>
            </p>
          </div>
        )}

        {/* ROLE */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 text-black
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="AGENT">Agent</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white
                     bg-gradient-to-r from-blue-600 to-purple-600
                     hover:opacity-90 active:scale-[0.98]
                     transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Signup"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/api/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
