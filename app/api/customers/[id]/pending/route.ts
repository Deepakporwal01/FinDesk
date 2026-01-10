import { NextRequest, NextResponse } from "next/server";
import Customer from "@/models/Customer";
import { connectDB } from "@/lib/db/connectDb";
import { verifyToken } from "@/lib/db/auth/verifyToken";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = verifyToken(req);
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = params;

    const customer = await Customer.findById(id);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    customer.status = "APPROVED";
    await customer.save();

    return NextResponse.json({
      message: "Customer approved",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
