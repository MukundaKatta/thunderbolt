import { NextResponse } from "next/server";
import { providerStatuses } from "@/lib/data";

export async function GET() {
  const summary = {
    allOperational: providerStatuses.every((p) => p.status === "operational"),
    averageUptime: parseFloat(
      (providerStatuses.reduce((s, p) => s + p.uptime30d, 0) / providerStatuses.length).toFixed(2)
    ),
    averageLatencyMs: Math.round(
      providerStatuses.reduce((s, p) => s + p.latencyMs, 0) / providerStatuses.length
    ),
    totalIncidents: providerStatuses.reduce((s, p) => s + p.incidents.length, 0),
    providerCount: providerStatuses.length,
  };

  return NextResponse.json({
    summary,
    providers: providerStatuses,
  });
}
