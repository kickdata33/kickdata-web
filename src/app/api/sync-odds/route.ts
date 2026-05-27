import { NextResponse } from "next/server";

import { fetchOddsMarkets } from "@/lib/oddsApi";
import type { OddsApiResponse, SyncRouteResponse } from "@/types/api";

export async function GET() {
  const data = await fetchOddsMarkets();

  const response: SyncRouteResponse<OddsApiResponse> = {
    success: true,
    message: "ซิงก์ข้อมูลราคาตลาดสำเร็จด้วยข้อมูลจำลอง",
    data,
  };

  return NextResponse.json(response);
}
