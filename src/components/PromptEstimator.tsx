"use client";

import { useState, useMemo } from "react";
import { models } from "@/lib/data";
import { Calculator } from "lucide-react";

function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export default function PromptEstimator() {
  const [prompt, setPrompt] = useState("");
  const [expectedOutputTokens, setExpectedOutputTokens] = useState(500);
  const [requestCount, setRequestCount] = useState(1);

  const inputTokens = useMemo(() => estimateTokens(prompt), [prompt]);

  const estimates = useMemo(() => {
    if (inputTokens === 0) return [];

    return models
      .filter((m) => m.modality !== "embedding" && m.modality !== "image")
      .map((model) => {
        const inputCost = (inputTokens / 1_000_000) * model.inputPricePerMTok * requestCount;
        const outputCost = (expectedOutputTokens / 1_000_000) * model.outputPricePerMTok * requestCount;
        const totalCost = inputCost + outputCost;
        const latencyEstimate = expectedOutputTokens / model.tokensPerSecond;

        return {
          id: model.id,
          name: model.name,
          provider: model.provider,
          inputCost,
          outputCost,
          totalCost,
          latencyEstimate,
          qualityScore: model.qualityScore,
        };
      })
      .sort((a, b) => a.totalCost - b.totalCost);
  }, [inputTokens, expectedOutputTokens, requestCount]);

  const cheapest = estimates[0];
  const mostExpensive = estimates[estimates.length - 1];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Prompt Cost Estimator</h1>
        <p className="mt-1 text-sm text-gray-400">
          Paste your prompt to see cost estimates across all providers
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Your Prompt
            </h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste your prompt here..."
              rows={10}
              className="input-field resize-y font-mono text-xs"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <span>{prompt.length} characters</span>
              <span className="font-mono text-bolt-400">{inputTokens.toLocaleString()} estimated tokens</span>
            </div>
          </div>

          <div className="card">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-300">Expected Output Tokens</label>
                <input
                  type="number"
                  value={expectedOutputTokens}
                  onChange={(e) => setExpectedOutputTokens(Math.max(1, Number(e.target.value)))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-300">Number of Requests</label>
                <input
                  type="number"
                  value={requestCount}
                  onChange={(e) => setRequestCount(Math.max(1, Number(e.target.value)))}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {inputTokens > 0 && cheapest && mostExpensive && (
            <div className="card border-bolt-500/30">
              <div className="flex items-center gap-2 text-bolt-400">
                <Calculator size={18} />
                <span className="text-xs font-semibold uppercase tracking-wider">Summary</span>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Cheapest option</span>
                  <span className="font-mono text-green-400">${cheapest.totalCost.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Most expensive</span>
                  <span className="font-mono text-red-400">${mostExpensive.totalCost.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price range</span>
                  <span className="font-mono text-gray-300">
                    {mostExpensive.totalCost > 0
                      ? `${(mostExpensive.totalCost / Math.max(cheapest.totalCost, 0.000001)).toFixed(0)}x`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {inputTokens === 0 ? (
            <div className="card flex h-64 items-center justify-center">
              <div className="text-center">
                <Calculator size={48} className="mx-auto text-gray-600" />
                <p className="mt-3 text-gray-400">Paste a prompt to see cost estimates</p>
              </div>
            </div>
          ) : (
            <div className="card overflow-hidden p-0">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">#</th>
                    <th className="table-header">Model</th>
                    <th className="table-header">Provider</th>
                    <th className="table-header">Input Cost</th>
                    <th className="table-header">Output Cost</th>
                    <th className="table-header">Total Cost</th>
                    <th className="table-header">Est. Latency</th>
                    <th className="table-header">Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {estimates.map((est, idx) => (
                    <tr key={est.id} className="transition-colors hover:bg-[#1e2a45]">
                      <td className="table-cell text-gray-500">{idx + 1}</td>
                      <td className="table-cell font-medium text-white">{est.name}</td>
                      <td className="table-cell text-gray-300">{est.provider}</td>
                      <td className="table-cell font-mono text-xs text-emerald-400">
                        ${est.inputCost.toFixed(6)}
                      </td>
                      <td className="table-cell font-mono text-xs text-emerald-400">
                        ${est.outputCost.toFixed(6)}
                      </td>
                      <td className="table-cell font-mono text-sm font-semibold text-white">
                        ${est.totalCost.toFixed(6)}
                      </td>
                      <td className="table-cell font-mono text-xs text-gray-300">
                        {est.latencyEstimate.toFixed(1)}s
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          est.qualityScore >= 90
                            ? "bg-emerald-500/15 text-emerald-400"
                            : est.qualityScore >= 80
                            ? "bg-blue-500/15 text-blue-400"
                            : est.qualityScore >= 70
                            ? "bg-yellow-500/15 text-yellow-400"
                            : "bg-gray-500/15 text-gray-400"
                        }`}>
                          {est.qualityScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
