import { NextRequest, NextResponse } from "next/server";
import { models } from "@/lib/data";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    promptText,
    expectedOutputTokens = 500,
    requestCount = 1,
  } = body;

  if (!promptText || typeof promptText !== "string") {
    return NextResponse.json(
      { error: "promptText is required and must be a string" },
      { status: 400 }
    );
  }

  const inputTokens = Math.ceil(promptText.length / 4);

  const estimates = models
    .filter((m) => m.modality !== "embedding" && m.modality !== "image")
    .map((model) => {
      const inputCost = (inputTokens / 1_000_000) * model.inputPricePerMTok * requestCount;
      const outputCost = (expectedOutputTokens / 1_000_000) * model.outputPricePerMTok * requestCount;
      const totalCost = inputCost + outputCost;
      const latencySeconds = expectedOutputTokens / model.tokensPerSecond;

      return {
        modelId: model.id,
        modelName: model.name,
        provider: model.provider,
        inputTokens,
        expectedOutputTokens,
        inputCost: parseFloat(inputCost.toFixed(8)),
        outputCost: parseFloat(outputCost.toFixed(8)),
        totalCost: parseFloat(totalCost.toFixed(8)),
        latencySeconds: parseFloat(latencySeconds.toFixed(2)),
        qualityScore: model.qualityScore,
        requestCount,
      };
    })
    .sort((a, b) => a.totalCost - b.totalCost);

  return NextResponse.json({
    inputTokens,
    modelCount: estimates.length,
    estimates,
  });
}
