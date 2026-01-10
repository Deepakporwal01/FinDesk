import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDb";
import Customer from "@/models/Customer";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "total";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const customers = await Customer.find();
    const result: any[] = [];

    customers.forEach((customer) => {
      customer.emis?.forEach((emi: any, index: number) => {
        const due = new Date(emi.dueDate);
        due.setHours(0, 0, 0, 0);

        const isPaid = emi.status === "PAID";
        const isPartial = emi.status === "PARTIAL";
        const isPending = emi.status === "PENDING";
        const isOverdue = !isPaid && due < today;
        const isDueToday = !isPaid && due.getTime() === today.getTime();

        let match = false;

        // TOTAL
        if (type === "total") match = true;

        // PAID
        if (type === "paid" && isPaid) match = true;

        // PENDING (includes PARTIAL but not overdue)
        if (
          type === "pending" &&
          (isPending || isPartial) &&
          !isOverdue
        ) {
          match = true;
        }

        // DUE TODAY
        if (type === "due-today" && isDueToday) {
          match = true;
        }

        // OVERDUE
        if (type === "overdue" && isOverdue) {
          match = true;
        }

        if (match) {
          result.push({
            customerId: customer._id,
            emiIndex: index,
            name: customer.name,
            contact: customer.contact,
            model: customer.model,

            amount: emi.amount,
            paidAmount: emi.paidAmount || 0,
            remainingAmount: Math.max(
              emi.amount - (emi.paidAmount || 0),
              0
            ), // ✅ ADDED

            dueDate: emi.dueDate,

            paidDate: emi.paidDate || null, // FULL PAID DATE
            lastPaidDate:
              emi.payments?.length > 0
                ? emi.payments[emi.payments.length - 1].date
                : null, // ✅ PARTIAL DATE

            status: emi.status,
            overdue: isOverdue, // already present
          });
        }
      });
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
