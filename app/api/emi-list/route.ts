import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDb";
import Customer from "@/models/Customer";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const customers = await Customer.find();

  const result: any[] = [];

  customers.forEach((customer) => {
    customer.emis?.forEach((emi: any) => {
      const due = new Date(emi.dueDate);
      due.setHours(0, 0, 0, 0);

      let match = false;

      if (type === "all") match = true;
      if (type === "paid" && emi.status === "PAID") match = true;
      if (type === "pending" && emi.status === "PENDING") match = true;
      if (type === "dueToday" && emi.status === "PENDING" && due.getTime() === today.getTime())
        match = true;

      if (match) {
        result.push({
          customerId: customer._id,
          name: customer.name,
          contact: customer.contact,
          model: customer.model,
          amount: emi.amount,
          dueDate: emi.dueDate,
          status: emi.status,
        });
      }
    });
  });

  return NextResponse.json(result);
}
