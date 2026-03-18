"use client";

import { useState, useMemo } from "react";
import { generateHistoricalPricing, models } from "@/lib/data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const lineColors = [
  "#4c6ef5", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#ec4899", "#f97316", "#14b8a6", "#a855f7",
  "#eab308", "#6366f1",
];

export default function HistoricalPricing() {
  const allHistory = useMemo(() => generateHistoricalPricing(), []);
  const trackedModelIds = useMemo(
    () => [...new Set(allHistory.map((h) => h.modelId))],
    [allHistory]
  );
  const modelNameMap = Object.fromEntries(models.map((m) => [m.id, m.name]));

  const [selectedModels, setSelectedModels] = useState<Set<string>>(
    () => new Set(["gpt-4o", "claude-3.5-sonnet", "gemini-1.5-pro", "gemini-1.5-flash", "mistral-large"])
  );
  const [priceType, setPriceType] = useState<"input" | "output">("input");

  const toggleModel = (id: string) => {
    setSelectedModels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const chartData = useMemo(() => {
    const dates = [...new Set(allHistory.map((h) => h.date))].sort();
    return dates.map((date) => {
      const point: Record<string, string | number> = { date };
      for (const modelId of selectedModels) {
        const entry = allHistory.find((h) => h.modelId === modelId && h.date === date);
        if (entry) {
          point[modelId] =
            priceType === "input" ? entry.inputPricePerMTok : entry.outputPricePerMTok;
        }
      }
      return point;
    });
  }, [allHistory, selectedModels, priceType]);

  const selectedArray = [...selectedModels];

  const priceDecreases = useMemo(() => {
    return trackedModelIds.map((id) => {
      const entries = allHistory.filter((h) => h.modelId === id).sort((a, b) => a.date.localeCompare(b.date));
      if (entries.length < 2) return null;
      const first = entries[0];
      const last = entries[entries.length - 1];
      const inputChange =
        first.inputPricePerMTok > 0
          ? ((last.inputPricePerMTok - first.inputPricePerMTok) / first.inputPricePerMTok) * 100
          : 0;
      const outputChange =
        first.outputPricePerMTok > 0
          ? ((last.outputPricePerMTok - first.outputPricePerMTok) / first.outputPricePerMTok) * 100
          : 0;
      return {
        modelId: id,
        name: modelNameMap[id] || id,
        inputChange,
        outputChange,
        startDate: first.date,
        endDate: last.date,
        startInput: first.inputPricePerMTok,
        endInput: last.inputPricePerMTok,
        startOutput: first.outputPricePerMTok,
        endOutput: last.outputPricePerMTok,
      };
    }).filter(Boolean);
  }, [allHistory, trackedModelIds, modelNameMap]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Historical Pricing</h1>
        <p className="mt-1 text-sm text-gray-400">
          Track price decreases over time across AI model providers
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <select
          value={priceType}
          onChange={(e) => setPriceType(e.target.value as "input" | "output")}
          className="select-field w-auto"
        >
          <option value="input">Input Price</option>
          <option value="output">Output Price</option>
        </select>

        <div className="flex flex-wrap gap-2">
          {trackedModelIds.map((id) => (
            <button
              key={id}
              onClick={() => toggleModel(id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedModels.has(id)
                  ? "bg-bolt-600 text-white"
                  : "bg-[#111827] text-gray-400 hover:bg-[#1e2a45] hover:text-white"
              }`}
            >
              {modelNameMap[id] || id}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3555" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              label={{
                value: `${priceType === "input" ? "Input" : "Output"} Price ($/MTok)`,
                angle: -90,
                position: "insideLeft",
                fill: "#9ca3af",
                fontSize: 12,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a2035",
                border: "1px solid #2a3555",
                borderRadius: "8px",
                color: "#e5e7eb",
              }}
              formatter={(value: number, name: string) => [
                `$${value.toFixed(3)}/MTok`,
                modelNameMap[name] || name,
              ]}
              labelStyle={{ color: "#e5e7eb", fontWeight: "bold" }}
            />
            <Legend
              formatter={(value: string) => modelNameMap[value] || value}
              wrapperStyle={{ color: "#9ca3af", fontSize: 12 }}
            />
            {selectedArray.map((modelId, idx) => (
              <Line
                key={modelId}
                type="monotone"
                dataKey={modelId}
                stroke={lineColors[idx % lineColors.length]}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 card overflow-hidden p-0">
        <div className="border-b border-[#2a3555] px-6 py-4">
          <h2 className="font-semibold text-white">Price Change Summary</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header">Model</th>
              <th className="table-header">Period</th>
              <th className="table-header">Input Start</th>
              <th className="table-header">Input End</th>
              <th className="table-header">Input Change</th>
              <th className="table-header">Output Start</th>
              <th className="table-header">Output End</th>
              <th className="table-header">Output Change</th>
            </tr>
          </thead>
          <tbody>
            {priceDecreases.map((item) => {
              if (!item) return null;
              return (
                <tr key={item.modelId} className="transition-colors hover:bg-[#1e2a45]">
                  <td className="table-cell font-medium text-white">{item.name}</td>
                  <td className="table-cell text-xs text-gray-400">
                    {item.startDate} - {item.endDate}
                  </td>
                  <td className="table-cell font-mono text-sm">${item.startInput.toFixed(3)}</td>
                  <td className="table-cell font-mono text-sm">${item.endInput.toFixed(3)}</td>
                  <td className="table-cell">
                    <span
                      className={`font-mono text-sm font-semibold ${
                        item.inputChange < 0
                          ? "text-green-400"
                          : item.inputChange > 0
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {item.inputChange > 0 ? "+" : ""}
                      {item.inputChange.toFixed(1)}%
                    </span>
                  </td>
                  <td className="table-cell font-mono text-sm">${item.startOutput.toFixed(3)}</td>
                  <td className="table-cell font-mono text-sm">${item.endOutput.toFixed(3)}</td>
                  <td className="table-cell">
                    <span
                      className={`font-mono text-sm font-semibold ${
                        item.outputChange < 0
                          ? "text-green-400"
                          : item.outputChange > 0
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {item.outputChange > 0 ? "+" : ""}
                      {item.outputChange.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
