import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDb";
import Customer from "@/models/Customer";

/* =========================
   TYPES (FIXES BUILD ERROR)
========================= */
interface Emi {
  amount: number;
  paidAmount?: number;
  dueDate: Date;
  paidDate?: Date | null;
  status: "PENDING" | "PARTIAL" | "PAID";
  payments?: {
    amount: number;
    date: Date;
  }[];
}

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
        { name: { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await Customer.find(searchQuery);

    const result: any[] = [];

    customers.forEach((customer: any) => {
      customer.emis?.forEach((emi: Emi, index: number) => {
        const due = new Date(emi.dueDate);
        due.setHours(0, 0, 0, 0);

        const isPaid = emi.status === "PAID";
        const isPartial = emi.status === "PARTIAL";
        const isPending = emi.status === "PENDING";
        const isOverdue = !isPaid && due < today;
        const isDueToday = !isPaid && due.getTime() === today.getTime();

        let match = false;

        if (type === "total") match = true;
        if (type === "paid" && isPaid) match = true;
        if (type === "partial" && isPartial) match = true;

        if (
          type === "pending" &&
          (isPending || isPartial) &&
          !isOverdue
        ) {
          match = true;
        }

        if (type === "due-today" && isDueToday) match = true;
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
