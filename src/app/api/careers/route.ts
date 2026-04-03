import { NextRequest, NextResponse } from "next/server";
import { CAREERS_DATA } from "@/lib/recommendation/careers-data";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query = searchParams.get("q")?.toLowerCase();

  let careers = CAREERS_DATA;

  if (category && category !== "all") {
    careers = careers.filter((c) => c.category === category);
  }

  if (query) {
    careers = careers.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.required_skills.some((s) => s.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({ data: careers, total: careers.length });
}
