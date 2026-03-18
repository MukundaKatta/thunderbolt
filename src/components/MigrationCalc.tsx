"use client";

import { useState, useMemo } from "react";
import { models } from "@/lib/data";
import { MigrationEstimate } from "@/lib/types";
import { ArrowRight, TrendingDown, TrendingUp, Minus } from "lucide-react";

function computeMigration(
  fromId: string,
  toId: string,
  inputTokens: number,
  outputTokens: number,
  requestsPerDay: number
): MigrationEstimate | null {
  const fromModel = models.find((m) => m.id === fromId);
  const toModel = models.find((m) => m.id === toId);
  if (!fromModel || !toModel) return null;

  const fromCostPerReq =
    (inputTokens / 1_000_000) * fromModel.inputPricePerMTok +
    (outputTokens / 1_000_000) * fromModel.outputPricePerMTok;
  const toCostPerReq =
    (inputTokens / 1_000_000) * toModel.inputPricePerMTok +
    (outputTokens / 1_000_000) * toModel.outputPricePerMTok;

  const currentMonthlyCost = fromCostPerReq * requestsPerDay * 30;
  const newMonthlyCost = toCostPerReq * requestsPerDay * 30;
  const savings = currentMonthlyCost - newMonthlyCost;
  const savingsPercent = currentMonthlyCost > 0 ? (savings / currentMonthlyCost) * 100 : 0;
  const qualityDelta = toModel.qualityScore - fromModel.qualityScore;
  const speedDelta = toModel.tokensPerSecond - fromModel.tokensPerSecond;

  const notes: string[] = [];
  let migrationEffort: "low" | "medium" | "high" = "low";

  if (fromModel.provider !== toModel.provider) {
    notes.push("Different provider -- API integration changes required.");
    migrationEffort = "medium";
  }
  if (toModel.contextLength < fromModel.contextLength) {
    notes.push(`Context window shrinks from ${(fromModel.contextLength / 1000).toFixed(0)}K to ${(toModel.contextLength / 1000).toFixed(0)}K.`);
    migrationEffort = "high";
  }
  if (toModel.maxOutputTokens < fromModel.maxOutputTokens) {
    notes.push(`Max output tokens decrease from ${fromModel.maxOutputTokens.toLocaleString()} to ${toModel.maxOutputTokens.toLocaleString()}.`);
  }
  if (qualityDelta < -5) {
    notes.push("Significant quality decrease -- test thoroughly before migrating.");
    migrationEffort = "high";
  }
  if (fromModel.modality !== toModel.modality) {
    notes.push(`Modality change: ${fromModel.modality} to ${toModel.modality}.`);
    migrationEffort = "high";
  }
  if (savings > 0 && qualityDelta >= 0) {
    notes.push("Win-win: lower cost with equal or better quality.");
  }
  if (notes.length === 0) {
    notes.push("Straightforward migration within the same provider ecosystem.");
  }

  return {
    fromModel: fromModel.name,
    toModel: toModel.name,
    currentMonthlyCost,
    newMonthlyCost,
    savings,
    savingsPercent,
    qualityDelta,
    speedDelta,
    migrationEffort,
    notes,
  };
}

export default function MigrationCalc() {
  const textModels = useMemo(() => models.filter((m) => m.modality !== "embedding"), []);
  const [fromId, setFromId] = useState("gpt-4o");
  const [toId, setToId] = useState("claude-sonnet-4");
  const [inputTokens, setInputTokens] = useState(1500);
  const [outputTokens, setOutputTokens] = useState(800);
  const [requestsPerDay, setRequestsPerDay] = useState(1000);

  const result = useMemo(
    () => computeMigration(fromId, toId, inputTokens, outputTokens, requestsPerDay),
    [fromId, toId, inputTokens, outputTokens, requestsPerDay]
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Migration Calculator</h1>
        <p className="mt-1 text-sm text-gray-400">
          Calculate the cost impact of switching between AI models
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="card">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Migration Setup
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-300">From Model</label>
                  <select
                    value={fromId}
                    onChange={(e) => setFromId(e.target.value)}
                    className="select-field"
                  >
                    {textModels.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.provider})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-300">To Model</label>
                  <select
                    value={toId}
                    onChange={(e) => setToId(e.target.value)}
                    className="select-field"
                  >
                    {textModels.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.provider})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">Avg Input Tokens per Request</label>
                <input
                  type="number"
                  value={inputTokens}
                  onChange={(e) => setInputTokens(Math.max(1, Number(e.target.value)))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-300">Avg Output Tokens per Request</label>
                <input
                  type="number"
                  value={outputTokens}
                  onChange={(e) => setOutputTokens(Math.max(1, Number(e.target.value)))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-300">Requests per Day</label>
                <input
                  type="number"
                  value={requestsPerDay}
                  onChange={(e) => setRequestsPerDay(Math.max(1, Number(e.target.value)))}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {result && (
            <>
              <div className="card flex items-center justify-between">
                <div className="text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Current Cost</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    ${result.currentMonthlyCost.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">/month</p>
                </div>
                <ArrowRight size={24} className="text-gray-600" />
                <div className="text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">New Cost</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    ${result.newMonthlyCost.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">/month</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Savings</p>
                  <p className={`mt-1 text-2xl font-bold ${
                    result.savings > 0 ? "text-green-400" : result.savings < 0 ? "text-red-400" : "text-gray-400"
                  }`}>
                    {result.savings >= 0 ? "" : "+"}${Math.abs(result.savings).toFixed(2)}
                  </p>
                  <p className={`text-xs ${
                    result.savingsPercent > 0 ? "text-green-400" : result.savingsPercent < 0 ? "text-red-400" : "text-gray-400"
                  }`}>
                    {result.savingsPercent >= 0 ? "-" : "+"}{Math.abs(result.savingsPercent).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="card text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Quality</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    {result.qualityDelta > 0 ? (
                      <TrendingUp size={16} className="text-green-400" />
                    ) : result.qualityDelta < 0 ? (
                      <TrendingDown size={16} className="text-red-400" />
                    ) : (
                      <Minus size={16} className="text-gray-400" />
                    )}
                    <span className={`font-bold ${
                      result.qualityDelta > 0 ? "text-green-400" : result.qualityDelta < 0 ? "text-red-400" : "text-gray-400"
                    }`}>
                      {result.qualityDelta > 0 ? "+" : ""}{result.qualityDelta} pts
                    </span>
                  </div>
                </div>
                <div className="card text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Speed</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    {result.speedDelta > 0 ? (
                      <TrendingUp size={16} className="text-green-400" />
                    ) : result.speedDelta < 0 ? (
                      <TrendingDown size={16} className="text-red-400" />
                    ) : (
                      <Minus size={16} className="text-gray-400" />
                    )}
                    <span className={`font-bold ${
                      result.speedDelta > 0 ? "text-green-400" : result.speedDelta < 0 ? "text-red-400" : "text-gray-400"
                    }`}>
                      {result.speedDelta > 0 ? "+" : ""}{result.speedDelta} tok/s
                    </span>
                  </div>
                </div>
                <div className="card text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Effort</p>
                  <div className="mt-2">
                    <span className={
                      result.migrationEffort === "low"
                        ? "badge-green"
                        : result.migrationEffort === "medium"
                        ? "badge-yellow"
                        : "badge-red"
                    }>
                      {result.migrationEffort.charAt(0).toUpperCase() + result.migrationEffort.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Migration Notes
                </h3>
                <ul className="space-y-2">
                  {result.notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-bolt-400" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card bg-[#111827]">
                <h3 className="mb-2 text-sm font-semibold text-gray-400">Annual Projection</h3>
                <div className="flex justify-between">
                  <span className="text-gray-300">Current annual cost</span>
                  <span className="font-mono text-white">
                    ${(result.currentMonthlyCost * 12).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Projected annual cost</span>
                  <span className="font-mono text-white">
                    ${(result.newMonthlyCost * 12).toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between border-t border-[#2a3555] pt-2">
                  <span className="font-semibold text-gray-200">Annual savings</span>
                  <span className={`font-mono font-bold ${
                    result.savings > 0 ? "text-green-400" : "text-red-400"
                  }`}>
                    ${(result.savings * 12).toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
