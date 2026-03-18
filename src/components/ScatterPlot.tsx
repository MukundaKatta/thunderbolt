"use client";

import { useState, useMemo } from "react";
import { models } from "@/lib/data";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";

const providerColorMap: Record<string, string> = {
  OpenAI: "#22c55e",
  Anthropic: "#f97316",
  Google: "#3b82f6",
  "Google (Open)": "#60a5fa",
  "Meta (via Together)": "#06b6d4",
  Mistral: "#8b5cf6",
  DeepSeek: "#22d3ee",
  Cohere: "#ec4899",
  xAI: "#ef4444",
  Alibaba: "#f59e0b",
  Microsoft: "#14b8a6",
  "01.AI": "#84cc16",
  Databricks: "#f43f5e",
  AI21: "#818cf8",
  Amazon: "#eab308",
};

interface DataPoint {
  name: string;
  provider: string;
  x: number;
  y: number;
  z: number;
  fill: string;
}

type XMetric = "avgPrice" | "inputPrice" | "outputPrice";
type YMetric = "qualityScore" | "tokensPerSecond";

export default function QualityCostScatter() {
  const [xMetric, setXMetric] = useState<XMetric>("avgPrice");
  const [yMetric, setYMetric] = useState<YMetric>("qualityScore");
  const [excludeEmbeddings, setExcludeEmbeddings] = useState(true);
  const [logScale, setLogScale] = useState(true);

  const data = useMemo(() => {
    let filtered = [...models];
    if (excludeEmbeddings) {
      filtered = filtered.filter((m) => m.modality !== "embedding");
    }

    return filtered.map((m): DataPoint => {
      let x: number;
      switch (xMetric) {
        case "inputPrice":
          x = m.inputPricePerMTok;
          break;
        case "outputPrice":
          x = m.outputPricePerMTok;
          break;
        default:
          x = (m.inputPricePerMTok + m.outputPricePerMTok) / 2;
      }

      return {
        name: m.name,
        provider: m.provider,
        x: logScale ? Math.max(x, 0.01) : x,
        y: yMetric === "qualityScore" ? m.qualityScore : m.tokensPerSecond,
        z: m.contextLength / 1000,
        fill: providerColorMap[m.provider] || "#9ca3af",
      };
    });
  }, [xMetric, yMetric, excludeEmbeddings, logScale]);

  const providers = useMemo(() => [...new Set(data.map((d) => d.provider))].sort(), [data]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: DataPoint }> }) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
      <div className="rounded-lg border border-[#2a3555] bg-[#1a2035] px-3 py-2 shadow-lg">
        <p className="font-semibold text-white">{d.name}</p>
        <p className="text-xs text-gray-400">{d.provider}</p>
        <p className="text-xs text-emerald-400">
          Price: ${d.x.toFixed(2)}/MTok
        </p>
        <p className="text-xs text-bolt-400">
          {yMetric === "qualityScore" ? `Quality: ${d.y}` : `Speed: ${d.y} tok/s`}
        </p>
        <p className="text-xs text-gray-400">Context: {d.z}K</p>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Quality vs Cost</h1>
        <p className="mt-1 text-sm text-gray-400">
          Visualize the tradeoff between model quality and pricing
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="mb-1 block text-xs text-gray-400">X Axis (Cost)</label>
          <select value={xMetric} onChange={(e) => setXMetric(e.target.value as XMetric)} className="select-field w-auto">
            <option value="avgPrice">Avg Price/MTok</option>
            <option value="inputPrice">Input Price/MTok</option>
            <option value="outputPrice">Output Price/MTok</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-400">Y Axis</label>
          <select value={yMetric} onChange={(e) => setYMetric(e.target.value as YMetric)} className="select-field w-auto">
            <option value="qualityScore">Quality Score</option>
            <option value="tokensPerSecond">Speed (tok/s)</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-400 mt-5">
          <input
            type="checkbox"
            checked={logScale}
            onChange={(e) => setLogScale(e.target.checked)}
            className="rounded border-gray-600 bg-[#111827] text-bolt-500"
          />
          Log scale (X)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-400 mt-5">
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
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3555" />
            <XAxis
              dataKey="x"
              type="number"
              scale={logScale ? "log" : "auto"}
              domain={logScale ? [0.01, "auto"] : [0, "auto"]}
              name="Price"
              stroke="#9ca3af"
              fontSize={12}
              label={{ value: "Price per MTok ($)", position: "bottom", fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              dataKey="y"
              type="number"
              name={yMetric === "qualityScore" ? "Quality" : "Speed"}
              stroke="#9ca3af"
              fontSize={12}
              label={{
                value: yMetric === "qualityScore" ? "Quality Score" : "Tokens/sec",
                angle: -90,
                position: "insideLeft",
                fill: "#9ca3af",
                fontSize: 12,
              }}
            />
            <ZAxis dataKey="z" range={[40, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={data} shape="circle">
              {data.map((entry, index) => (
                <circle key={index} fill={entry.fill} fillOpacity={0.7} r={6} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 card">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Legend</h3>
        <div className="flex flex-wrap gap-4">
          {providers.map((p) => (
            <div key={p} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: providerColorMap[p] || "#9ca3af" }}
              />
              <span className="text-xs text-gray-300">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
