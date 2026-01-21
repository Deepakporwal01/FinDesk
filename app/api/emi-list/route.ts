import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDb";
import Customer from "@/models/Customer";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "total";
    const search = searchParams.get("search")?.trim() || "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* =========================
       SEARCH FILTER
    ========================= */
    const searchQuery: any = {
      status: "APPROVED",
    };

    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: "i" } },     // name search
        { contact: { $regex: search, $options: "i" } },  // mobile search
      ];
    }

    const customers = await Customer.find(searchQuery);

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

        // PARTIAL
        if (type === "partial" && isPartial) match = true;

        // PENDING (includes PARTIAL but not overdue)
        if (
          type === "pending" &&
          (isPending || isPartial) &&
          !isOverdue
        ) {
          match = true;
        }

        // DUE TODAY
        if (type === "due-today" && isDueToday) match = true;

        // OVERDUE
        if (type === "overdue" && isOverdue) match = true;

        if (match) {
          result.push({
            customerId: customer._id,
            emiIndex: index,
            name: customer.name,
            contact: customer.contact,
            model: customer.model,

            amount: emi.amount,
            paidAmount: emi.paidAmount || 0,
            dueDate: emi.dueDate,
            paidDate: emi.paidDate || null,
            penalty: emi.penalty || 0,
            status: emi.status,
            payments: emi.payments || [],
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
