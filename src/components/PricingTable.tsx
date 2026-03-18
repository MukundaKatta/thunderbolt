"use client";

import { useState, useMemo } from "react";
import { models } from "@/lib/data";
import { SortField, SortDirection, AIModel } from "@/lib/types";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter } from "lucide-react";

const providerColors: Record<string, string> = {
  OpenAI: "text-green-400",
  Anthropic: "text-orange-400",
  Google: "text-blue-400",
  "Google (Open)": "text-blue-300",
  "Meta (via Together)": "text-sky-400",
  Mistral: "text-purple-400",
  DeepSeek: "text-cyan-400",
  Cohere: "text-pink-400",
  xAI: "text-red-400",
  Alibaba: "text-amber-400",
  Microsoft: "text-teal-400",
  "01.AI": "text-lime-400",
  Databricks: "text-rose-400",
  AI21: "text-indigo-400",
  Amazon: "text-yellow-400",
};

function formatContext(tokens: number): string {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
  return tokens.toString();
}

function formatPrice(price: number): string {
  if (price === 0) return "N/A";
  if (price < 0.1) return `$${price.toFixed(3)}`;
  if (price < 1) return `$${price.toFixed(2)}`;
  return `$${price.toFixed(2)}`;
}

export default function PricingTable() {
  const [sortField, setSortField] = useState<SortField>("qualityScore");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [search, setSearch] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<Set<string>>(new Set());
  const [selectedModality, setSelectedModality] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const providers = useMemo(() => [...new Set(models.map((m) => m.provider))].sort(), []);
  const modalities = useMemo(() => [...new Set(models.map((m) => m.modality))].sort(), []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir(field === "name" || field === "provider" ? "asc" : "desc");
    }
  };

  const filtered = useMemo(() => {
    let result = [...models];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q)
      );
    }

    if (selectedProviders.size > 0) {
      result = result.filter((m) => selectedProviders.has(m.provider));
    }

    if (selectedModality !== "all") {
      result = result.filter((m) => m.modality === selectedModality);
    }

    result.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      const cmp = typeof valA === "string" ? valA.localeCompare(valB as string) : (valA as number) - (valB as number);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [search, selectedProviders, selectedModality, sortField, sortDir]);

  const toggleProvider = (p: string) => {
    const next = new Set(selectedProviders);
    if (next.has(p)) next.delete(p);
    else next.add(p);
    setSelectedProviders(next);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="ml-1 opacity-30" />;
    return sortDir === "asc" ? (
      <ArrowUp size={14} className="ml-1 text-bolt-400" />
    ) : (
      <ArrowDown size={14} className="ml-1 text-bolt-400" />
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">AI Model Pricing Comparison</h1>
        <p className="mt-1 text-sm text-gray-400">
          Compare pricing, context windows, and capabilities across {models.length} models from {providers.length} providers
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search models or providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        <select
          value={selectedModality}
          onChange={(e) => setSelectedModality(e.target.value)}
          className="select-field w-auto"
        >
          <option value="all">All Modalities</option>
          {modalities.map((m) => (
            <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
          ))}
        </select>

        <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2">
          <Filter size={16} />
          Providers {selectedProviders.size > 0 && `(${selectedProviders.size})`}
        </button>

        <span className="text-sm text-gray-500">{filtered.length} models</span>
      </div>

      {showFilters && (
        <div className="card mb-4">
          <div className="flex flex-wrap gap-2">
            {providers.map((p) => (
              <button
                key={p}
                onClick={() => toggleProvider(p)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedProviders.has(p)
                    ? "bg-bolt-600 text-white"
                    : "bg-[#111827] text-gray-400 hover:bg-[#1e2a45] hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
            {selectedProviders.size > 0 && (
              <button
                onClick={() => setSelectedProviders(new Set())}
                className="rounded-full px-3 py-1 text-xs font-medium text-red-400 hover:text-red-300"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header w-8">#</th>
                <th className="table-header" onClick={() => handleSort("name")}>
                  <span className="flex items-center">Model <SortIcon field="name" /></span>
                </th>
                <th className="table-header" onClick={() => handleSort("provider")}>
                  <span className="flex items-center">Provider <SortIcon field="provider" /></span>
                </th>
                <th className="table-header" onClick={() => handleSort("inputPricePerMTok")}>
                  <span className="flex items-center">Input/MTok <SortIcon field="inputPricePerMTok" /></span>
                </th>
                <th className="table-header" onClick={() => handleSort("outputPricePerMTok")}>
                  <span className="flex items-center">Output/MTok <SortIcon field="outputPricePerMTok" /></span>
                </th>
                <th className="table-header" onClick={() => handleSort("contextLength")}>
                  <span className="flex items-center">Context <SortIcon field="contextLength" /></span>
                </th>
                <th className="table-header" onClick={() => handleSort("tokensPerSecond")}>
                  <span className="flex items-center">Tokens/s <SortIcon field="tokensPerSecond" /></span>
                </th>
                <th className="table-header" onClick={() => handleSort("qualityScore")}>
                  <span className="flex items-center">Quality <SortIcon field="qualityScore" /></span>
                </th>
                <th className="table-header">Type</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((model, idx) => (
                <tr key={model.id} className="transition-colors hover:bg-[#1e2a45]">
                  <td className="table-cell text-gray-500">{idx + 1}</td>
                  <td className="table-cell font-medium text-white">
                    {model.name}
                    {model.isOpenSource && (
                      <span className="ml-2 rounded bg-green-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-green-400">
                        OSS
                      </span>
                    )}
                  </td>
                  <td className={`table-cell font-medium ${providerColors[model.provider] || "text-gray-300"}`}>
                    {model.provider}
                  </td>
                  <td className="table-cell font-mono text-emerald-400">{formatPrice(model.inputPricePerMTok)}</td>
                  <td className="table-cell font-mono text-emerald-400">{formatPrice(model.outputPricePerMTok)}</td>
                  <td className="table-cell font-mono">{formatContext(model.contextLength)}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-700">
                        <div
                          className="h-full rounded-full bg-bolt-500"
                          style={{ width: `${Math.min(100, (model.tokensPerSecond / 800) * 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs">{model.tokensPerSecond}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <QualityBadge score={model.qualityScore} />
                  </td>
                  <td className="table-cell">
                    <span className="rounded bg-[#111827] px-2 py-0.5 text-xs text-gray-400">
                      {model.modality}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function QualityBadge({ score }: { score: number }) {
  let color = "text-gray-400 bg-gray-500/10";
  if (score >= 90) color = "text-emerald-400 bg-emerald-500/15";
  else if (score >= 80) color = "text-blue-400 bg-blue-500/15";
  else if (score >= 70) color = "text-yellow-400 bg-yellow-500/15";
  else if (score >= 60) color = "text-orange-400 bg-orange-500/15";

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>
      {score}
    </span>
  );
}
