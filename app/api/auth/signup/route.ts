import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db/connectDb";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    await User.create({
      name,
      email,
      password,      // ⚠️ stored as plain text
      role: "USER",  // 🔒 forced
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
