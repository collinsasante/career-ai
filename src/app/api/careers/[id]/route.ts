import { NextResponse } from "next/server";
import { CAREERS_DATA } from "@/lib/recommendation/careers-data";


export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const career = CAREERS_DATA.find((c) => c.id === id);

  if (!career) {
    return NextResponse.json(
      { error: "Career not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: { career } });
}
