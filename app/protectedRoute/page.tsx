"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "AGENT" && role !== "ADMIN") {
      router.replace("/login");
    }
  }, []);

  return <>{children}</>;
}
