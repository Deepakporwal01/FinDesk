"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
  
interface Agent {
  agentId: string;
  agentName: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) =>
        setAgents(
          data.map((a: any) => ({
            agentId: a.agentId,
            agentName: a.agentName,
          }))
        )
      );
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* ================= BACK BUTTON ================= */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-black font-medium
                     hover:opacity-70 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* ================= HEADER ================= */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Agents
          </h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Tap an agent to view all customers added by them
          </p>
        </div>

        {/* ================= AGENT LIST ================= */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden">
          {agents.map((agent, index) => (
            <div
              key={agent.agentId}
              onClick={() => router.push(`/agent/${agent.agentId}`)}
              className={`group flex items-center gap-4 px-6 py-5 cursor-pointer transition
                hover:bg-indigo-50/40
                ${index !== agents.length - 1 ? "border-b" : ""}
              `}
            >
              {/* Avatar */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full 
                              bg-gradient-to-br from-indigo-500 to-purple-500 
                              text-white font-bold">
                {agent.agentName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              {/* Name */}
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-900">
                  {agent.agentName}
                </p>
                <p className="text-sm text-gray-500">
                  View customers added by this agent
                </p>
              </div>

              {/* Arrow */}
              <div className="text-gray-400 group-hover:text-indigo-600 transition">
                →
              </div>
            </div>
          ))}

          {agents.length === 0 && (
            <div className="px-6 py-14 text-center text-gray-400">
              No agents found
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
