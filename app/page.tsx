"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardCard from "@/app/dashboard/page";
import ProtectedRoute from "@/app/protectedRoute/page";
interface DashboardStats {
  totalEmis: number;
  paidEmis: number;
  pendingEmis: number;
  overdueEmis: number;
  dueToday: number;
}

type Role = "ADMIN" | "AGENT" | null;

export default function Home() {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /* LOAD ROLE */
  const [role, setRole] = useState<Role>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("role") as Role;
    }
    return null;
  });

  /* FETCH ADMIN STATS */
  useEffect(() => {
    if (role !== "ADMIN") return;

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/emi-stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStats(await res.json());
      } catch {
        console.error("Failed to fetch stats");
      }
    };

    fetchStats();
  }, [role]);

  /* LOGOUT */
  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <Image
              src="/Pawanlogo.jpg"
              alt="Porwal Mobile"
              width={42}
              height={42}
              className="rounded-lg"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-green-600">
              Porwal Mobile
            </h1>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden sm:flex gap-8 text-lg font-medium text-gray-700">
            <Link href="/" className="hover:text-green-600">
              Home
            </Link>
            <Link href="/aboutus" className="hover:text-green-600">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-green-600">
              Contact Us
            </Link>
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden sm:flex gap-2">
            {(role === "ADMIN" || role === "AGENT") && (
              <Link
                href="/form"
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                + Add Customer
              </Link>
            )}

            {role === "ADMIN" && (
              <>
                <Link
                  href="/viewcustomer"
                  className="border  text-black px-4 py-2 rounded-lg"
                >
                  View Customers
                </Link>
                <Link
                  href="/dashboard-details"
                  className="border px-4 py-2 rounded-lg text-black"
                >
                  Dashboard
                </Link>
                <Link
                  href="/requests"
                  className="border px-4 py-2 rounded-lg text-black"
                >
                 Requests
                </Link>
              </>
            )}

            {!role ? (
              <Link
                href="/api/login"
                className="border px-4 py-2 rounded-lg  text-red-500"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="border border-red-500  text-red-600 px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            )}
          </div>

          {/* HAMBURGER */}
          <button
            onClick={() => setMenuOpen(true)}
            className="sm:hidden p-2 rounded-md border border-gray-300 text-gray-700"
          >
            ☰
          </button>
        </div>
      </header>
      {/* ================= OVERLAY MOBILE MENU ================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />

          {/* MENU PANEL */}
          <div className="absolute top-0 right-0 h-full w-72 bg-white shadow-xl p-6 flex flex-col gap-5 animate-slideIn">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl text-gray-600"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-4 text-gray-700 text-base">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link href="/aboutus" onClick={() => setMenuOpen(false)}>
                About Us
              </Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)}>
                Contact Us
              </Link>
            </nav>

            <div className="border-t pt-4 flex flex-col gap-3">
              {(role === "ADMIN" || role === "AGENT") && (
                <Link
                  href="/form"
                  onClick={() => setMenuOpen(false)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-center"
                >
                  + Add Customer
                </Link>
              )}

              {role === "ADMIN" && (
                <>
                  <Link
                    href="/viewcustomer"
                    onClick={() => setMenuOpen(false)}
                    className="border px-4 py-2 rounded-lg text-center text-black"
                  >
                    View Customers
                  </Link>
                  <Link
                    href="/dashboard-details"
                    onClick={() => setMenuOpen(false)}
                    className="border px-4 py-2 rounded-lg text-center text-black"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/requests"
                    onClick={() => setMenuOpen(false)}
                    className="border px-4 py-2 rounded-lg text-center text-black"
                  >
                   Requests
                  </Link>
                   

                </>
              )}

              {!role ? (
                <Link
                  href="/api/login"
                  className="border px- py-2 rounded text-center  text-red-400"
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="border border-red-500 text-red-600 px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ================= DASHBOARD ================= */}
      {role === "ADMIN" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <Link href="/emi-list?type=total">
        <DashboardCard
          title="Total EMIs"
          value={stats?.totalEmis ?? "--"}
        />
      </Link>

      <Link href="/emi-list?type=paid">
        <DashboardCard
          title="Paid EMIs"
          value={stats?.paidEmis ?? "--"}
          color="green"
        />
      </Link>

      <Link href="/emi-list?type=pending">
        <DashboardCard
          title="Pending EMIs"
          value={stats?.pendingEmis ?? "--"}
          color="yellow"
        />
      </Link>

      <Link href="/emi-list?type=due-today">
        <DashboardCard
          title="Due Today"
          value={stats?.dueToday ?? "--"}
          color="red"
        />
      </Link>

      {/* ✅ OVERDUE CARD */}
      <Link href="/emi-list?type=overdue">
        <DashboardCard
          title="Overdue EMIs"
          value={stats?.overdueEmis ?? "--"}
          color="overdue"
        />
      </Link>
        </section>
      )}
      {/* ================= HERO ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Admin Dashboard for <br />
            <span className="text-green-600">EMI & Customer Management</span>
          </h2>
          <p className="mt-4 text-gray-600">
            Track EMI status, pending dues, and customer records in one place.
          </p>
        </div>

        <Image
          src="/mobile-shop.png"
          alt="Mobile Store"
          width={360}
          height={260}
          className="rounded-xl shadow-lg"
        />
      </main>
      {/* ANIMATION */}
      <style jsx>{`
        .animate-slideIn {
          animation: slideIn 0.25s ease-out;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
      (
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* TOP SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* BRAND */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-600">
                Porwal Mobile
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your trusted mobile shop in Bhanpura offering the latest
                smartphones with easy EMI options and genuine products.
              </p>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>
                  <Link href="/" className="hover:text-green-600 transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-green-600 transition"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-green-600 transition"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* SERVICES */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✔ All Brand Smartphones</li>
                <li>✔ Easy EMI Facility</li>
                <li>✔ Genuine Products</li>
                <li>✔ Best Customer Support</li>
              </ul>
            </div>

            {/* CONTACT INFO */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li>
                  <span className="font-medium text-gray-800">Owner:</span>{" "}
                  Pawan Porwal
                </li>
                <li>
                  <span className="font-medium text-gray-800">Phone:</span>{" "}
                  <a
                    href="tel:9754813627"
                    className="text-green-600 hover:underline"
                  >
                    9754813627
                  </a>
                </li>
                <li>
                  <span className="font-medium text-gray-800">Address:</span>{" "}
                  Punjabi Colony Road, Bhanpura
                </li>
              </ul>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-gray-200 my-8" />

          {/* BOTTOM BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()}{" "}
              <span className="font-medium text-gray-700">Porwal Mobile</span>.
              All rights reserved.
            </p>

            <p className="text-center sm:text-right">
              Designed for a better mobile shopping experience 📱
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
