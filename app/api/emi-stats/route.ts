import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDb";
import Customer from "@/models/Customer";

export async function GET(req: Request) {
  try {
    await connectDB();

    const customers = await Customer.find();

    let totalEmis = 0;
    let pendingEmis = 0;
    let paidEmis = 0;
    let dueToday = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    customers.forEach((customer) => {
      customer.emis?.forEach((emi: any) => {
        totalEmis++;

        if (emi.status === "PENDING") {
          pendingEmis++;

          const dueDate = new Date(emi.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          if (dueDate.getTime() === today.getTime()) {
            dueToday++;
          }
        }

        if (emi.status === "PAID") {
          paidEmis++;
        }
      });
    });

    return NextResponse.json(
      {
        totalEmis,
        pendingEmis,
        paidEmis,
        dueToday,
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
