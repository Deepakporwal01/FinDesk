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

    // ✅ UNWRAP PARAMS (NEXT.JS SAFE)
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
    const now = new Date();

    // 🔁 AUTO-ADJUST PAYMENT ACROSS EMIs
    for (
      let i = startIndex;
      i < customer.emis.length && remainingPayment > 0;
      i++
    ) {
      const emi = customer.emis[i];

      if (emi.status === "PAID") continue;

      const alreadyPaid = emi.paidAmount || 0;
      const emiRemaining = emi.amount - alreadyPaid;

      if (emiRemaining <= 0) continue;

      const payHere = Math.min(emiRemaining, remainingPayment);

      // ✅ ENSURE PAYMENTS ARRAY
      emi.payments = emi.payments || [];
      emi.payments.push({
        amount: payHere,
        date: now,
      });

      // ✅ UPDATE CACHED FIELDS
      emi.paidAmount = alreadyPaid + payHere;
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
      paidAmount: amount - remainingPayment,
      unadjustedAmount: remainingPayment, // extra money (if any)
    });
  } catch (err: any) {
    console.error("PAY EMI ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Payment failed" },
      { status: 500 }
    );
  }
}
