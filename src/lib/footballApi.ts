import type { FootballApiFixture, FootballApiResponse } from "@/types/api";

const fixtureMocksByDate: Record<string, FootballApiFixture[]> = {
  "2026-05-27": [
    {
      id: "arsenal-vs-chelsea",
      league: "พรีเมียร์ลีก",
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      kickoff: "2026-05-27T19:30:00+07:00",
      venue: "เอมิเรตส์ สเตเดียม",
      status: "พรีเมียม",
      liveStatus: "ถ่ายทอดสด",
    },
    {
      id: "inter-vs-atalanta",
      league: "กัลโช่ เซเรีย อา",
      homeTeam: "Inter",
      awayTeam: "Atalanta",
      kickoff: "2026-05-27T23:00:00+07:00",
      venue: "ซาน ซิโร",
      status: "เผยแพร่แล้ว",
      liveStatus: "รอแข่ง",
    },
    {
      id: "psg-vs-lille",
      league: "ลีกเอิง",
      homeTeam: "PSG",
      awayTeam: "Lille",
      kickoff: "2026-05-28T01:45:00+07:00",
      venue: "ปาร์ก เดส์ แพร็งซ์",
      status: "รอวิเคราะห์",
      liveStatus: "รอแข่ง",
    },
    {
      id: "real-madrid-vs-betis",
      league: "ลาลีกา",
      homeTeam: "Real Madrid",
      awayTeam: "Betis",
      kickoff: "2026-05-27T22:00:00+07:00",
      venue: "ซานติอาโก เบร์นาเบว",
      status: "เผยแพร่แล้ว",
      liveStatus: "รอแข่ง",
    },
  ],
};

export async function fetchDailyFixtures(date: string): Promise<FootballApiResponse> {
  // เมื่อเชื่อม API จริง ให้ใส่ FOOTBALL_API_KEY ใน .env.local
  // ตัวอย่าง:
  // FOOTBALL_API_KEY=your_api_key_here
  await Promise.resolve();

  return {
    source: "mock-football-api",
    syncedAt: new Date().toISOString(),
    date,
    fixtures: fixtureMocksByDate[date] ?? fixtureMocksByDate["2026-05-27"],
  };
}
