import { NextRequest, NextResponse } from "next/server";

import { fetchDailyFixtures } from "@/lib/footballApi";
import { normalizeMatchData } from "@/lib/normalizeMatchData";
import { fetchDailyOdds } from "@/lib/oddsApi";
import type { NormalizedDailyMatch, SyncRouteResponse } from "@/types/api";

function getRequestedDate(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (date && date.trim().length > 0) {
    return date;
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function GET(request: NextRequest) {
  const date = getRequestedDate(request);
  const fixturesResponse = await fetchDailyFixtures(date);
  const oddsResponse = await fetchDailyOdds(date);
  const matches = normalizeMatchData(fixturesResponse.fixtures, oddsResponse.markets);

  const response: SyncRouteResponse<{
    synced: true;
    date: string;
    totalMatches: number;
    matches: NormalizedDailyMatch[];
    source: {
      fixtures: string;
      odds: string;
    };
  }> = {
    success: true,
    message: "ซิงก์ข้อมูลคู่บอลรายวันสำเร็จด้วยข้อมูลจำลอง",
    data: {
      synced: true,
      date,
      totalMatches: matches.length,
      matches,
      source: {
        fixtures: fixturesResponse.source,
        odds: oddsResponse.source,
      },
    },
  };

  return NextResponse.json(response);
}
