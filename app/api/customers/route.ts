import { NextRequest, NextResponse } from "next/server";
import Customer from "@/models/Customer";
import { connectDB } from "@/lib/db/connectDb";
import { verifyToken } from "@/lib/db/auth/verifyToken";

/* ======================
   GET → FETCH CUSTOMERS
====================== */
export async function GET(req: NextRequest) {
  try {
    

    await connectDB();

    const user = verifyToken(req);

    const customers = await Customer.find();

    return NextResponse.json(customers, { status: 200 });
  } catch (err: any) {
    console.error("❌ GET ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

/* ======================
   POST → CREATE CUSTOMER
====================== */
export async function POST(req: NextRequest) {
  try {
    console.log("✅ POST /api/customers HIT");

    await connectDB();

    const user = verifyToken(req);

    const body = await req.json();

    const {
      name,
      fatherName,
      address,
      contact,
      model,
      imei,
      alternateNumber,
      supplier,
      supplierNumber,
      price,
      downPayment,
      emiAmount,
      emiMonths,
      firstEmiDate,
    } = body;

    const exists = await Customer.findOne({ imei });
    if (exists) {
      return NextResponse.json(
        { error: "Customer with this IMEI already exists" },
        { status: 409 }
      );
    }

    const emis = [];
    const date = new Date(firstEmiDate);

    for (let i = 0; i < Number(emiMonths); i++) {
      emis.push({
        amount: Number(emiAmount),
        paidAmount: 0,
        dueDate: new Date(date),
        status: "PENDING",
      });
      date.setMonth(date.getMonth() + 1);
    }

    const customer = await Customer.create({
      name,
      fatherName,
      address,
      contact,
      model,
      imei,
      alternateNumber,
      supplier,
      supplierNumber,
      price,
      downPayment,
      emiAmount,
      emis,
      status: user.role === "ADMIN" ? "APPROVED" : "PENDING",
      createdBy: {
        userId: user.id,
        role: user.role,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (err: any) {
    console.error("❌ POST ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create customer" },
      { status: 500 }
    );
  }
}
