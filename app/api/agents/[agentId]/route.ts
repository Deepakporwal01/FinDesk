import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDb";
import Customer from "@/models/Customer";
import User from "@/models/User";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    await connectDB();

    // ✅ IMPORTANT: await params
    const { agentId } = await params;

    // 1️⃣ Fetch agent (for name + email fallback)
    const agent = await User.findById(agentId).select("name email");

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Fetch ALL customers created by this agent
    const customers = await Customer.find({
      "createdBy.role": "AGENT",
      $or: [
        { "createdBy.userId": agentId },       // new data (ObjectId string)
        { "createdBy.userId": agent.email },   // legacy data
      ],
    }).sort({ createdAt: -1 });

    let totalSales = 0;
    let pendingCash = 0;
    let totalEmis = 0;

    customers.forEach((customer: any) => {
      customer.emis?.forEach((emi: any) => {
        totalEmis++;
        totalSales += emi.amount || 0;
        pendingCash += (emi.amount || 0) - (emi.paidAmount || 0);
      });
    });

    return NextResponse.json({
      agentName: agent.name,
      totalCustomers: customers.length,
      totalSales,
      pendingCash,
      totalEmis,
      customers,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
