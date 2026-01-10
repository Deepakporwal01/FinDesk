import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDb";
import Customer from "@/models/Customer";

/**
 * MARK EMI AS PAID
 * PUT /api/customers/:id/emi/:emiIndex
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string; emiIndex: string }> }
) {
  try {
    await connectDB();

    // ✅ params are STRINGS → must await + parse
    const { id, emiIndex } = await context.params;

    const index = Number(emiIndex); // 👈 IMPORTANT

    console.log("EMI INDEX (raw):", emiIndex);
    console.log("EMI INDEX (number):", index);

    if (Number.isNaN(index)) {
      return NextResponse.json(
        { error: "Invalid EMI index" },
        { status: 400 }
      );
    }

    // 1️⃣ Find customer
    const customer = await Customer.findById(id);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Validate EMI index
    if (!customer.emis || !customer.emis[index]) {
      return NextResponse.json(
        { error: "EMI not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Prevent double payment
    if (customer.emis[index].status === "PAID") {
      return NextResponse.json(
        { message: "EMI already marked as paid" },
        { status: 400 }
      );
    }

    // 4️⃣ Mark EMI as PAID
    customer.emis[index].status = "PAID";
    customer.emis[index].paidDate = new Date();

    // 5️⃣ Save
    await customer.save();

    return NextResponse.json(
      { message: "EMI marked as paid successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE EMI
 * DELETE /api/customers/:id/emi/:emiIndex
 */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string; emiIndex: string }> }
) {
  try {
    await connectDB();

    // ✅ params are STRINGS → must await + parse
    const { id, emiIndex } = await context.params;
    const index = Number(emiIndex);

    if (Number.isNaN(index)) {
      return NextResponse.json(
        { error: "Invalid EMI index" },
        { status: 400 }
      );
    }

    // 1️⃣ Find customer
    const customer = await Customer.findById(id);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Validate EMI index
    if (!customer.emis || !customer.emis[index]) {
      return NextResponse.json(
        { error: "EMI not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Remove EMI
    customer.emis.splice(index, 1);

    // 4️⃣ Save
    await customer.save();

    return NextResponse.json(
      { message: "EMI deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
