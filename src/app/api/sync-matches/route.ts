import { NextResponse } from "next/server";

import { fetchFootballMatches } from "@/lib/footballApi";
import type { FootballApiResponse, SyncRouteResponse } from "@/types/api";

export async function GET() {
  const data = await fetchFootballMatches();

  const response: SyncRouteResponse<FootballApiResponse> = {
    success: true,
    message: "ซิงก์ข้อมูลโปรแกรมแข่งขันสำเร็จด้วยข้อมูลจำลอง",
    data,
  };

  return NextResponse.json(response);
}
