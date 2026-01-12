import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDb";
import Customer from "@/models/Customer";

export async function GET() {
  try {
    await connectDB();

    let totalEmis = 0;
    let paidEmis = 0;
    let pendingEmis = 0;
    let partialEmis = 0;
    let dueToday = 0;
    let overdueEmis = 0;

    let totalCustomers = 0;
    let totalSales = 0;
    let totalCashReceived = 0;
    let pendingCash = 0;

    const monthlySales: Record<string, number> = {};
    const monthlyCash: Record<string, number> = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const customers = await Customer.find({ status: "APPROVED" });
    totalCustomers = customers.length;

    customers.forEach((customer: any) => {
      customer.emis?.forEach((emi: any) => {
        totalEmis++;

        const emiAmount = emi.amount || 0;
        const paidAmount = emi.paidAmount || 0;

        totalSales += emiAmount;
        totalCashReceived += paidAmount;
        pendingCash += emiAmount - paidAmount;

        const due = new Date(emi.dueDate);
        due.setHours(0, 0, 0, 0);

        const monthKey = due.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });

        // 📊 Monthly aggregation
        monthlySales[monthKey] =
          (monthlySales[monthKey] || 0) + emiAmount;

        monthlyCash[monthKey] =
          (monthlyCash[monthKey] || 0) + paidAmount;

        // 📌 Status counts
        if (emi.status === "PAID") {
          paidEmis++;
          return;
        }

        if (emi.status === "PARTIAL") {
          partialEmis++;
        }

        if (emi.status === "PENDING" || emi.status === "PARTIAL") {
          pendingEmis++;
        }

        if (due.getTime() === today.getTime()) {
          dueToday++;
        }

        if (due < today && emi.status !== "PAID") {
          overdueEmis++;
        }
      });
    });

    return NextResponse.json({
      totalCustomers,
      totalSales,
      totalCashReceived,
      pendingCash,

      totalEmis,
      paidEmis,
      partialEmis,
      pendingEmis,
      dueToday,
      overdueEmis,

      monthlySales,
      monthlyCash,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
