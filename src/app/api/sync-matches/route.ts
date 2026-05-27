import { NextResponse } from "next/server";

import { fetchDailyFixtures } from "@/lib/footballApi";
import type { FootballApiResponse, SyncRouteResponse } from "@/types/api";

export async function GET() {
  const data = await fetchDailyFixtures("2026-05-27");

  const response: SyncRouteResponse<FootballApiResponse> = {
    success: true,
    message: "ซิงก์ข้อมูลโปรแกรมแข่งสำเร็จด้วยข้อมูลจำลอง",
    data,
  };

  return NextResponse.json(response);
}
