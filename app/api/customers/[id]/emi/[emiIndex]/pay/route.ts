import { NextResponse } from "next/server";
import Customer from "@/models/Customer";
import { connectDB } from "@/lib/db/connectDb";
import { verifyToken } from "@/lib/db/auth/verifyToken";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string; emiIndex: string }> }
) {
  try {
    await connectDB();
    verifyToken(req); // ADMIN ONLY

    const { id, emiIndex } = await context.params;
    const startIndex = Number(emiIndex);

    if (isNaN(startIndex)) {
      return NextResponse.json(
        { error: "Invalid EMI index" },
        { status: 400 }
      );
    }

    const { amount } = await req.json();
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
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

    let remainingPayment = Number(amount);
    const emis = customer.emis;
    const now = new Date();

    // 🔁 AUTO-ADJUST PAYMENT ACROSS EMIs
    for (let i = startIndex; i < emis.length && remainingPayment > 0; i++) {
      const emi = emis[i];

      if (emi.status === "PAID") continue;

      const remainingEmiAmount =
        emi.amount - (emi.paidAmount || 0);

      if (remainingEmiAmount <= 0) continue;

      const payHere = Math.min(
        remainingEmiAmount,
        remainingPayment
      );

      // ✅ PUSH PAYMENT ENTRY
      emi.payments.push({
        amount: payHere,
        date: now,
      });

      // ✅ UPDATE CACHED FIELDS
      emi.paidAmount += payHere;
      emi.paidDate = now;

      remainingPayment -= payHere;

      // ✅ STATUS UPDATE
      if (emi.paidAmount >= emi.amount) {
        emi.paidAmount = emi.amount;
        emi.status = "PAID";
      } else {
        emi.status = "PARTIAL";
      }
    }

    await customer.save();

    return NextResponse.json({
      message: "Payment adjusted across EMIs successfully",
      unadjustedAmount: remainingPayment, // usually 0
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
