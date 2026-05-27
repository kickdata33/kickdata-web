import type { FootballApiMatch, FootballApiResponse } from "@/types/api";

const mockMatches: FootballApiMatch[] = [
  {
    id: "api-arsenal-chelsea",
    league: "พรีเมียร์ลีก",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    kickoff: "2026-05-27T20:30:00+07:00",
    venue: "เอมิเรตส์ สเตเดียม",
    status: "พรีเมียม",
  },
  {
    id: "api-inter-atalanta",
    league: "กัลโช่ เซเรีย อา",
    homeTeam: "Inter",
    awayTeam: "Atalanta",
    kickoff: "2026-05-27T23:00:00+07:00",
    venue: "ซานซีโร",
    status: "เผยแพร่แล้ว",
  },
  {
    id: "api-psg-lille",
    league: "ลีกเอิง",
    homeTeam: "PSG",
    awayTeam: "Lille",
    kickoff: "2026-05-28T01:45:00+07:00",
    venue: "ปาร์ก เดส์ แพร็งซ์",
    status: "รอวิเคราะห์",
  },
];

export async function fetchFootballMatches(): Promise<FootballApiResponse> {
  // เมื่อต่อ API จริง ให้ใส่ API key ใน .env.local
  // ตัวอย่างเช่น FOOTBALL_API_KEY=your_key_here
  // และเปลี่ยนฟังก์ชันนี้ให้เรียก fetch ไปยังผู้ให้บริการข้อมูลจริง
  await Promise.resolve();

  return {
    source: "mock-football-api",
    syncedAt: new Date().toISOString(),
    matches: mockMatches,
  };
}
