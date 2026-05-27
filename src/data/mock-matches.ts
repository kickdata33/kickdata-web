import type { Match } from "@/types/match";

export const mockMatches: Match[] = [
  {
    id: "arsenal-vs-chelsea",
    league: "Premier League",
    kickoff: "20:30",
    venue: "Emirates Stadium",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    homeOdds: "1.82",
    drawOdds: "3.75",
    awayOdds: "4.20",
    confidence: 81,
    edge: "+7.8%",
    xgProjection: "2.1 - 0.9",
    modelLean: "Arsenal win & over 1.5 goals",
    status: "Members only",
    tags: ["High press edge", "Top-six clash", "Strong home trend"],
    homeForm: ["W", "W", "D", "W", "W"],
    awayForm: ["L", "D", "W", "L", "W"],
    summary:
      "Arsenal's chance creation profile is peaking at home while Chelsea still concede clean entries down their right side.",
    keyAngles: [
      "Arsenal created 2.03 xG per home match across the last six.",
      "Chelsea allowed 14.2 box entries per away match in the same span.",
      "Set-piece mismatch favors Arsenal's aerial volume.",
    ],
  },
  {
    id: "inter-vs-atalanta",
    league: "Serie A",
    kickoff: "23:00",
    venue: "San Siro",
    homeTeam: "Inter",
    awayTeam: "Atalanta",
    homeOdds: "1.95",
    drawOdds: "3.60",
    awayOdds: "3.90",
    confidence: 74,
    edge: "+5.1%",
    xgProjection: "1.8 - 1.1",
    modelLean: "Inter draw no bet",
    status: "Members only",
    tags: ["Transition control", "Elite attack", "Data value"],
    homeForm: ["W", "W", "W", "D", "L"],
    awayForm: ["W", "D", "W", "W", "D"],
    summary:
      "Inter rate best in central progression suppression, which matters against Atalanta's vertical build.",
    keyAngles: [
      "Inter conceded only 0.82 xG per match over the last eight.",
      "Atalanta's away shot quality dropped 18% against top-half teams.",
      "Inter retain the stronger rest defense after turnovers.",
    ],
  },
  {
    id: "psg-vs-lille",
    league: "Ligue 1",
    kickoff: "01:45",
    venue: "Parc des Princes",
    homeTeam: "PSG",
    awayTeam: "Lille",
    homeOdds: "1.56",
    drawOdds: "4.40",
    awayOdds: "5.50",
    confidence: 68,
    edge: "+3.4%",
    xgProjection: "2.4 - 1.2",
    modelLean: "Both teams to score",
    status: "Open",
    tags: ["Attack vs attack", "Open sample", "Goal market"],
    homeForm: ["W", "D", "W", "W", "W"],
    awayForm: ["W", "W", "D", "L", "W"],
    summary:
      "The total-goal environment is elevated with both sides ranking in the top four for non-penalty xG and box touches.",
    keyAngles: [
      "PSG have scored in 17 straight home league matches.",
      "Lille generated 1.61 xG per away match in their last five.",
      "Both teams feature quick wide rotations that stretch low blocks.",
    ],
  },
];

export const oddsRows = [
  {
    match: "Arsenal vs Chelsea",
    market: "1X2",
    bestPrice: "1.82",
    fairPrice: "1.67",
    edge: "+7.8%",
    movement: "Steam up",
    note: "ราคาไหลเข้าฝั่ง Arsenal ตั้งแต่เช้า",
  },
  {
    match: "Inter vs Atalanta",
    market: "DNB",
    bestPrice: "1.51",
    fairPrice: "1.42",
    edge: "+5.1%",
    movement: "Stable",
    note: "ตลาดนิ่ง แต่โมเดลยังให้ value",
  },
  {
    match: "PSG vs Lille",
    market: "BTTS",
    bestPrice: "1.73",
    fairPrice: "1.66",
    edge: "+3.4%",
    movement: "Late push",
    note: "line goals มีแรงซื้อช่วงใกล้ kickoff",
  },
];

export const teamNews = [
  {
    club: "Arsenal",
    status: "Key update",
    headline: "โอเดการ์ด fit, line-breaking passes กลับมาเต็มระบบ",
    detail: "Training report ล่าสุดบอกว่า midfield core พร้อมเกือบเต็ม ทำให้ attacking chain ดูไหลขึ้นมาก.",
  },
  {
    club: "Chelsea",
    status: "Watchlist",
    headline: "CB rotation ยังไม่ชัด, press resistance ต่ำลง",
    detail: "ถ้าเซ็นเตอร์ชุดรองลง start อีกเกม ความเสี่ยงฝั่ง box defending จะสูงขึ้นชัดเจน.",
  },
  {
    club: "Inter",
    status: "Positive",
    headline: "Wing-back pair พร้อม, transition shape ดูแน่น",
    detail: "ข้อมูล training load ชี้ว่าทีมหลักพร้อมลงเกือบครบ เหมาะกับเกมที่ต้องคุมจังหวะ.",
  },
];

export const broadcastPartners = [
  {
    title: "Official Broadcast",
    channel: "beIN SPORTS / TrueVisions",
    description: "เช็กคู่ถ่ายทอดสดก่อน kickoff พร้อมเวลาไทยและทางเลือก stream แบบ official.",
  },
  {
    title: "Data Feed",
    channel: "Opta-style mock center",
    description: "Live momentum, xG swing, odds movement และ tactical tags สำหรับสมาชิก.",
  },
  {
    title: "Member Audio Room",
    channel: "KickData Matchday Live",
    description: "คอมเมนต์เกมสดแบบสั้น กระชับ เน้นตลาดและ tempo ของเกม.",
  },
];

export const heroSignals = [
  { label: "Model Release", value: "07:00 BKK" },
  { label: "Premium Edges", value: "12 signals" },
  { label: "Live Broadcast", value: "8 matches" },
];

export const pricingTiers = [
  {
    name: "Matchday",
    price: "$19",
    cadence: "/month",
    description: "For casual bettors who want one polished card of edges every day.",
    features: ["Daily analysis card", "3 premium match breakdowns", "Basic edge tracker"],
    badge: "Starter",
    cta: "เริ่มดูราคา",
  },
  {
    name: "Pro Analyst",
    price: "$49",
    cadence: "/month",
    description: "The core KickData membership for sharp daily workflow and richer context.",
    features: [
      "Full today analysis dashboard",
      "Detailed match pages",
      "Odds movement notes",
      "Priority Discord room",
    ],
    badge: "Most popular",
    cta: "Join Pro",
  },
  {
    name: "Elite Syndicate",
    price: "$99",
    cadence: "/month",
    description: "For heavy users who want deep insight, faster alerts, and admin-style reporting.",
    features: [
      "Everything in Pro Analyst",
      "Early release models",
      "Bankroll and CLV review",
      "Private Q&A sessions",
    ],
    badge: "VIP",
    cta: "Apply Elite",
  },
];

export const dashboardMetrics = [
  { label: "ROI", value: "+18.4%", note: "30 วันล่าสุด" },
  { label: "Win Rate", value: "61.8%", note: "Premium picks" },
  { label: "Tracked Leagues", value: "18", note: "Europe + global" },
  { label: "Avg. Edge", value: "+5.6%", note: "Model vs market" },
];
