import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db/connectDb";

/**
 * LOGIN
 * POST /api/auth/login
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    /* =========================
       VALIDATION
    ========================= */
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    /* =========================
       FIND USER
    ========================= */
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    /* =========================
       PASSWORD CHECK
    ========================= */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    /* =========================
       CREATE JWT
    ========================= */
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      id: user._id.toString(),
      role: user.role,
      name: user.name,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
