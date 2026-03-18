"use client";

import { providerStatuses } from "@/lib/data";
import { Activity, CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "operational":
      return <CheckCircle size={18} className="text-green-400" />;
    case "degraded":
      return <AlertTriangle size={18} className="text-yellow-400" />;
    case "outage":
      return <XCircle size={18} className="text-red-400" />;
    default:
      return <Activity size={18} className="text-gray-400" />;
  }
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "operational":
      return <span className="badge-green">Operational</span>;
    case "degraded":
      return <span className="badge-yellow">Degraded</span>;
    case "outage":
      return <span className="badge-red">Outage</span>;
    default:
      return <span className="badge-blue">{status}</span>;
  }
}

function UptimeBar({ uptime }: { uptime: number }) {
  const segments = 30;
  const downSegments = Math.round((1 - uptime / 100) * segments);

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: segments }).map((_, i) => {
        const isDown = i >= segments - downSegments;
        return (
          <div
            key={i}
            className={`h-6 w-1.5 rounded-sm ${
              isDown ? "bg-red-500/60" : "bg-green-500/60"
            }`}
            title={`Day ${i + 1}`}
          />
        );
      })}
    </div>
  );
}

export default function StatusPage() {
  const allOperational = providerStatuses.every((p) => p.status === "operational");
  const totalIncidents = providerStatuses.reduce((s, p) => s + p.incidents.length, 0);
  const avgUptime = (
    providerStatuses.reduce((s, p) => s + p.uptime30d, 0) / providerStatuses.length
  ).toFixed(2);
  const avgLatency = Math.round(
    providerStatuses.reduce((s, p) => s + p.latencyMs, 0) / providerStatuses.length
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Provider Status</h1>
        <p className="mt-1 text-sm text-gray-400">
          Uptime monitoring and incident tracking across AI providers
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="card">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Overall Status</p>
          <div className="mt-2 flex items-center gap-2">
            {allOperational ? (
              <>
                <CheckCircle size={20} className="text-green-400" />
                <span className="font-semibold text-green-400">All Systems Go</span>
              </>
            ) : (
              <>
                <AlertTriangle size={20} className="text-yellow-400" />
                <span className="font-semibold text-yellow-400">Partial Issues</span>
              </>
            )}
          </div>
        </div>
        <div className="card">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Avg Uptime (30d)</p>
          <p className="mt-1 text-xl font-bold text-white">{avgUptime}%</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Avg Latency</p>
          <p className="mt-1 text-xl font-bold text-white">{avgLatency}ms</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Incidents (30d)</p>
          <p className="mt-1 text-xl font-bold text-white">{totalIncidents}</p>
        </div>
      </div>

      <div className="space-y-4">
        {providerStatuses.map((provider) => (
          <div key={provider.provider} className="card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <StatusIcon status={provider.status} />
                <div>
                  <h3 className="font-semibold text-white">{provider.provider}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <StatusBadge status={provider.status} />
                    <span>{provider.uptime30d}% uptime</span>
                    <span>{provider.latencyMs}ms latency</span>
                  </div>
                </div>
              </div>
              <UptimeBar uptime={provider.uptime30d} />
            </div>

            {provider.incidents.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Recent Incidents
                </p>
                {provider.incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="flex items-start gap-3 rounded-lg bg-[#111827] p-3"
                  >
                    <div className="mt-0.5">
                      {incident.status === "resolved" ? (
                        <CheckCircle size={14} className="text-green-400" />
                      ) : (
                        <Clock size={14} className="text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-200">{incident.title}</p>
                        <span className="text-xs text-gray-500">{incident.date}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                        <span className={
                          incident.status === "resolved" ? "text-green-400" : "text-yellow-400"
                        }>
                          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        </span>
                        <span>Duration: {incident.durationMinutes}m</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
