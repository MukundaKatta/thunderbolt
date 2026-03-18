"use client";

import { useState, useCallback } from "react";
import { generateArenaMatch, eloRatings, models } from "@/lib/data";
import { ArenaMatch, EloRating } from "@/lib/types";
import { saveArenaVote } from "@/lib/supabase";
import { Swords, Trophy, RotateCcw } from "lucide-react";

export default function ChatbotArena() {
  const [match, setMatch] = useState<ArenaMatch>(() => generateArenaMatch());
  const [revealed, setRevealed] = useState(false);
  const [ratings, setRatings] = useState<EloRating[]>(eloRatings);
  const [totalVotes, setTotalVotes] = useState(
    eloRatings.reduce((s, r) => s + r.wins + r.losses + r.ties, 0) / 2
  );

  const modelNameMap = Object.fromEntries(models.map((m) => [m.id, m.name]));

  const vote = useCallback(
    (winner: "A" | "B" | "tie") => {
      const updated = { ...match, winner };
      setMatch(updated);
      setRevealed(true);
      setTotalVotes((v) => v + 1);

      setRatings((prev) => {
        const next = [...prev];
        const idxA = next.findIndex((r) => r.modelId === match.modelA);
        const idxB = next.findIndex((r) => r.modelId === match.modelB);
        if (idxA >= 0 && idxB >= 0) {
          const K = 32;
          const rA = next[idxA].rating;
          const rB = next[idxB].rating;
          const eA = 1 / (1 + Math.pow(10, (rB - rA) / 400));
          const eB = 1 - eA;
          let sA = 0.5;
          let sB = 0.5;
          if (winner === "A") { sA = 1; sB = 0; }
          else if (winner === "B") { sA = 0; sB = 1; }

          next[idxA] = {
            ...next[idxA],
            rating: Math.round(rA + K * (sA - eA)),
            wins: next[idxA].wins + (winner === "A" ? 1 : 0),
            losses: next[idxA].losses + (winner === "B" ? 1 : 0),
            ties: next[idxA].ties + (winner === "tie" ? 1 : 0),
          };
          next[idxB] = {
            ...next[idxB],
            rating: Math.round(rB + K * (sB - eB)),
            wins: next[idxB].wins + (winner === "B" ? 1 : 0),
            losses: next[idxB].losses + (winner === "A" ? 1 : 0),
            ties: next[idxB].ties + (winner === "tie" ? 1 : 0),
          };
        }
        return next.sort((a, b) => b.rating - a.rating);
      });

      saveArenaVote(match.id, match.modelA, match.modelB, winner).catch(() => {});
    },
    [match]
  );

  const nextMatch = () => {
    setMatch(generateArenaMatch());
    setRevealed(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Chatbot Arena</h1>
        <p className="mt-1 text-sm text-gray-400">
          Blind A/B model comparison with ELO-based ranking -- {totalVotes.toLocaleString()} votes cast
        </p>
      </div>

      <div className="mb-6 card">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords size={20} className="text-bolt-400" />
            <h2 className="font-semibold text-white">Battle Arena</h2>
          </div>
          {revealed && (
            <button onClick={nextMatch} className="btn-primary flex items-center gap-2">
              <RotateCcw size={16} />
              Next Match
            </button>
          )}
        </div>

        <div className="mb-4 rounded-lg bg-[#111827] p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Prompt</p>
          <p className="mt-1 text-sm text-gray-200">{match.prompt}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={`rounded-lg border p-4 transition-all ${
            revealed && match.winner === "A"
              ? "border-green-500/50 bg-green-500/5"
              : revealed && match.winner === "B"
              ? "border-red-500/50 bg-red-500/5"
              : "border-[#2a3555] bg-[#111827]"
          }`}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-bolt-400">
                {revealed ? modelNameMap[match.modelA] || match.modelA : "Model A"}
              </span>
              {revealed && match.winner === "A" && (
                <span className="badge-green">Winner</span>
              )}
            </div>
            <p className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">{match.responseA}</p>
          </div>

          <div className={`rounded-lg border p-4 transition-all ${
            revealed && match.winner === "B"
              ? "border-green-500/50 bg-green-500/5"
              : revealed && match.winner === "A"
              ? "border-red-500/50 bg-red-500/5"
              : "border-[#2a3555] bg-[#111827]"
          }`}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-bolt-400">
                {revealed ? modelNameMap[match.modelB] || match.modelB : "Model B"}
              </span>
              {revealed && match.winner === "B" && (
                <span className="badge-green">Winner</span>
              )}
            </div>
            <p className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">{match.responseB}</p>
          </div>
        </div>

        {!revealed && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => vote("A")} className="btn-primary px-6">
              Model A is better
            </button>
            <button onClick={() => vote("tie")} className="btn-secondary px-6">
              Tie
            </button>
            <button onClick={() => vote("B")} className="btn-primary px-6">
              Model B is better
            </button>
          </div>
        )}

        {revealed && match.winner === "tie" && (
          <div className="mt-4 text-center">
            <span className="badge-yellow">Tie declared</span>
          </div>
        )}
      </div>

      <div className="card overflow-hidden p-0">
        <div className="flex items-center gap-2 border-b border-[#2a3555] px-6 py-4">
          <Trophy size={20} className="text-yellow-400" />
          <h2 className="font-semibold text-white">ELO Rankings</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header">Rank</th>
              <th className="table-header">Model</th>
              <th className="table-header">ELO Rating</th>
              <th className="table-header">W/L/T</th>
              <th className="table-header">Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((r, idx) => {
              const total = r.wins + r.losses + r.ties;
              const winRate = total > 0 ? ((r.wins / total) * 100).toFixed(1) : "0.0";
              return (
                <tr key={r.modelId} className="transition-colors hover:bg-[#1e2a45]">
                  <td className="table-cell">
                    {idx === 0 ? (
                      <span className="text-yellow-400 font-bold">1</span>
                    ) : idx === 1 ? (
                      <span className="text-gray-300 font-bold">2</span>
                    ) : idx === 2 ? (
                      <span className="text-amber-600 font-bold">3</span>
                    ) : (
                      <span className="text-gray-500">{idx + 1}</span>
                    )}
                  </td>
                  <td className="table-cell font-medium text-white">
                    {modelNameMap[r.modelId] || r.modelId}
                  </td>
                  <td className="table-cell font-mono font-semibold text-bolt-400">{r.rating}</td>
                  <td className="table-cell font-mono text-sm">
                    <span className="text-green-400">{r.wins}</span>
                    {" / "}
                    <span className="text-red-400">{r.losses}</span>
                    {" / "}
                    <span className="text-gray-400">{r.ties}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-700">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{ width: `${winRate}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-gray-400">{winRate}%</span>
                    </div>
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
