"use client";

import { useMemo, useState } from "react";
import { models } from "@/lib/data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const barColors = [
  "#4c6ef5", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#ec4899", "#f97316", "#14b8a6", "#a855f7",
];

export default function SpeedLeaderboard() {
  const [limit, setLimit] = useState(25);
  const [excludeEmbeddings, setExcludeEmbeddings] = useState(true);

  const data = useMemo(() => {
    let filtered = [...models];
    if (excludeEmbeddings) {
      filtered = filtered.filter((m) => m.modality !== "embedding");
    }
    return filtered
      .sort((a, b) => b.tokensPerSecond - a.tokensPerSecond)
      .slice(0, limit)
      .map((m) => ({
        name: m.name,
        provider: m.provider,
        tokensPerSecond: m.tokensPerSecond,
        qualityScore: m.qualityScore,
      }));
  }, [limit, excludeEmbeddings]);

  const fastest = data[0];
  const avgSpeed = Math.round(data.reduce((sum, d) => sum + d.tokensPerSecond, 0) / data.length);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Speed Leaderboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Tokens per second benchmarks across AI models
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Fastest Model</p>
          <p className="mt-1 text-xl font-bold text-white">{fastest?.name}</p>
          <p className="text-sm text-bolt-400">{fastest?.tokensPerSecond} tok/s</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Average Speed</p>
          <p className="mt-1 text-xl font-bold text-white">{avgSpeed} tok/s</p>
          <p className="text-sm text-gray-400">Across top {data.length} models</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Models Tracked</p>
          <p className="mt-1 text-xl font-bold text-white">{models.length}</p>
          <p className="text-sm text-gray-400">From {new Set(models.map((m) => m.provider)).size} providers</p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="select-field w-auto"
        >
          <option value={10}>Top 10</option>
          <option value={25}>Top 25</option>
          <option value={50}>All Models</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={excludeEmbeddings}
            onChange={(e) => setExcludeEmbeddings(e.target.checked)}
            className="rounded border-gray-600 bg-[#111827] text-bolt-500"
          />
          Exclude embeddings
        </label>
      </div>

      <div className="card">
        <ResponsiveContainer width="100%" height={Math.max(400, data.length * 32)}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3555" />
            <XAxis type="number" stroke="#9ca3af" fontSize={12} />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#9ca3af"
              fontSize={11}
              width={110}
              tick={{ fill: "#d1d5db" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a2035",
                border: "1px solid #2a3555",
                borderRadius: "8px",
                color: "#e5e7eb",
              }}
              formatter={(value: number) => [`${value} tok/s`, "Speed"]}
              labelStyle={{ color: "#e5e7eb", fontWeight: "bold" }}
            />
            <Bar dataKey="tokensPerSecond" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell key={index} fill={barColors[index % barColors.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 card overflow-hidden p-0">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header">Rank</th>
              <th className="table-header">Model</th>
              <th className="table-header">Provider</th>
              <th className="table-header">Tokens/sec</th>
              <th className="table-header">Quality</th>
              <th className="table-header">Speed/Quality Ratio</th>
            </tr>
          </thead>
          <tbody>
            {data.map((model, idx) => (
              <tr key={model.name} className="transition-colors hover:bg-[#1e2a45]">
                <td className="table-cell font-bold text-bolt-400">#{idx + 1}</td>
                <td className="table-cell font-medium text-white">{model.name}</td>
                <td className="table-cell text-gray-300">{model.provider}</td>
                <td className="table-cell font-mono text-emerald-400">{model.tokensPerSecond}</td>
                <td className="table-cell font-mono">{model.qualityScore}</td>
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-700">
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{
                          width: `${Math.min(100, (model.tokensPerSecond / model.qualityScore) * 30)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {(model.tokensPerSecond / model.qualityScore).toFixed(1)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
