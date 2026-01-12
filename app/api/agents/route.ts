import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDb";
import Customer from "@/models/Customer";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // 1️⃣ Get all agents
    const agents = await User.find({ role: "AGENT" })
      .select("_id name email");
     console.log(agents)
    // 2️⃣ Get all customers created by agents
    const customers = await Customer.find({
      "createdBy.role": "AGENT",
    });

    /**
     * agentMap keys:
     *  - agent._id.toString()
     *  - agent.email
     */
    const agentMap: Record<string, any> = {};

    // 3️⃣ Initialize agent map
    agents.forEach((agent: any) => {
      const idKey = agent._id.toString();
      const emailKey = agent.email;

      const base = {
        agentId: idKey,
        agentName: agent.name,
        totalCustomers: 0,
        totalSales: 0,
        pendingCash: 0,
      };

      agentMap[idKey] = base;
      agentMap[emailKey] = base; // ✅ IMPORTANT
    });

    // 4️⃣ Aggregate customers
    customers.forEach((customer: any) => {
      const key = customer.createdBy?.userId;

      if (!key) return;
      if (!agentMap[key]) return; // skip invalid data

      agentMap[key].totalCustomers += 1;

      customer.emis?.forEach((emi: any) => {
        agentMap[key].totalSales += emi.amount || 0;
        agentMap[key].pendingCash +=
          (emi.amount || 0) - (emi.paidAmount || 0);
      });
    });

    /**
     * Deduplicate (because id + email point to same object)
     */
    const uniqueAgents = Object.values(
      Object.values(agentMap).reduce((acc: any, cur: any) => {
        acc[cur.agentId] = cur;
        return acc;
      }, {})
    );

    return NextResponse.json(uniqueAgents);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
