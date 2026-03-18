import { AIModel, HistoricalPrice, ProviderStatus, EloRating, ArenaMatch } from "./types";

export const models: AIModel[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", inputPricePerMTok: 2.50, outputPricePerMTok: 10.00, contextLength: 128000, maxOutputTokens: 16384, tokensPerSecond: 109, qualityScore: 90, releaseDate: "2024-05-13", modality: "multimodal", isOpenSource: false },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", inputPricePerMTok: 0.15, outputPricePerMTok: 0.60, contextLength: 128000, maxOutputTokens: 16384, tokensPerSecond: 141, qualityScore: 82, releaseDate: "2024-07-18", modality: "multimodal", isOpenSource: false },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI", inputPricePerMTok: 10.00, outputPricePerMTok: 30.00, contextLength: 128000, maxOutputTokens: 4096, tokensPerSecond: 48, qualityScore: 86, releaseDate: "2024-04-09", modality: "multimodal", isOpenSource: false },
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI", inputPricePerMTok: 30.00, outputPricePerMTok: 60.00, contextLength: 8192, maxOutputTokens: 8192, tokensPerSecond: 25, qualityScore: 84, releaseDate: "2023-03-14", modality: "text", isOpenSource: false },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", inputPricePerMTok: 0.50, outputPricePerMTok: 1.50, contextLength: 16385, maxOutputTokens: 4096, tokensPerSecond: 95, qualityScore: 68, releaseDate: "2023-11-06", modality: "text", isOpenSource: false },
  { id: "o1", name: "o1", provider: "OpenAI", inputPricePerMTok: 15.00, outputPricePerMTok: 60.00, contextLength: 200000, maxOutputTokens: 100000, tokensPerSecond: 38, qualityScore: 95, releaseDate: "2024-12-17", modality: "multimodal", isOpenSource: false },
  { id: "o1-mini", name: "o1-mini", provider: "OpenAI", inputPricePerMTok: 3.00, outputPricePerMTok: 12.00, contextLength: 128000, maxOutputTokens: 65536, tokensPerSecond: 62, qualityScore: 88, releaseDate: "2024-09-12", modality: "text", isOpenSource: false },
  { id: "o3-mini", name: "o3-mini", provider: "OpenAI", inputPricePerMTok: 1.10, outputPricePerMTok: 4.40, contextLength: 200000, maxOutputTokens: 100000, tokensPerSecond: 72, qualityScore: 91, releaseDate: "2025-01-31", modality: "text", isOpenSource: false },

  { id: "claude-opus-4", name: "Claude Opus 4", provider: "Anthropic", inputPricePerMTok: 15.00, outputPricePerMTok: 75.00, contextLength: 200000, maxOutputTokens: 32000, tokensPerSecond: 42, qualityScore: 96, releaseDate: "2025-05-22", modality: "multimodal", isOpenSource: false },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", provider: "Anthropic", inputPricePerMTok: 3.00, outputPricePerMTok: 15.00, contextLength: 200000, maxOutputTokens: 64000, tokensPerSecond: 78, qualityScore: 93, releaseDate: "2025-05-22", modality: "multimodal", isOpenSource: false },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", inputPricePerMTok: 3.00, outputPricePerMTok: 15.00, contextLength: 200000, maxOutputTokens: 8192, tokensPerSecond: 82, qualityScore: 91, releaseDate: "2024-10-22", modality: "multimodal", isOpenSource: false },
  { id: "claude-3.5-haiku", name: "Claude 3.5 Haiku", provider: "Anthropic", inputPricePerMTok: 0.80, outputPricePerMTok: 4.00, contextLength: 200000, maxOutputTokens: 8192, tokensPerSecond: 120, qualityScore: 83, releaseDate: "2024-11-04", modality: "multimodal", isOpenSource: false },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", inputPricePerMTok: 15.00, outputPricePerMTok: 75.00, contextLength: 200000, maxOutputTokens: 4096, tokensPerSecond: 30, qualityScore: 88, releaseDate: "2024-03-04", modality: "multimodal", isOpenSource: false },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", inputPricePerMTok: 0.25, outputPricePerMTok: 1.25, contextLength: 200000, maxOutputTokens: 4096, tokensPerSecond: 152, qualityScore: 72, releaseDate: "2024-03-13", modality: "multimodal", isOpenSource: false },

  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google", inputPricePerMTok: 0.10, outputPricePerMTok: 0.40, contextLength: 1048576, maxOutputTokens: 8192, tokensPerSecond: 194, qualityScore: 82, releaseDate: "2025-02-05", modality: "multimodal", isOpenSource: false },
  { id: "gemini-2.0-pro", name: "Gemini 2.0 Pro", provider: "Google", inputPricePerMTok: 1.25, outputPricePerMTok: 10.00, contextLength: 2097152, maxOutputTokens: 8192, tokensPerSecond: 68, qualityScore: 89, releaseDate: "2025-03-04", modality: "multimodal", isOpenSource: false },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google", inputPricePerMTok: 1.25, outputPricePerMTok: 5.00, contextLength: 2097152, maxOutputTokens: 8192, tokensPerSecond: 58, qualityScore: 85, releaseDate: "2024-05-24", modality: "multimodal", isOpenSource: false },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "Google", inputPricePerMTok: 0.075, outputPricePerMTok: 0.30, contextLength: 1048576, maxOutputTokens: 8192, tokensPerSecond: 175, qualityScore: 78, releaseDate: "2024-05-24", modality: "multimodal", isOpenSource: false },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google", inputPricePerMTok: 1.25, outputPricePerMTok: 10.00, contextLength: 1048576, maxOutputTokens: 65536, tokensPerSecond: 145, qualityScore: 94, releaseDate: "2025-03-25", modality: "multimodal", isOpenSource: false },

  { id: "llama-3.3-70b", name: "Llama 3.3 70B", provider: "Meta (via Together)", inputPricePerMTok: 0.88, outputPricePerMTok: 0.88, contextLength: 131072, maxOutputTokens: 4096, tokensPerSecond: 75, qualityScore: 80, releaseDate: "2024-12-06", modality: "text", isOpenSource: true },
  { id: "llama-3.1-405b", name: "Llama 3.1 405B", provider: "Meta (via Together)", inputPricePerMTok: 3.50, outputPricePerMTok: 3.50, contextLength: 131072, maxOutputTokens: 4096, tokensPerSecond: 28, qualityScore: 86, releaseDate: "2024-07-23", modality: "text", isOpenSource: true },
  { id: "llama-3.1-70b", name: "Llama 3.1 70B", provider: "Meta (via Together)", inputPricePerMTok: 0.88, outputPricePerMTok: 0.88, contextLength: 131072, maxOutputTokens: 4096, tokensPerSecond: 72, qualityScore: 79, releaseDate: "2024-07-23", modality: "text", isOpenSource: true },
  { id: "llama-3.1-8b", name: "Llama 3.1 8B", provider: "Meta (via Together)", inputPricePerMTok: 0.18, outputPricePerMTok: 0.18, contextLength: 131072, maxOutputTokens: 4096, tokensPerSecond: 185, qualityScore: 62, releaseDate: "2024-07-23", modality: "text", isOpenSource: true },

  { id: "mistral-large", name: "Mistral Large 2", provider: "Mistral", inputPricePerMTok: 2.00, outputPricePerMTok: 6.00, contextLength: 131072, maxOutputTokens: 4096, tokensPerSecond: 55, qualityScore: 83, releaseDate: "2024-07-24", modality: "text", isOpenSource: false },
  { id: "mistral-small", name: "Mistral Small", provider: "Mistral", inputPricePerMTok: 0.20, outputPricePerMTok: 0.60, contextLength: 32768, maxOutputTokens: 4096, tokensPerSecond: 130, qualityScore: 70, releaseDate: "2024-09-18", modality: "text", isOpenSource: false },
  { id: "mixtral-8x22b", name: "Mixtral 8x22B", provider: "Mistral", inputPricePerMTok: 0.90, outputPricePerMTok: 0.90, contextLength: 65536, maxOutputTokens: 4096, tokensPerSecond: 48, qualityScore: 74, releaseDate: "2024-04-17", modality: "text", isOpenSource: true },
  { id: "mixtral-8x7b", name: "Mixtral 8x7B", provider: "Mistral", inputPricePerMTok: 0.24, outputPricePerMTok: 0.24, contextLength: 32768, maxOutputTokens: 4096, tokensPerSecond: 92, qualityScore: 66, releaseDate: "2024-01-08", modality: "text", isOpenSource: true },
  { id: "codestral", name: "Codestral", provider: "Mistral", inputPricePerMTok: 0.30, outputPricePerMTok: 0.90, contextLength: 32768, maxOutputTokens: 4096, tokensPerSecond: 110, qualityScore: 76, releaseDate: "2024-05-29", modality: "code", isOpenSource: false },
  { id: "mistral-nemo", name: "Mistral Nemo", provider: "Mistral", inputPricePerMTok: 0.15, outputPricePerMTok: 0.15, contextLength: 131072, maxOutputTokens: 4096, tokensPerSecond: 135, qualityScore: 68, releaseDate: "2024-07-18", modality: "text", isOpenSource: true },

  { id: "deepseek-v3", name: "DeepSeek V3", provider: "DeepSeek", inputPricePerMTok: 0.27, outputPricePerMTok: 1.10, contextLength: 65536, maxOutputTokens: 8192, tokensPerSecond: 60, qualityScore: 84, releaseDate: "2024-12-26", modality: "text", isOpenSource: true },
  { id: "deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek", inputPricePerMTok: 0.55, outputPricePerMTok: 2.19, contextLength: 65536, maxOutputTokens: 8192, tokensPerSecond: 32, qualityScore: 90, releaseDate: "2025-01-20", modality: "text", isOpenSource: true },
  { id: "deepseek-coder-v2", name: "DeepSeek Coder V2", provider: "DeepSeek", inputPricePerMTok: 0.14, outputPricePerMTok: 0.28, contextLength: 131072, maxOutputTokens: 4096, tokensPerSecond: 88, qualityScore: 75, releaseDate: "2024-06-17", modality: "code", isOpenSource: true },

  { id: "command-r-plus", name: "Command R+", provider: "Cohere", inputPricePerMTok: 2.50, outputPricePerMTok: 10.00, contextLength: 128000, maxOutputTokens: 4096, tokensPerSecond: 44, qualityScore: 78, releaseDate: "2024-04-04", modality: "text", isOpenSource: false },
  { id: "command-r", name: "Command R", provider: "Cohere", inputPricePerMTok: 0.15, outputPricePerMTok: 0.60, contextLength: 128000, maxOutputTokens: 4096, tokensPerSecond: 82, qualityScore: 69, releaseDate: "2024-03-11", modality: "text", isOpenSource: false },
  { id: "embed-v3", name: "Embed v3 English", provider: "Cohere", inputPricePerMTok: 0.10, outputPricePerMTok: 0.00, contextLength: 512, maxOutputTokens: 0, tokensPerSecond: 500, qualityScore: 80, releaseDate: "2024-01-22", modality: "embedding", isOpenSource: false },

  { id: "qwen-2.5-72b", name: "Qwen 2.5 72B", provider: "Alibaba", inputPricePerMTok: 0.90, outputPricePerMTok: 0.90, contextLength: 131072, maxOutputTokens: 8192, tokensPerSecond: 65, qualityScore: 81, releaseDate: "2024-09-19", modality: "text", isOpenSource: true },
  { id: "qwen-2.5-coder-32b", name: "Qwen 2.5 Coder 32B", provider: "Alibaba", inputPricePerMTok: 0.40, outputPricePerMTok: 0.40, contextLength: 131072, maxOutputTokens: 8192, tokensPerSecond: 98, qualityScore: 77, releaseDate: "2024-11-12", modality: "code", isOpenSource: true },
  { id: "qwen-qwq-32b", name: "QwQ 32B", provider: "Alibaba", inputPricePerMTok: 0.30, outputPricePerMTok: 0.30, contextLength: 131072, maxOutputTokens: 32768, tokensPerSecond: 85, qualityScore: 82, releaseDate: "2025-03-06", modality: "text", isOpenSource: true },

  { id: "phi-4", name: "Phi-4", provider: "Microsoft", inputPricePerMTok: 0.07, outputPricePerMTok: 0.07, contextLength: 16384, maxOutputTokens: 4096, tokensPerSecond: 165, qualityScore: 71, releaseDate: "2024-12-12", modality: "text", isOpenSource: true },
  { id: "phi-3.5-moe", name: "Phi-3.5 MoE", provider: "Microsoft", inputPricePerMTok: 0.16, outputPricePerMTok: 0.16, contextLength: 131072, maxOutputTokens: 4096, tokensPerSecond: 105, qualityScore: 69, releaseDate: "2024-08-20", modality: "text", isOpenSource: true },

  { id: "grok-2", name: "Grok 2", provider: "xAI", inputPricePerMTok: 2.00, outputPricePerMTok: 10.00, contextLength: 131072, maxOutputTokens: 4096, tokensPerSecond: 68, qualityScore: 82, releaseDate: "2024-08-13", modality: "text", isOpenSource: false },
  { id: "grok-2-mini", name: "Grok 2 Mini", provider: "xAI", inputPricePerMTok: 0.30, outputPricePerMTok: 0.50, contextLength: 131072, maxOutputTokens: 4096, tokensPerSecond: 142, qualityScore: 72, releaseDate: "2024-08-13", modality: "text", isOpenSource: false },
  { id: "grok-3", name: "Grok 3", provider: "xAI", inputPricePerMTok: 3.00, outputPricePerMTok: 15.00, contextLength: 131072, maxOutputTokens: 16384, tokensPerSecond: 88, qualityScore: 92, releaseDate: "2025-02-17", modality: "text", isOpenSource: false },
  { id: "grok-3-mini", name: "Grok 3 Mini", provider: "xAI", inputPricePerMTok: 0.30, outputPricePerMTok: 0.50, contextLength: 131072, maxOutputTokens: 16384, tokensPerSecond: 155, qualityScore: 78, releaseDate: "2025-02-17", modality: "text", isOpenSource: false },

  { id: "yi-large", name: "Yi-Large", provider: "01.AI", inputPricePerMTok: 3.00, outputPricePerMTok: 3.00, contextLength: 32768, maxOutputTokens: 4096, tokensPerSecond: 40, qualityScore: 73, releaseDate: "2024-05-13", modality: "text", isOpenSource: false },

  { id: "dbrx", name: "DBRX", provider: "Databricks", inputPricePerMTok: 0.75, outputPricePerMTok: 0.75, contextLength: 32768, maxOutputTokens: 4096, tokensPerSecond: 55, qualityScore: 65, releaseDate: "2024-03-27", modality: "text", isOpenSource: true },

  { id: "jamba-1.5-large", name: "Jamba 1.5 Large", provider: "AI21", inputPricePerMTok: 2.00, outputPricePerMTok: 8.00, contextLength: 262144, maxOutputTokens: 4096, tokensPerSecond: 45, qualityScore: 74, releaseDate: "2024-08-22", modality: "text", isOpenSource: false },
  { id: "jamba-1.5-mini", name: "Jamba 1.5 Mini", provider: "AI21", inputPricePerMTok: 0.20, outputPricePerMTok: 0.40, contextLength: 262144, maxOutputTokens: 4096, tokensPerSecond: 110, qualityScore: 64, releaseDate: "2024-08-22", modality: "text", isOpenSource: false },

  { id: "nova-pro", name: "Nova Pro", provider: "Amazon", inputPricePerMTok: 0.80, outputPricePerMTok: 3.20, contextLength: 300000, maxOutputTokens: 5000, tokensPerSecond: 72, qualityScore: 75, releaseDate: "2024-12-03", modality: "multimodal", isOpenSource: false },
  { id: "nova-lite", name: "Nova Lite", provider: "Amazon", inputPricePerMTok: 0.06, outputPricePerMTok: 0.24, contextLength: 300000, maxOutputTokens: 5000, tokensPerSecond: 168, qualityScore: 65, releaseDate: "2024-12-03", modality: "multimodal", isOpenSource: false },
  { id: "nova-micro", name: "Nova Micro", provider: "Amazon", inputPricePerMTok: 0.035, outputPricePerMTok: 0.14, contextLength: 128000, maxOutputTokens: 5000, tokensPerSecond: 210, qualityScore: 58, releaseDate: "2024-12-03", modality: "text", isOpenSource: false },

  { id: "gemma-2-27b", name: "Gemma 2 27B", provider: "Google (Open)", inputPricePerMTok: 0.27, outputPricePerMTok: 0.27, contextLength: 8192, maxOutputTokens: 4096, tokensPerSecond: 88, qualityScore: 70, releaseDate: "2024-06-27", modality: "text", isOpenSource: true },
  { id: "gemma-2-9b", name: "Gemma 2 9B", provider: "Google (Open)", inputPricePerMTok: 0.08, outputPricePerMTok: 0.08, contextLength: 8192, maxOutputTokens: 4096, tokensPerSecond: 152, qualityScore: 62, releaseDate: "2024-06-27", modality: "text", isOpenSource: true },

  { id: "text-embedding-3-large", name: "text-embedding-3-large", provider: "OpenAI", inputPricePerMTok: 0.13, outputPricePerMTok: 0.00, contextLength: 8191, maxOutputTokens: 0, tokensPerSecond: 600, qualityScore: 82, releaseDate: "2024-01-25", modality: "embedding", isOpenSource: false },
  { id: "text-embedding-3-small", name: "text-embedding-3-small", provider: "OpenAI", inputPricePerMTok: 0.02, outputPricePerMTok: 0.00, contextLength: 8191, maxOutputTokens: 0, tokensPerSecond: 800, qualityScore: 72, releaseDate: "2024-01-25", modality: "embedding", isOpenSource: false },
];

export function generateHistoricalPricing(): HistoricalPrice[] {
  const history: HistoricalPrice[] = [];
  const trackedModels = [
    { id: "gpt-4", startInput: 30, startOutput: 60, endInput: 30, endOutput: 60, startDate: "2023-03" },
    { id: "gpt-4-turbo", startInput: 10, startOutput: 30, endInput: 10, endOutput: 30, startDate: "2024-04" },
    { id: "gpt-4o", startInput: 5.0, startOutput: 15.0, endInput: 2.5, endOutput: 10.0, startDate: "2024-05" },
    { id: "gpt-4o-mini", startInput: 0.15, startOutput: 0.60, endInput: 0.15, endOutput: 0.60, startDate: "2024-07" },
    { id: "claude-3-opus", startInput: 15, startOutput: 75, endInput: 15, endOutput: 75, startDate: "2024-03" },
    { id: "claude-3.5-sonnet", startInput: 3, startOutput: 15, endInput: 3, endOutput: 15, startDate: "2024-06" },
    { id: "claude-3-haiku", startInput: 0.25, startOutput: 1.25, endInput: 0.25, endOutput: 1.25, startDate: "2024-03" },
    { id: "gemini-1.5-pro", startInput: 3.50, startOutput: 10.50, endInput: 1.25, endOutput: 5.0, startDate: "2024-05" },
    { id: "gemini-1.5-flash", startInput: 0.35, startOutput: 1.05, endInput: 0.075, endOutput: 0.30, startDate: "2024-05" },
    { id: "llama-3.1-70b", startInput: 0.90, startOutput: 0.90, endInput: 0.88, endOutput: 0.88, startDate: "2024-07" },
    { id: "mistral-large", startInput: 4.0, startOutput: 12.0, endInput: 2.0, endOutput: 6.0, startDate: "2024-02" },
    { id: "deepseek-v3", startInput: 0.27, startOutput: 1.10, endInput: 0.27, endOutput: 1.10, startDate: "2024-12" },
  ];

  const endDate = new Date("2025-03-01");

  for (const tm of trackedModels) {
    const start = new Date(tm.startDate + "-01");
    const totalMonths = Math.floor((endDate.getTime() - start.getTime()) / (30 * 24 * 60 * 60 * 1000));
    for (let m = 0; m <= totalMonths; m++) {
      const d = new Date(start);
      d.setMonth(d.getMonth() + m);
      const progress = totalMonths > 0 ? m / totalMonths : 1;
      history.push({
        modelId: tm.id,
        date: d.toISOString().slice(0, 7),
        inputPricePerMTok: parseFloat((tm.startInput + (tm.endInput - tm.startInput) * progress).toFixed(3)),
        outputPricePerMTok: parseFloat((tm.startOutput + (tm.endOutput - tm.startOutput) * progress).toFixed(3)),
      });
    }
  }

  return history;
}

export const providerStatuses: ProviderStatus[] = [
  {
    provider: "OpenAI",
    status: "operational",
    uptime30d: 99.82,
    latencyMs: 245,
    lastChecked: "2025-03-17T10:30:00Z",
    incidents: [
      { id: "oai-1", title: "Elevated error rates on GPT-4o", status: "resolved", date: "2025-03-10", durationMinutes: 47 },
      { id: "oai-2", title: "API latency spike", status: "resolved", date: "2025-03-02", durationMinutes: 23 },
    ],
  },
  {
    provider: "Anthropic",
    status: "operational",
    uptime30d: 99.95,
    latencyMs: 198,
    lastChecked: "2025-03-17T10:30:00Z",
    incidents: [
      { id: "anth-1", title: "Brief API unavailability", status: "resolved", date: "2025-03-05", durationMinutes: 12 },
    ],
  },
  {
    provider: "Google",
    status: "operational",
    uptime30d: 99.78,
    latencyMs: 310,
    lastChecked: "2025-03-17T10:30:00Z",
    incidents: [
      { id: "goo-1", title: "Gemini API 500 errors", status: "resolved", date: "2025-03-12", durationMinutes: 35 },
      { id: "goo-2", title: "Vertex AI connectivity issues", status: "resolved", date: "2025-03-01", durationMinutes: 65 },
    ],
  },
  {
    provider: "Meta (via Together)",
    status: "operational",
    uptime30d: 99.60,
    latencyMs: 285,
    lastChecked: "2025-03-17T10:30:00Z",
    incidents: [
      { id: "meta-1", title: "Together AI rate limit issues", status: "resolved", date: "2025-03-08", durationMinutes: 90 },
    ],
  },
  {
    provider: "Mistral",
    status: "operational",
    uptime30d: 99.88,
    latencyMs: 220,
    lastChecked: "2025-03-17T10:30:00Z",
    incidents: [],
  },
  {
    provider: "DeepSeek",
    status: "degraded",
    uptime30d: 98.50,
    latencyMs: 520,
    lastChecked: "2025-03-17T10:30:00Z",
    incidents: [
      { id: "ds-1", title: "High demand causing slow responses", status: "monitoring", date: "2025-03-16", durationMinutes: 360 },
      { id: "ds-2", title: "API outage", status: "resolved", date: "2025-03-09", durationMinutes: 120 },
    ],
  },
  {
    provider: "Cohere",
    status: "operational",
    uptime30d: 99.91,
    latencyMs: 195,
    lastChecked: "2025-03-17T10:30:00Z",
    incidents: [],
  },
  {
    provider: "xAI",
    status: "operational",
    uptime30d: 99.72,
    latencyMs: 275,
    lastChecked: "2025-03-17T10:30:00Z",
    incidents: [
      { id: "xai-1", title: "Grok API intermittent failures", status: "resolved", date: "2025-03-06", durationMinutes: 55 },
    ],
  },
  {
    provider: "Amazon",
    status: "operational",
    uptime30d: 99.94,
    latencyMs: 210,
    lastChecked: "2025-03-17T10:30:00Z",
    incidents: [],
  },
  {
    provider: "Alibaba",
    status: "operational",
    uptime30d: 99.65,
    latencyMs: 340,
    lastChecked: "2025-03-17T10:30:00Z",
    incidents: [
      { id: "ali-1", title: "Elevated latency on Qwen models", status: "resolved", date: "2025-03-11", durationMinutes: 40 },
    ],
  },
];

export const eloRatings: EloRating[] = [
  { modelId: "claude-opus-4", rating: 1352, wins: 312, losses: 48, ties: 40 },
  { modelId: "o1", rating: 1338, wins: 295, losses: 55, ties: 50 },
  { modelId: "gemini-2.5-pro", rating: 1325, wins: 280, losses: 62, ties: 58 },
  { modelId: "claude-sonnet-4", rating: 1310, wins: 268, losses: 72, ties: 60 },
  { modelId: "grok-3", rating: 1298, wins: 255, losses: 85, ties: 60 },
  { modelId: "gpt-4o", rating: 1285, wins: 248, losses: 92, ties: 60 },
  { modelId: "claude-3.5-sonnet", rating: 1280, wins: 240, losses: 95, ties: 65 },
  { modelId: "deepseek-r1", rating: 1270, wins: 232, losses: 103, ties: 65 },
  { modelId: "o3-mini", rating: 1262, wins: 225, losses: 110, ties: 65 },
  { modelId: "gemini-2.0-pro", rating: 1248, wins: 218, losses: 117, ties: 65 },
  { modelId: "gpt-4-turbo", rating: 1235, wins: 205, losses: 125, ties: 70 },
  { modelId: "llama-3.1-405b", rating: 1222, wins: 198, losses: 132, ties: 70 },
  { modelId: "mistral-large", rating: 1210, wins: 188, losses: 142, ties: 70 },
  { modelId: "deepseek-v3", rating: 1205, wins: 185, losses: 145, ties: 70 },
  { modelId: "gpt-4", rating: 1198, wins: 180, losses: 150, ties: 70 },
  { modelId: "claude-3.5-haiku", rating: 1180, wins: 170, losses: 160, ties: 70 },
  { modelId: "qwen-2.5-72b", rating: 1172, wins: 165, losses: 165, ties: 70 },
  { modelId: "gpt-4o-mini", rating: 1165, wins: 160, losses: 170, ties: 70 },
  { modelId: "gemini-2.0-flash", rating: 1155, wins: 152, losses: 178, ties: 70 },
  { modelId: "o1-mini", rating: 1148, wins: 148, losses: 182, ties: 70 },
];

const samplePrompts = [
  "Explain quantum entanglement as if you're a pirate captain addressing the crew.",
  "Write a Python function that finds all prime numbers up to N using the Sieve of Eratosthenes.",
  "Compare and contrast the economic policies of Keynesianism and monetarism.",
  "Draft a professional email declining a job offer while maintaining a positive relationship.",
  "Explain the CAP theorem in distributed systems with real-world examples.",
];

export function generateArenaMatch(): ArenaMatch {
  const textModels = models.filter((m) => m.modality !== "embedding" && m.modality !== "image");
  const shuffled = [...textModels].sort(() => Math.random() - 0.5);
  const modelA = shuffled[0];
  const modelB = shuffled[1];
  const prompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];

  return {
    id: `match-${Date.now()}`,
    modelA: modelA.id,
    modelB: modelB.id,
    prompt,
    responseA: generateSampleResponse(modelA.name, prompt),
    responseB: generateSampleResponse(modelB.name, prompt),
    winner: null,
  };
}

function generateSampleResponse(modelName: string, prompt: string): string {
  const responses: Record<string, string[]> = {
    "Explain quantum entanglement": [
      "Quantum entanglement is a phenomenon where two or more particles become interconnected in such a way that the quantum state of each particle cannot be described independently. When particles are entangled, measuring one particle instantly determines the state of the other, regardless of the distance between them. Einstein famously called this 'spooky action at a distance.' In practical terms, if you measure the spin of one entangled electron as 'up,' you instantly know the other is 'down.' This isn't because information travels faster than light, but because the particles share a quantum state from the moment of entanglement. This property is now being harnessed for quantum computing and quantum cryptography.",
      "Imagine you have two magical coins. When you flip them, they always land on opposite sides -- if one is heads, the other is always tails, no matter how far apart they are. That's essentially quantum entanglement. At the subatomic level, particles can become 'entangled,' meaning their properties are correlated in ways that classical physics cannot explain. The measurement of one particle's state instantaneously constrains the possible states of its entangled partner. This has been experimentally verified through Bell test experiments, ruling out local hidden variable theories.",
    ],
    "Write a Python function": [
      "Here's an efficient implementation of the Sieve of Eratosthenes:\n\n```python\ndef sieve_of_eratosthenes(n: int) -> list[int]:\n    if n < 2:\n        return []\n    is_prime = [True] * (n + 1)\n    is_prime[0] = is_prime[1] = False\n    for i in range(2, int(n**0.5) + 1):\n        if is_prime[i]:\n            for j in range(i*i, n + 1, i):\n                is_prime[j] = False\n    return [i for i in range(2, n + 1) if is_prime[i]]\n```\n\nThis runs in O(n log log n) time complexity and uses O(n) space.",
      "```python\ndef find_primes(n: int) -> list[int]:\n    \"\"\"Find all primes up to n using the Sieve of Eratosthenes.\"\"\"\n    if n < 2:\n        return []\n    sieve = [True] * (n + 1)\n    sieve[0] = sieve[1] = False\n    p = 2\n    while p * p <= n:\n        if sieve[p]:\n            for multiple in range(p * p, n + 1, p):\n                sieve[multiple] = False\n        p += 1\n    return [num for num, is_prime in enumerate(sieve) if is_prime]\n```\n\nThe algorithm works by iteratively marking composites starting from each prime's square.",
    ],
  };

  const key = Object.keys(responses).find((k) => prompt.includes(k));
  if (key) {
    const options = responses[key];
    return options[Math.floor(Math.random() * options.length)];
  }

  return `This is a thoughtful response from ${modelName} addressing the prompt. The model provides a comprehensive analysis with clear reasoning, relevant examples, and well-structured arguments. The response demonstrates strong language understanding and generation capabilities, covering the key aspects of the topic while maintaining clarity and coherence throughout.`;
}
