import { NextRequest, NextResponse } from "next/server";
import { models } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");
  const modality = searchParams.get("modality");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy") || "qualityScore";
  const order = searchParams.get("order") || "desc";
  const limit = parseInt(searchParams.get("limit") || "100");
  const offset = parseInt(searchParams.get("offset") || "0");

  let filtered = [...models];

  if (provider) {
    filtered = filtered.filter((m) => m.provider.toLowerCase() === provider.toLowerCase());
  }
  if (modality) {
    filtered = filtered.filter((m) => m.modality === modality);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
    );
  }

  const validSortFields = [
    "name", "provider", "inputPricePerMTok", "outputPricePerMTok",
    "contextLength", "tokensPerSecond", "qualityScore",
  ];
  if (validSortFields.includes(sortBy)) {
    filtered.sort((a, b) => {
      const valA = a[sortBy as keyof typeof a];
      const valB = b[sortBy as keyof typeof b];
      const cmp =
        typeof valA === "string"
          ? valA.localeCompare(valB as string)
          : (valA as number) - (valB as number);
      return order === "asc" ? cmp : -cmp;
    });
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginated,
    total,
    limit,
    offset,
  });
}
