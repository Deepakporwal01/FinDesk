import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDb";
import Customer from "@/models/Customer";
import { verifyToken } from "@/lib/db/auth/verifyToken";

export async function GET(req: Request) {
  try {
    await connectDB();

    const user = verifyToken(req);
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const requests = await Customer.find({
      status: "PENDING",
    }).sort({ createdAt: -1 });
console.log(requests)
    return NextResponse.json(requests, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
