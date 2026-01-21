"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "AGENT" | "ADMIN";
}

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [action, setAction] =
    useState<"MAKE_AGENT" | "MAKE_USER" | "DELETE" | null>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUsers(data);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CONFIRM ACTION ================= */
  const confirmAction = async () => {
    if (!selectedUser || !action) return;

    setActionLoading(true);
    setError("");

    try {
      let res: Response;

      if (action === "MAKE_AGENT") {
        res = await fetch("/api/changerole", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: selectedUser._id,
            role: "AGENT",
          }),
        });
      } else if (action === "MAKE_USER") {
        res = await fetch("/api/changerole", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: selectedUser._id,
            role: "USER",
          }),
        });
      } else {
        res = await fetch(`/api/users/${selectedUser._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Action failed");
      }

      setSelectedUser(null);
      setAction(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading users…
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                User Management
              </h1>
              <p className="text-slate-500 text-sm">
                Admin control panel
              </p>
            </div>

            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
            >
              ← Back
            </button>
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* USERS */}
          <div className="grid md:grid-cols-2 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg text-black">
                      {user.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {user.email}
                    </p>

                    <span
                      className={`inline-block mt-3 px-3 py-1 text-xs rounded-full
                        ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "AGENT"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col gap-2">
                    {user.role === "USER" && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setAction("MAKE_AGENT");
                          }}
                          className="px-3 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
                        >
                          Make Agent
                        </button>

                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setAction("DELETE");
                          }}
                          className="px-3 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </>
                    )}

                    {user.role !== "USER" && (
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setAction("MAKE_USER");
                        }}
                        className="px-3 py-2 text-sm rounded-lg bg-slate-700 text-white hover:bg-slate-800"
                      >
                        Make User Agent
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedUser && action && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg text-black font-semibold mb-3">
              Confirm Action
            </h3>

            <p className="text-sm text-black mb-6">
              {action === "DELETE"
                ? `Delete ${selectedUser.name}? This cannot be undone.`
                : `Change role of ${selectedUser.name}?`}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setAction(null);
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-black rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={confirmAction}
                disabled={actionLoading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                {actionLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
