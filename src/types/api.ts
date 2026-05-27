export type FootballApiMatch = {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  venue: string;
  status: "รอวิเคราะห์" | "เผยแพร่แล้ว" | "พรีเมียม";
};

export type FootballApiResponse = {
  source: "mock-football-api";
  syncedAt: string;
  matches: FootballApiMatch[];
};

export type OddsApiMarket = {
  matchId: string;
  homePrice: string;
  drawPrice: string;
  awayPrice: string;
  handicap: string;
  overUnder: string;
  note: string;
};

export type OddsApiResponse = {
  source: "mock-odds-api";
  syncedAt: string;
  markets: OddsApiMarket[];
  disclaimer: string;
};

export type SyncRouteResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
