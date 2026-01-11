import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDb";
import Customer from "@/models/Customer";

export async function GET() {
  try {
    await connectDB();

    const customers = await Customer.find({ status: "APPROVED" });

    let totalEmis = 0;
    let paidEmis = 0;
    let pendingEmis = 0;
    let partialEmis = 0;
    let dueToday = 0;
    let overdueEmis = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    customers.forEach((customer) => {
      customer.emis.forEach((emi) => {
        totalEmis++;

        const due = new Date(emi.dueDate);
        due.setHours(0, 0, 0, 0);

        const isOverdue = due < today && emi.status !== "PAID";
        const isToday = due.getTime() === today.getTime();

        if (emi.status === "PAID") paidEmis++;
        if (emi.status === "PARTIAL") partialEmis++;
        if (emi.status === "PENDING") pendingEmis++;
        if (isToday && emi.status !== "PAID") dueToday++;
        if (isOverdue) overdueEmis++;
      });
    });

    return NextResponse.json({
      totalEmis,
      paidEmis,
      pendingEmis,
      partialEmis, // ✅ NEW
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
