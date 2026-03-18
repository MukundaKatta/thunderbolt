export interface AIModel {
  id: string;
  name: string;
  provider: string;
  inputPricePerMTok: number;
  outputPricePerMTok: number;
  contextLength: number;
  maxOutputTokens: number;
  tokensPerSecond: number;
  qualityScore: number;
  releaseDate: string;
  modality: "text" | "multimodal" | "code" | "embedding" | "image";
  isOpenSource: boolean;
}

export interface HistoricalPrice {
  modelId: string;
  date: string;
  inputPricePerMTok: number;
  outputPricePerMTok: number;
}

export interface ProviderStatus {
  provider: string;
  status: "operational" | "degraded" | "outage";
  uptime30d: number;
  latencyMs: number;
  lastChecked: string;
  incidents: Incident[];
}

export interface Incident {
  id: string;
  title: string;
  status: "resolved" | "investigating" | "monitoring";
  date: string;
  durationMinutes: number;
}

export interface ArenaMatch {
  id: string;
  modelA: string;
  modelB: string;
  prompt: string;
  responseA: string;
  responseB: string;
  winner: "A" | "B" | "tie" | null;
}

export interface EloRating {
  modelId: string;
  rating: number;
  wins: number;
  losses: number;
  ties: number;
}

export interface UsagePattern {
  avgInputTokens: number;
  avgOutputTokens: number;
  requestsPerDay: number;
  prioritySpeed: number;
  priorityQuality: number;
  priorityCost: number;
  useCase: "chatbot" | "code-gen" | "summarization" | "analysis" | "creative" | "embedding" | "general";
}

export interface CostEstimate {
  modelId: string;
  modelName: string;
  provider: string;
  dailyCost: number;
  monthlyCost: number;
  tokensPerSecond: number;
  qualityScore: number;
  overallScore: number;
}

export interface MigrationEstimate {
  fromModel: string;
  toModel: string;
  currentMonthlyCost: number;
  newMonthlyCost: number;
  savings: number;
  savingsPercent: number;
  qualityDelta: number;
  speedDelta: number;
  migrationEffort: "low" | "medium" | "high";
  notes: string[];
}

export type SortField =
  | "name"
  | "provider"
  | "inputPricePerMTok"
  | "outputPricePerMTok"
  | "contextLength"
  | "tokensPerSecond"
  | "qualityScore";

export type SortDirection = "asc" | "desc";

export type ViewSection =
  | "pricing"
  | "speed"
  | "optimizer"
  | "arena"
  | "status"
  | "migration"
  | "estimator"
  | "scatter"
  | "history";
