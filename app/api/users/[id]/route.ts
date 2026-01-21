import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db/connectDb";
import { requireRole } from "@/lib/db/auth/requireRole";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const auth = requireRole(req, ["ADMIN"]);
  if (auth.error) return auth.error;

  const user = await User.findById(params.id);
  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // ❌ Only USER can be deleted
  if (user.role !== "USER") {
    return NextResponse.json(
      { error: "Only USER can be deleted" },
      { status: 403 }
    );
  }

  await User.findByIdAndDelete(params.id);

  return NextResponse.json({ success: true });
}
