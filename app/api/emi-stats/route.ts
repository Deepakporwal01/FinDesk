import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDb";
import Customer from "@/models/Customer";

export async function GET() {
  try {
    await connectDB();

    const customers = await Customer.find({status: "APPROVED"});

    let totalEmis = 0;
    let pendingEmis = 0;
    let paidEmis = 0;
    let dueToday = 0;
    let overdueEmis = 0; // ✅ ADDED

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    customers.forEach((customer) => {
      customer.emis?.forEach((emi: any) => {
        totalEmis++;

        const dueDate = new Date(emi.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        const isPaid = emi.status === "PAID";
        const isPending =
          emi.status === "PENDING" || emi.status === "PARTIAL";
        const isOverdue = !isPaid && dueDate < today;

        // ✅ PAID
        if (isPaid) {
          paidEmis++;
        }

        // ✅ PENDING (includes PARTIAL)
        if (isPending) {
          pendingEmis++;

          // DUE TODAY
          if (dueDate.getTime() === today.getTime()) {
            dueToday++;
          }
        }

        // ✅ OVERDUE
        if (isOverdue) {
          overdueEmis++;
        }
      });
    });

    return NextResponse.json(
      {
        totalEmis,
        pendingEmis,
        paidEmis,
        dueToday,
        overdueEmis, // ✅ RETURNED
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
