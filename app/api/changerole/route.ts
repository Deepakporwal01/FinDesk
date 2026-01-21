import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db/connectDb";
import { requireRole } from "@/lib/db/auth/requireRole";

export async function PATCH(req: Request) {
  await connectDB();

  // 🔐 Only ADMIN can change roles
  const auth = requireRole(req, ["ADMIN"]);
  if (auth.error) return auth.error;

  const { userId, role } = await req.json();

  if (!userId || !["USER", "AGENT"].includes(role)) {
    return NextResponse.json(
      { error: "Invalid role change" },
      { status: 400 }
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // ❌ UI never sends ADMIN, but extra safety
  if (role === "ADMIN") {
    return NextResponse.json(
      { error: "Cannot promote to ADMIN" },
      { status: 403 }
    );
  }

  // ✅ USER ↔ AGENT and ADMIN → USER allowed
  user.role = role;
  await user.save();

  return NextResponse.json({
    success: true,
    id: user._id,
    role: user.role,
  });
}
