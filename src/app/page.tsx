"use client";

import { useAppStore } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import PricingTable from "@/components/PricingTable";
import SpeedLeaderboard from "@/components/SpeedLeaderboard";
import CostOptimizer from "@/components/CostOptimizer";
import ChatbotArena from "@/components/ChatbotArena";
import StatusPage from "@/components/StatusPage";
import MigrationCalc from "@/components/MigrationCalc";
import PromptEstimator from "@/components/PromptEstimator";
import ScatterPlot from "@/components/ScatterPlot";
import HistoricalPricing from "@/components/HistoricalPricing";

const sectionComponents = {
  pricing: PricingTable,
  speed: SpeedLeaderboard,
  optimizer: CostOptimizer,
  arena: ChatbotArena,
  status: StatusPage,
  migration: MigrationCalc,
  estimator: PromptEstimator,
  scatter: ScatterPlot,
  history: HistoricalPricing,
};

export default function Home() {
  const { activeSection, sidebarOpen } = useAppStore();
  const ActiveComponent = sectionComponents[activeSection];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <div className="p-6 lg:p-8">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}
