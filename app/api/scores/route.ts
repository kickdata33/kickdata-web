import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getBangkokDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || getBangkokDate();

  const apiKey = process.env.APIFOOTBALL_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Missing APIFOOTBALL_KEY",
        message: "กรุณาเพิ่ม APIFOOTBALL_KEY ใน .env.local หรือ Vercel Environment Variables",
      },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${date}&timezone=Asia/Bangkok`,
      {
        headers: {
          "x-apisports-key": apiKey,
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "API request failed",
          detail: data,
        },
        { status: res.status }
      );
    }

    const matches = (data.response || []).map((item: any) => ({
      id: item.fixture.id,
      date: item.fixture.date,
      time: new Date(item.fixture.date).toLocaleTimeString("th-TH", {
        timeZone: "Asia/Bangkok",
        hour: "2-digit",
        minute: "2-digit",
      }),
      league: item.league.name,
      country: item.league.country,
      leagueLogo: item.league.logo,
      home: item.teams.home.name,
      away: item.teams.away.name,
      homeLogo: item.teams.home.logo,
      awayLogo: item.teams.away.logo,
      homeGoals: item.goals.home,
      awayGoals: item.goals.away,
      statusShort: item.fixture.status.short,
      statusLong: item.fixture.status.long,
      elapsed: item.fixture.status.elapsed,
    }));

    return NextResponse.json({
      date,
      total: matches.length,
      updatedAt: new Date().toISOString(),
      matches,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server error",
        message: "ไม่สามารถดึงผลบอลได้",
      },
      { status: 500 }
    );
  }
}
