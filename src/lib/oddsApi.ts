import type { OddsApiMarket, OddsApiResponse } from "@/types/api";

const mockMarkets: OddsApiMarket[] = [
  {
    matchId: "api-arsenal-chelsea",
    homePrice: "1.82",
    drawPrice: "3.75",
    awayPrice: "4.20",
    handicap: "Arsenal -0.5",
    overUnder: "2.75",
    note: "ข้อมูลราคาตลาดใช้เพื่อการวิเคราะห์เชิงสถิติเท่านั้น",
  },
  {
    matchId: "api-inter-atalanta",
    homePrice: "1.95",
    drawPrice: "3.60",
    awayPrice: "3.90",
    handicap: "Inter -0.25",
    overUnder: "2.50",
    note: "ใช้เพื่อเปรียบเทียบข้อมูลก่อนเกมและแนวโน้มของรูปเกม",
  },
  {
    matchId: "api-psg-lille",
    homePrice: "1.56",
    drawPrice: "4.40",
    awayPrice: "5.50",
    handicap: "PSG -1.0",
    overUnder: "3.25",
    note: "ใช้เพื่อประกอบการวิเคราะห์เชิงสถิติ ไม่ใช่เพื่อการรับเดิมพัน",
  },
];

export async function fetchOddsMarkets(): Promise<OddsApiResponse> {
  // เมื่อต่อ API จริง ให้ใส่ API key ใน .env.local
  // ตัวอย่างเช่น ODDS_API_KEY=your_key_here
  // และเปลี่ยนฟังก์ชันนี้ให้เรียก fetch ไปยังผู้ให้บริการข้อมูลจริง
  await Promise.resolve();

  return {
    source: "mock-odds-api",
    syncedAt: new Date().toISOString(),
    markets: mockMarkets,
    disclaimer: "ข้อมูลราคาตลาดทั้งหมดใช้เพื่อการวิเคราะห์เชิงสถิติเท่านั้น",
  };
}
