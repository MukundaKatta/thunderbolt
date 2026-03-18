import { NextRequest, NextResponse } from "next/server";
import { generateHistoricalPricing } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const modelId = searchParams.get("modelId");
  const priceType = searchParams.get("priceType") || "input";

  const history = generateHistoricalPricing();
  let filtered = history;

  if (modelId) {
    filtered = filtered.filter((h) => h.modelId === modelId);
  }

  const result = filtered.map((h) => ({
    modelId: h.modelId,
    date: h.date,
    price: priceType === "output" ? h.outputPricePerMTok : h.inputPricePerMTok,
    priceType,
  }));

  return NextResponse.json({
    data: result,
    total: result.length,
  });
}
