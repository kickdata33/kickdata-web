import type {
  AnalysisSide,
  FootballApiFixture,
  MatchPublicationStatus,
  NormalizedDailyMatch,
  OddsApiMarket,
} from "@/types/api";

const handicapLabelMap: Record<string, string> = {
  "0": "เสมอ",
  "0.25": "ปป.",
  "0.5": "ครึ่งลูก",
  "0.75": "ครึ่งควบลูก",
  "1": "หนึ่งลูก",
  "1.25": "หนึ่งลูกควบลูกครึ่ง",
  "1.5": "ลูกครึ่ง",
  "1.75": "ลูกครึ่งควบสอง",
};

function normalizeHandicapLine(line: string) {
  const normalizedMap: Record<string, string> = {
    "0/0.5": "0.25",
    "0.5/1": "0.75",
    "1/1.5": "1.25",
    "1.5/2": "1.75",
  };

  return normalizedMap[line] ?? line;
}

function getHandicapLabel(line: string, fallback?: string) {
  const normalizedLine = normalizeHandicapLine(line);
  return fallback ?? handicapLabelMap[normalizedLine] ?? "ต่อรองลูก";
}

function inferAnalysisSide(status: MatchPublicationStatus): AnalysisSide {
  if (status === "พรีเมียม") {
    return "เจ้าบ้าน";
  }

  if (status === "เผยแพร่แล้ว") {
    return "เสมอ";
  }

  return "ทีมเยือน";
}

function inferAnalysisPercent(status: MatchPublicationStatus, handicapLine: string) {
  const base = status === "พรีเมียม" ? 76 : status === "เผยแพร่แล้ว" ? 61 : 54;
  const modifier = Number(normalizeHandicapLine(handicapLine)) || 0;

  return Math.min(88, Math.round(base + modifier * 8));
}

export function normalizeMatchData(fixtures: FootballApiFixture[], markets: OddsApiMarket[]): NormalizedDailyMatch[] {
  const marketMap = new Map(markets.map((market) => [market.matchId, market]));

  return fixtures.map((fixture) => {
    const market = marketMap.get(fixture.id);
    const handicapLine = market?.handicapLine ?? "0";
    const handicapLabel = getHandicapLabel(handicapLine, market?.handicapLabel);
    const analysisSide = inferAnalysisSide(fixture.status);

    const handicapTeam =
      market?.handicapTeam === "เจ้าบ้าน"
        ? fixture.homeTeam
        : market?.handicapTeam === "ทีมเยือน"
          ? fixture.awayTeam
          : market?.handicapTeam ?? "";

    return {
      id: fixture.id,
      league: fixture.league,
      kickoff: fixture.kickoff,
      venue: fixture.venue,
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      homePrice: market?.homePrice ?? "-",
      drawPrice: market?.drawPrice ?? "-",
      awayPrice: market?.awayPrice ?? "-",
      handicapTeam,
      handicapLine,
      handicapLabel,
      handicapOdds: market?.handicapOdds ?? "-",
      overUnder: market?.overUnderLine ?? "-",
      overOdds: market?.overOdds ?? "-",
      underOdds: market?.underOdds ?? "-",
      analysisPercent: inferAnalysisPercent(fixture.status, handicapLine),
      analysisSide,
      broadcast: "-",
      hasAnalysis: fixture.status !== "รอวิเคราะห์",
      isPremium: fixture.status === "พรีเมียม",
      liveStatus: fixture.liveStatus,
      status: fixture.status,
    };
  });
}

export { getHandicapLabel, normalizeHandicapLine };
