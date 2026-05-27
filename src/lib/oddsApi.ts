import type { OddsApiMarket, OddsApiResponse } from "@/types/api";

const oddsEndpoint = "https://v3.football.api-sports.io/odds";
const bangkokTimeZone = "Asia/Bangkok";

const oddsMocksByDate: Record<string, OddsApiMarket[]> = {
  "2026-05-27": [
    {
      matchId: "arsenal-vs-chelsea",
      homePrice: "1.82",
      drawPrice: "3.75",
      awayPrice: "4.20",
      handicapTeam: "Arsenal",
      handicapLine: "0.75",
      handicapLabel: "ครึ่งควบลูก",
      handicapOdds: "0.96",
      overUnderLine: "2.75",
      overOdds: "0.92",
      underOdds: "0.94",
      note: "ข้อมูลราคาตลาดใช้เพื่อการวิเคราะห์เชิงสถิติเท่านั้น",
    },
    {
      matchId: "inter-vs-atalanta",
      homePrice: "1.95",
      drawPrice: "3.60",
      awayPrice: "3.90",
      handicapTeam: "Inter",
      handicapLine: "0.5",
      handicapLabel: "ครึ่งลูก",
      handicapOdds: "0.91",
      overUnderLine: "2.5",
      overOdds: "0.95",
      underOdds: "0.93",
      note: "ใช้เปรียบเทียบราคาตลาดและข้อมูลก่อนเกม",
    },
    {
      matchId: "psg-vs-lille",
      homePrice: "1.56",
      drawPrice: "4.40",
      awayPrice: "5.50",
      handicapTeam: "PSG",
      handicapLine: "1",
      handicapLabel: "หนึ่งลูก",
      handicapOdds: "0.94",
      overUnderLine: "3.25",
      overOdds: "0.90",
      underOdds: "0.96",
      note: "ใช้เป็นข้อมูลประกอบการวิเคราะห์เชิงสถิติ",
    },
    {
      matchId: "real-madrid-vs-betis",
      homePrice: "1.58",
      drawPrice: "4.20",
      awayPrice: "5.40",
      handicapTeam: "Real Madrid",
      handicapLine: "1",
      handicapLabel: "หนึ่งลูก",
      handicapOdds: "0.92",
      overUnderLine: "3",
      overOdds: "0.94",
      underOdds: "0.92",
      note: "ใช้เพื่อเทียบมุมมองข้อมูลกับราคาตลาด",
    },
  ],
};

function getMockOdds(date: string): OddsApiResponse {
  return {
    source: "mock-odds-api",
    syncedAt: new Date().toISOString(),
    date,
    markets: oddsMocksByDate[date] ?? oddsMocksByDate["2026-05-27"],
    disclaimer: "ข้อมูลราคาตลาดทั้งหมดใช้เพื่อการวิเคราะห์เชิงสถิติเท่านั้น",
  };
}

type ApiFootballOddValue = {
  value?: string;
  odd?: string;
  handicap?: string | null;
  main?: boolean;
};

type ApiFootballOddBet = {
  id?: number;
  name?: string;
  values?: ApiFootballOddValue[];
};

type ApiFootballOddBookmaker = {
  id?: number;
  name?: string;
  bets?: ApiFootballOddBet[];
};

type ApiFootballOddItem = {
  fixture?: {
    id?: number;
  };
  bookmakers?: ApiFootballOddBookmaker[];
};

function pickPrimaryValue(values: ApiFootballOddValue[] = [], candidates: string[]) {
  const normalizedCandidates = new Set(candidates.map((candidate) => candidate.toLowerCase()));
  return values.find((value) => value.value && normalizedCandidates.has(value.value.toLowerCase()));
}

function findBet(bookmakers: ApiFootballOddBookmaker[], names: string[]) {
  const normalized = names.map((name) => name.toLowerCase());

  for (const bookmaker of bookmakers) {
    for (const bet of bookmaker.bets ?? []) {
      const betName = bet.name?.toLowerCase();

      if (betName && normalized.some((name) => betName.includes(name))) {
        return bet;
      }
    }
  }

  return undefined;
}

function extractMatchWinner(bookmakers: ApiFootballOddBookmaker[]) {
  const bet = findBet(bookmakers, ["match winner"]);

  if (!bet) {
    return null;
  }

  const home = pickPrimaryValue(bet.values, ["home"]);
  const draw = pickPrimaryValue(bet.values, ["draw"]);
  const away = pickPrimaryValue(bet.values, ["away"]);

  if (!home?.odd || !draw?.odd || !away?.odd) {
    return null;
  }

  return {
    homePrice: home.odd,
    drawPrice: draw.odd,
    awayPrice: away.odd,
  };
}

function extractHandicap(bookmakers: ApiFootballOddBookmaker[]) {
  const bet = findBet(bookmakers, ["asian handicap", "handicap"]);

  if (!bet) {
    return null;
  }

  const values = bet.values ?? [];
  const preferred = values.find((value) => value.main && value.handicap) ?? values.find((value) => value.handicap);

  if (!preferred?.handicap) {
    return null;
  }

  const handicapValue = preferred.handicap.replace("+", "");
  const line = handicapValue.startsWith("-") ? handicapValue.slice(1) : handicapValue;
  const side = preferred.value?.toLowerCase() === "away" ? "away" : "home";

  return {
    handicapTeamSide: side,
    handicapLine: line,
    handicapOdds: preferred.odd ?? "-",
  };
}

function extractOverUnder(bookmakers: ApiFootballOddBookmaker[]) {
  const bet = findBet(bookmakers, ["over/under", "goals over/under"]);

  if (!bet) {
    return null;
  }

  const values = bet.values ?? [];
  const mainValue = values.find((value) => value.main && value.handicap) ?? values.find((value) => value.handicap);

  if (!mainValue?.handicap) {
    return null;
  }

  const over = values.find(
    (value) => value.handicap === mainValue.handicap && value.value?.toLowerCase().includes("over"),
  );
  const under = values.find(
    (value) => value.handicap === mainValue.handicap && value.value?.toLowerCase().includes("under"),
  );

  return {
    overUnderLine: mainValue.handicap,
    overOdds: over?.odd ?? "-",
    underOdds: under?.odd ?? "-",
  };
}

export async function fetchDailyOdds(date: string): Promise<OddsApiResponse> {
  // เมื่อเชื่อม API จริง ให้ใส่ ODDS_API_KEY ใน .env.local
  // หากยังไม่ได้ตั้ง สามารถใช้ FOOTBALL_API_KEY เดียวกันได้
  const apiKey = process.env.ODDS_API_KEY || process.env.FOOTBALL_API_KEY;

  if (!apiKey) {
    console.error("[KickData] ยังไม่พบ ODDS_API_KEY หรือ FOOTBALL_API_KEY ใช้ข้อมูลราคาตลาดจำลองแทน");
    return getMockOdds(date);
  }

  try {
    const params = new URLSearchParams({
      date,
      timezone: bangkokTimeZone,
      page: "1",
    });

    const response = await fetch(`${oddsEndpoint}?${params.toString()}`, {
      method: "GET",
      headers: {
        "x-apisports-key": apiKey,
        Accept: "application/json",
      },
      next: { revalidate: 10800 },
    });

    if (!response.ok) {
      throw new Error(`API-FOOTBALL odds ตอบกลับด้วยสถานะ ${response.status}`);
    }

    const payload = (await response.json()) as { response?: ApiFootballOddItem[] };
    const markets = (payload.response ?? [])
      .map((item) => {
        const fixtureId = String(item.fixture?.id ?? "");
        const bookmakers = item.bookmakers ?? [];
        const matchWinner = extractMatchWinner(bookmakers);
        const handicap = extractHandicap(bookmakers);
        const overUnder = extractOverUnder(bookmakers);

        if (!fixtureId || !matchWinner) {
          return null;
        }

        return {
          matchId: fixtureId,
          homePrice: matchWinner.homePrice,
          drawPrice: matchWinner.drawPrice,
          awayPrice: matchWinner.awayPrice,
          handicapTeam: handicap?.handicapTeamSide === "away" ? "ทีมเยือน" : "เจ้าบ้าน",
          handicapLine: handicap?.handicapLine ?? "0",
          handicapOdds: handicap?.handicapOdds ?? "-",
          overUnderLine: overUnder?.overUnderLine ?? "-",
          overOdds: overUnder?.overOdds ?? "-",
          underOdds: overUnder?.underOdds ?? "-",
          note: "ข้อมูลราคาตลาดใช้เพื่อการวิเคราะห์เชิงสถิติเท่านั้น",
        } satisfies OddsApiMarket;
      })
      .filter((market): market is OddsApiMarket => market !== null);

    if (markets.length === 0) {
      console.error("[KickData] API-FOOTBALL odds ไม่มีข้อมูลที่ map ได้ ใช้ข้อมูลจำลองแทน");
      return getMockOdds(date);
    }

    return {
      source: "api-football-odds",
      syncedAt: new Date().toISOString(),
      date,
      markets,
      disclaimer: "ข้อมูลราคาตลาดทั้งหมดใช้เพื่อการวิเคราะห์เชิงสถิติเท่านั้น",
    };
  } catch (error) {
    console.error("[KickData] ดึงข้อมูล API-FOOTBALL odds ไม่สำเร็จ ใช้ข้อมูลจำลองแทน", error);
    return getMockOdds(date);
  }
}
