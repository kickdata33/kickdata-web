export type TeamForm = "W" | "D" | "L";

export type Match = {
  id: string;
  league: string;
  kickoff: string;
  venue: string;
  homeTeam: string;
  awayTeam: string;
  homeOdds: string;
  drawOdds: string;
  awayOdds: string;
  confidence: number;
  edge: string;
  xgProjection: string;
  modelLean: string;
  status: "Members only" | "Open";
  tags: string[];
  homeForm: TeamForm[];
  awayForm: TeamForm[];
  summary: string;
  keyAngles: string[];
};
