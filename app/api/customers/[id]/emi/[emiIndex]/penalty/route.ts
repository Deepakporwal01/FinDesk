import { NextResponse } from "next/server";
import Customer from "@/models/Customer";
import { connectDB } from "@/lib/db/connectDb";
import { verifyToken } from "@/lib/db/auth/verifyToken";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string; emiIndex: string }> }
) {
  await connectDB();
  verifyToken(req);

  const { id, emiIndex } = await context.params;
  const index = Number(emiIndex);

  const { penalty } = await req.json();

  if (!penalty || penalty <= 0) {
    return NextResponse.json(
      { error: "Invalid penalty amount" },
      { status: 400 }
    );
  }

  const customer = await Customer.findById(id);
  if (!customer) {
    return NextResponse.json(
      { error: "Customer not found" },
      { status: 404 }
    );
  }

  const emi = customer.emis[index];
  if (!emi) {
    return NextResponse.json(
      { error: "EMI not found" },
      { status: 404 }
    );
  }

  // ✅ CORRECT: update penalty separately
  emi.penalty = (emi.penalty || 0) + penalty;

  // Optional safety
  if (emi.status === "PAID") {
    emi.status = "PENDING";
  }

  await customer.save();

  return NextResponse.json({
    success: true,
    penalty: emi.penalty,
    totalPayable: emi.amount + emi.penalty - emi.paidAmount,
  });
}
