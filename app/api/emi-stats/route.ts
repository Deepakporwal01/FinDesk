import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDb";
import Customer from "@/models/Customer";

export async function GET() {
  try {
    await connectDB();

    let totalEmis = 0;
    let paidEmis = 0;
    let pendingEmis = 0;
    let partialEmis = 0; // ✅ NEW
    let dueToday = 0;
    let overdueEmis = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const customers = await Customer.find({ status: "APPROVED" });

    customers.forEach((customer: any) => {
      customer.emis?.forEach((emi: any) => {
        totalEmis++;

        const due = new Date(emi.dueDate);
        due.setHours(0, 0, 0, 0);

        if (emi.status === "PAID") {
          paidEmis++;
          return;
        }

        if (emi.status === "PARTIAL") {
          partialEmis++; // ✅ COUNT PARTIAL
        }

        if (emi.status === "PENDING" || emi.status === "PARTIAL") {
          pendingEmis++;
        }

        if (due.getTime() === today.getTime()) {
          dueToday++;
        }

        if (due < today) {
          overdueEmis++;
        }
      });
    });

    return NextResponse.json({
      totalEmis,
      paidEmis,
      partialEmis, // ✅ RETURN IT
      pendingEmis,
      dueToday,
      overdueEmis,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
