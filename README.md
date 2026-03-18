# Thunderbolt

LLM API pricing comparison and optimization platform with speed benchmarks, cost calculators, and provider status monitoring.

## Features

- **Pricing Table** -- Side-by-side pricing comparison across major LLM providers
- **Speed Leaderboard** -- Benchmark tokens-per-second across models and providers
- **Cost Optimizer** -- Find the most cost-effective model for your usage patterns
- **Chatbot Arena** -- Head-to-head model quality comparison
- **Provider Status** -- Real-time uptime and latency monitoring for API providers
- **Migration Calculator** -- Estimate costs when switching between providers
- **Prompt Estimator** -- Calculate token usage and costs for specific prompts
- **Scatter Plot** -- Visualize price vs. performance tradeoffs
- **Historical Pricing** -- Track pricing changes over time

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **State Management:** Zustand
- **Database:** Supabase
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone <repository-url>
cd thunderbolt
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
thunderbolt/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── PricingTable.tsx
│   │   ├── SpeedLeaderboard.tsx
│   │   ├── CostOptimizer.tsx
│   │   ├── ChatbotArena.tsx
│   │   ├── StatusPage.tsx
│   │   └── ScatterPlot.tsx
│   └── lib/              # Utilities, store, mock data
├── public/               # Static assets
└── package.json
```

