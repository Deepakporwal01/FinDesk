import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDb";
import Customer from "@/models/Customer";

/**
 * CREATE CUSTOMER
 * POST /api/customers
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      name,
      fatherName,
      contact,
      model,
      imei,
      price,
      downPayment,
      emiAmount,
      emiMonths,
      firstEmiDate,
    } = body;

    // 🔒 BASIC VALIDATION
    if (!name || !imei || !emiAmount || !emiMonths || !firstEmiDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ❌ PREVENT DUPLICATE IMEI
    const existing = await Customer.findOne({ imei });
    if (existing) {
      return NextResponse.json(
        { error: "Customer with this IMEI already exists" },
        { status: 409 }
      );
    }

    // 🧠 GENERATE EMI SCHEDULE
    const emis = [];
    let dueDate = new Date(firstEmiDate);

    for (let i = 0; i < Number(emiMonths); i++) {
      emis.push({
        amount: Number(emiAmount),
        dueDate: new Date(dueDate),
        status: "PENDING",
        paidDate: null,
      });

      // move to next month
      dueDate.setMonth(dueDate.getMonth() + 1);
    }

    // ✅ CREATE CUSTOMER
    const customer = await Customer.create({
      name,
      fatherName,
      contact,
      model,
      imei,
      price: Number(price),
      downPayment: Number(downPayment),
      emiAmount: Number(emiAmount),
      emis, // 🔥 GENERATED EMIs
    });
console.log(customer)
    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET ALL CUSTOMERS
 * GET /api/customers
 */
export async function GET() {
  try {
    await connectDB();

    const customers = await Customer.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(customers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
