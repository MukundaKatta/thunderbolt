import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThunderBolt - AI Inference Benchmark & Pricing",
  description: "Compare AI model pricing, speed benchmarks, and quality scores across all major providers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0e1a] text-gray-200 antialiased">
        {children}
      </body>
    </html>
  );
}
