import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db/connectDb";
import { requireRole } from "@/lib/db/auth/requireRole";

export async function GET(req: Request) {
  await connectDB();

  const auth = requireRole(req, ["ADMIN"]);
  if (auth.error) return auth.error;

  const users = await User.find(
    {},
    "name email role createdAt"
  );

  return NextResponse.json(users);
}
