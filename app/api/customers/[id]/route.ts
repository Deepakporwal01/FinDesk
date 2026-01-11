import { NextRequest, NextResponse } from "next/server";
import Customer from "@/models/Customer";
import { connectDB } from "@/lib/db/connectDb";
import { verifyToken } from "@/lib/db/auth/verifyToken";

/* ======================
   GET → FETCH SINGLE CUSTOMER
====================== */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    verifyToken(req);

    // ✅ FIX: await params
    const { id } = await params;

    const customer = await Customer.findById(id);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (err: any) {
    console.error("❌ GET BY ID ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

/* ======================
   DELETE → REMOVE CUSTOMER
====================== */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = verifyToken(req);

    //ADMIN CHECK
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // ✅ FIX: await params
    const { id } = await params;

    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ DELETE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete customer" },
      { status: 500 }
    );
  }
}
 

 

/* ======================
   UPDATE CUSTOMER
====================== */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    verifyToken(req);

    // ✅ UNWRAP PARAMS (THIS FIXES THE ERROR)
    const { id } = await context.params;

    const body = await req.json();
    console.log("UPDATE BODY:", body);

    const updated = await Customer.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error("❌ UPDATE ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
