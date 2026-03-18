import { NextRequest, NextResponse } from "next/server";
import { saveArenaVote } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { matchId, modelA, modelB, winner } = body;

  if (!matchId || !modelA || !modelB || !winner) {
    return NextResponse.json(
      { error: "matchId, modelA, modelB, and winner are required" },
      { status: 400 }
    );
  }

  if (!["A", "B", "tie"].includes(winner)) {
    return NextResponse.json(
      { error: "winner must be 'A', 'B', or 'tie'" },
      { status: 400 }
    );
  }

  await saveArenaVote(matchId, modelA, modelB, winner);

  return NextResponse.json({ success: true, matchId, winner });
}
