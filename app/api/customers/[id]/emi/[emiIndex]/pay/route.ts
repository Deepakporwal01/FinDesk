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

    // 🔐 AUTH CHECK (ADMIN ONLY)
    verifyToken(req);

    // ✅ UNWRAP PARAMS (THIS FIXES THE ERROR)
    const { id, emiIndex } = await context.params;
    const index = Number(emiIndex);
 
    if (isNaN(index)) {
      return NextResponse.json(
        { error: "Invalid EMI index" },
        { status: 400 }
      );
    }

    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // 🔍 FIND CUSTOMER
    const customer = await Customer.findById(id);

    if (!customer || !customer.emis[index]) {
      return NextResponse.json(
        { error: "EMI not found" },
        { status: 404 }
      );
    }

    const emi = customer.emis[index];
console.log(customer)
    // 💰 ADD PAYMENT
    emi.paidAmount = (emi.paidAmount || 0) + Number(amount);

    // ✅ UPDATE STATUS
    if (emi.paidAmount >= emi.amount) {
      emi.paidAmount = emi.amount;
      emi.status = "PAID";
      emi.paidDate = new Date();
    } else {
      emi.status = "PARTIAL";
    }

    await customer.save();

    return NextResponse.json({
      message: "Payment recorded successfully",
      emi,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
