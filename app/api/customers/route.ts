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

    const customer = await Customer.create(body);
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

    const customers = await Customer.find().sort({ createdAt: -1 });
    return NextResponse.json(customers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
