import type { FootballApiFixture, FootballApiResponse, MatchLiveStatus, MatchPublicationStatus } from "@/types/api";

const bangkokTimeZone = "Asia/Bangkok";
const fixturesEndpoint = "https://v3.football.api-sports.io/fixtures";

const fixtureMocksByDate: Record<string, FootballApiFixture[]> = {
  "2026-05-27": [
    {
      id: "arsenal-vs-chelsea",
      fixtureId: "arsenal-vs-chelsea",
      league: "พรีเมียร์ลีก",
      leagueName: "พรีเมียร์ลีก",
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      kickoff: "2026-05-27T19:30:00+07:00",
      kickoffTime: "2026-05-27T19:30:00+07:00",
      venue: "เอมิเรตส์ สเตเดียม",
      status: "พรีเมียม",
      liveStatus: "ถ่ายทอดสด",
    },
    {
      id: "inter-vs-atalanta",
      fixtureId: "inter-vs-atalanta",
      league: "กัลโช่ เซเรีย อา",
      leagueName: "กัลโช่ เซเรีย อา",
      homeTeam: "Inter",
      awayTeam: "Atalanta",
      kickoff: "2026-05-27T23:00:00+07:00",
      kickoffTime: "2026-05-27T23:00:00+07:00",
      venue: "ซาน ซิโร",
      status: "เผยแพร่แล้ว",
      liveStatus: "รอแข่ง",
    },
    {
      id: "psg-vs-lille",
      fixtureId: "psg-vs-lille",
      league: "ลีกเอิง",
      leagueName: "ลีกเอิง",
      homeTeam: "PSG",
      awayTeam: "Lille",
      kickoff: "2026-05-28T01:45:00+07:00",
      kickoffTime: "2026-05-28T01:45:00+07:00",
      venue: "ปาร์ก เดส์ แพร็งซ์",
      status: "รอวิเคราะห์",
      liveStatus: "รอแข่ง",
    },
    {
      id: "real-madrid-vs-betis",
      fixtureId: "real-madrid-vs-betis",
      league: "ลาลีกา",
      leagueName: "ลาลีกา",
      homeTeam: "Real Madrid",
      awayTeam: "Betis",
      kickoff: "2026-05-27T22:00:00+07:00",
      kickoffTime: "2026-05-27T22:00:00+07:00",
      venue: "ซานติอาโก เบร์นาเบว",
      status: "เผยแพร่แล้ว",
      liveStatus: "รอแข่ง",
    },
  ],
};

function getTodayInBangkok() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: bangkokTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function resolveRequestedDate(date?: string) {
  return date && date.trim().length > 0 ? date : getTodayInBangkok();
}

function getMockFixtures(date: string): FootballApiResponse {
  return {
    source: "mock-football-api",
    syncedAt: new Date().toISOString(),
    date,
    fixtures: fixtureMocksByDate[date] ?? fixtureMocksByDate["2026-05-27"],
  };
}

function inferLiveStatus(shortStatus?: string): MatchLiveStatus {
  const liveStatuses = new Set(["1H", "HT", "2H", "ET", "BT", "P", "LIVE", "INT"]);
  return shortStatus && liveStatuses.has(shortStatus) ? "ถ่ายทอดสด" : "รอแข่ง";
}

function inferPublicationStatus(shortStatus?: string): MatchPublicationStatus {
  if (shortStatus && ["1H", "HT", "2H", "ET", "BT", "P", "LIVE", "INT"].includes(shortStatus)) {
    return "พรีเมียม";
  }

  if (shortStatus && ["NS", "TBD", "PST"].includes(shortStatus)) {
    return "เผยแพร่แล้ว";
  }

  return "รอวิเคราะห์";
}

type ApiFootballFixtureItem = {
  fixture?: {
    id?: number;
    date?: string;
    venue?: {
      name?: string | null;
    };
    status?: {
      short?: string;
    };
  };
  league?: {
    name?: string;
  };
  teams?: {
    home?: {
      name?: string;
    };
    away?: {
      name?: string;
    };
  };
};

export async function fetchDailyFixtures(date?: string): Promise<FootballApiResponse> {
  // เมื่อเชื่อม API จริง ให้ใส่ FOOTBALL_API_KEY ใน .env.local
  // ตัวอย่าง:
  // FOOTBALL_API_KEY=your_api_key_here
  const requestedDate = resolveRequestedDate(date);
  const apiKey = process.env.FOOTBALL_API_KEY;

  if (!apiKey) {
    console.error("[KickData] FOOTBALL_API_KEY ไม่ถูกตั้งค่า ใช้ข้อมูลจำลองแทน");
    return getMockFixtures(requestedDate);
  }

  try {
    const params = new URLSearchParams({
      date: requestedDate,
      timezone: bangkokTimeZone,
    });

    const response = await fetch(`${fixturesEndpoint}?${params.toString()}`, {
      method: "GET",
      headers: {
        "x-apisports-key": apiKey,
        Accept: "application/json",
      },
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      throw new Error(`API-FOOTBALL ตอบกลับด้วยสถานะ ${response.status}`);
    }

    const payload = (await response.json()) as { response?: ApiFootballFixtureItem[] };
    const fixtures = (payload.response ?? []).map((item) => {
      const fixtureId = String(item.fixture?.id ?? "");
      const kickoffTime = item.fixture?.date ?? "";
      const leagueName = item.league?.name ?? "ไม่ระบุลีก";
      const homeTeam = item.teams?.home?.name ?? "-";
      const awayTeam = item.teams?.away?.name ?? "-";
      const shortStatus = item.fixture?.status?.short;

      return {
        id: fixtureId,
        fixtureId,
        league: leagueName,
        leagueName,
        homeTeam,
        awayTeam,
        kickoff: kickoffTime,
        kickoffTime,
        venue: item.fixture?.venue?.name ?? "รอตรวจสอบสนามแข่งขัน",
        status: inferPublicationStatus(shortStatus),
        liveStatus: inferLiveStatus(shortStatus),
      } satisfies FootballApiFixture;
    });

    return {
      source: "api-football",
      syncedAt: new Date().toISOString(),
      date: requestedDate,
      fixtures,
    };
  } catch (error) {
    console.error("[KickData] ดึงข้อมูล API-FOOTBALL ไม่สำเร็จ ใช้ข้อมูลจำลองแทน", error);
    return getMockFixtures(requestedDate);
  }
}
