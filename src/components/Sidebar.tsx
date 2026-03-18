"use client";

import { useAppStore } from "@/lib/store";
import { ViewSection } from "@/lib/types";
import {
  DollarSign,
  Gauge,
  Lightbulb,
  Swords,
  Activity,
  ArrowRightLeft,
  Calculator,
  ScatterChart,
  TrendingDown,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const navItems: { section: ViewSection; label: string; icon: React.ReactNode }[] = [
  { section: "pricing", label: "Pricing Table", icon: <DollarSign size={20} /> },
  { section: "speed", label: "Speed Leaderboard", icon: <Gauge size={20} /> },
  { section: "optimizer", label: "Cost Optimizer", icon: <Lightbulb size={20} /> },
  { section: "arena", label: "Chatbot Arena", icon: <Swords size={20} /> },
  { section: "status", label: "Provider Status", icon: <Activity size={20} /> },
  { section: "migration", label: "Migration Calc", icon: <ArrowRightLeft size={20} /> },
  { section: "estimator", label: "Prompt Estimator", icon: <Calculator size={20} /> },
  { section: "scatter", label: "Quality vs Cost", icon: <ScatterChart size={20} /> },
  { section: "history", label: "Price History", icon: <TrendingDown size={20} /> },
];

export default function Sidebar() {
  const { activeSection, setActiveSection, sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[#2a3555] bg-[#111827] transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-[#2a3555] px-4">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <Zap size={24} className="text-bolt-400" />
            <span className="text-lg font-bold text-white">ThunderBolt</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#1e2a45] hover:text-white"
        >
          {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.section;
            return (
              <li key={item.section}>
                <button
                  onClick={() => setActiveSection(item.section)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-bolt-600/20 text-bolt-400"
                      : "text-gray-400 hover:bg-[#1e2a45] hover:text-white"
                  }`}
                  title={item.label}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {sidebarOpen && (
        <div className="border-t border-[#2a3555] p-4">
          <p className="text-xs text-gray-500">
            Data updated Mar 17, 2025
          </p>
        </div>
      )}
    </aside>
  );
}
