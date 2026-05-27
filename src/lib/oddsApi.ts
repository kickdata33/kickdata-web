import type { OddsApiMarket, OddsApiResponse } from "@/types/api";

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

export async function fetchDailyOdds(date: string): Promise<OddsApiResponse> {
  // เมื่อเชื่อม API จริง ให้ใส่ ODDS_API_KEY ใน .env.local
  // ตัวอย่าง:
  // ODDS_API_KEY=your_api_key_here
  await Promise.resolve();

  return {
    source: "mock-odds-api",
    syncedAt: new Date().toISOString(),
    date,
    markets: oddsMocksByDate[date] ?? oddsMocksByDate["2026-05-27"],
    disclaimer: "ข้อมูลราคาตลาดทั้งหมดใช้เพื่อการวิเคราะห์เชิงสถิติเท่านั้น",
  };
}
