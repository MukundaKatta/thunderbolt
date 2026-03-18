"use client";

import { useState, useMemo } from "react";
import { models } from "@/lib/data";
import { UsagePattern, CostEstimate } from "@/lib/types";
import { Lightbulb, TrendingDown, Zap } from "lucide-react";

function calculateCostEstimates(pattern: UsagePattern): CostEstimate[] {
  const textModels = models.filter((m) => m.modality !== "embedding" && m.modality !== "image");

  return textModels
    .map((model) => {
      const inputCostPerReq = (pattern.avgInputTokens / 1_000_000) * model.inputPricePerMTok;
      const outputCostPerReq = (pattern.avgOutputTokens / 1_000_000) * model.outputPricePerMTok;
      const costPerReq = inputCostPerReq + outputCostPerReq;
      const dailyCost = costPerReq * pattern.requestsPerDay;
      const monthlyCost = dailyCost * 30;

      const speedScore = (model.tokensPerSecond / 200) * pattern.prioritySpeed;
      const qualityScoreWeighted = (model.qualityScore / 100) * pattern.priorityQuality;
      const costScore = (1 - Math.min(monthlyCost, 10000) / 10000) * pattern.priorityCost;
      const overallScore = (speedScore + qualityScoreWeighted + costScore) / 3;

      return {
        modelId: model.id,
        modelName: model.name,
        provider: model.provider,
        dailyCost,
        monthlyCost,
        tokensPerSecond: model.tokensPerSecond,
        qualityScore: model.qualityScore,
        overallScore,
      };
    })
    .sort((a, b) => b.overallScore - a.overallScore);
}

export default function CostOptimizer() {
  const [pattern, setPattern] = useState<UsagePattern>({
    avgInputTokens: 1000,
    avgOutputTokens: 500,
    requestsPerDay: 500,
    prioritySpeed: 5,
    priorityQuality: 7,
    priorityCost: 8,
    useCase: "general",
  });

  const estimates = useMemo(() => calculateCostEstimates(pattern), [pattern]);
  const topPick = estimates[0];
  const cheapest = [...estimates].sort((a, b) => a.monthlyCost - b.monthlyCost)[0];
  const highestQuality = [...estimates].sort((a, b) => b.qualityScore - a.qualityScore)[0];

  const updateField = <K extends keyof UsagePattern>(field: K, value: UsagePattern[K]) => {
    setPattern((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Cost Optimizer</h1>
        <p className="mt-1 text-sm text-gray-400">
          Input your usage pattern to find the most cost-effective model
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Usage Pattern</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-300">Avg Input Tokens</label>
                <input
                  type="number"
                  value={pattern.avgInputTokens}
                  onChange={(e) => updateField("avgInputTokens", Math.max(1, Number(e.target.value)))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">Avg Output Tokens</label>
                <input
                  type="number"
                  value={pattern.avgOutputTokens}
                  onChange={(e) => updateField("avgOutputTokens", Math.max(1, Number(e.target.value)))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">Requests per Day</label>
                <input
                  type="number"
                  value={pattern.requestsPerDay}
                  onChange={(e) => updateField("requestsPerDay", Math.max(1, Number(e.target.value)))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">Use Case</label>
                <select
                  value={pattern.useCase}
                  onChange={(e) => updateField("useCase", e.target.value as UsagePattern["useCase"])}
                  className="select-field"
                >
                  <option value="general">General Purpose</option>
                  <option value="chatbot">Chatbot</option>
                  <option value="code-gen">Code Generation</option>
                  <option value="summarization">Summarization</option>
                  <option value="analysis">Analysis</option>
                  <option value="creative">Creative Writing</option>
                  <option value="embedding">Embedding</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Priorities (1-10)</h2>

            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-300">Speed</span>
                  <span className="font-mono text-bolt-400">{pattern.prioritySpeed}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={pattern.prioritySpeed}
                  onChange={(e) => updateField("prioritySpeed", Number(e.target.value))}
                  className="w-full accent-bolt-500"
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-300">Quality</span>
                  <span className="font-mono text-bolt-400">{pattern.priorityQuality}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={pattern.priorityQuality}
                  onChange={(e) => updateField("priorityQuality", Number(e.target.value))}
                  className="w-full accent-bolt-500"
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-300">Cost Savings</span>
                  <span className="font-mono text-bolt-400">{pattern.priorityCost}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={pattern.priorityCost}
                  onChange={(e) => updateField("priorityCost", Number(e.target.value))}
                  className="w-full accent-bolt-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="card border-bolt-500/30">
              <div className="flex items-center gap-2 text-bolt-400">
                <Lightbulb size={18} />
                <span className="text-xs font-semibold uppercase tracking-wider">Best Overall</span>
              </div>
              <p className="mt-2 text-lg font-bold text-white">{topPick?.modelName}</p>
              <p className="text-sm text-gray-400">{topPick?.provider}</p>
              <p className="mt-1 font-mono text-sm text-emerald-400">${topPick?.monthlyCost.toFixed(2)}/mo</p>
            </div>
            <div className="card border-green-500/30">
              <div className="flex items-center gap-2 text-green-400">
                <TrendingDown size={18} />
                <span className="text-xs font-semibold uppercase tracking-wider">Cheapest</span>
              </div>
              <p className="mt-2 text-lg font-bold text-white">{cheapest?.modelName}</p>
              <p className="text-sm text-gray-400">{cheapest?.provider}</p>
              <p className="mt-1 font-mono text-sm text-emerald-400">${cheapest?.monthlyCost.toFixed(2)}/mo</p>
            </div>
            <div className="card border-purple-500/30">
              <div className="flex items-center gap-2 text-purple-400">
                <Zap size={18} />
                <span className="text-xs font-semibold uppercase tracking-wider">Highest Quality</span>
              </div>
              <p className="mt-2 text-lg font-bold text-white">{highestQuality?.modelName}</p>
              <p className="text-sm text-gray-400">{highestQuality?.provider}</p>
              <p className="mt-1 font-mono text-sm text-emerald-400">${highestQuality?.monthlyCost.toFixed(2)}/mo</p>
            </div>
          </div>

          <div className="card overflow-hidden p-0">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Rank</th>
                  <th className="table-header">Model</th>
                  <th className="table-header">Provider</th>
                  <th className="table-header">Monthly Cost</th>
                  <th className="table-header">Speed</th>
                  <th className="table-header">Quality</th>
                  <th className="table-header">Score</th>
                </tr>
              </thead>
              <tbody>
                {estimates.slice(0, 20).map((est, idx) => (
                  <tr key={est.modelId} className="transition-colors hover:bg-[#1e2a45]">
                    <td className="table-cell">
                      {idx === 0 ? (
                        <span className="rounded bg-bolt-600/20 px-2 py-0.5 text-xs font-bold text-bolt-400">
                          #1
                        </span>
                      ) : (
                        <span className="text-gray-500">#{idx + 1}</span>
                      )}
                    </td>
                    <td className="table-cell font-medium text-white">{est.modelName}</td>
                    <td className="table-cell text-gray-300">{est.provider}</td>
                    <td className="table-cell font-mono text-emerald-400">${est.monthlyCost.toFixed(2)}</td>
                    <td className="table-cell font-mono">{est.tokensPerSecond} tok/s</td>
                    <td className="table-cell font-mono">{est.qualityScore}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-700">
                          <div
                            className="h-full rounded-full bg-bolt-500"
                            style={{ width: `${(est.overallScore / 10) * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-gray-400">{est.overallScore.toFixed(1)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
