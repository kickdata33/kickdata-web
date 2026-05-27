export type MatchPublicationStatus = "รอวิเคราะห์" | "เผยแพร่แล้ว" | "พรีเมียม";
export type MatchLiveStatus = "รอแข่ง" | "ถ่ายทอดสด";
export type AnalysisSide = "เจ้าบ้าน" | "เสมอ" | "ทีมเยือน";

export type FootballApiFixture = {
  id: string;
  fixtureId: string;
  league: string;
  leagueName: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  kickoffTime: string;
  venue: string;
  status: MatchPublicationStatus;
  liveStatus: MatchLiveStatus;
};

export type FootballApiResponse = {
  source: "mock-football-api" | "api-football";
  syncedAt: string;
  date: string;
  fixtures: FootballApiFixture[];
};

export type OddsApiMarket = {
  matchId: string;
  homePrice: string;
  drawPrice: string;
  awayPrice: string;
  handicapTeam: string;
  handicapLine: string;
  handicapLabel?: string;
  handicapOdds: string;
  overUnderLine: string;
  overOdds: string;
  underOdds: string;
  note: string;
};

export type OddsApiResponse = {
  source: "mock-odds-api";
  syncedAt: string;
  date: string;
  markets: OddsApiMarket[];
  disclaimer: string;
};

export type NormalizedDailyMatch = {
  id: string;
  league: string;
  kickoff: string;
  venue: string;
  homeTeam: string;
  awayTeam: string;
  homePrice: string;
  drawPrice: string;
  awayPrice: string;
  handicapTeam: string;
  handicapLine: string;
  handicapLabel: string;
  handicapOdds: string;
  overUnder: string;
  overOdds: string;
  underOdds: string;
  analysisPercent: number;
  analysisSide: AnalysisSide;
  broadcast: string;
  hasAnalysis: boolean;
  isPremium: boolean;
  liveStatus: MatchLiveStatus;
  status: MatchPublicationStatus;
};

export type SyncRouteResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
