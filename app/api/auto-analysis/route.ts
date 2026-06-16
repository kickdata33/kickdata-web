import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

type Match = {
  id: number;
  date: string;
  time: string;
  league: string;
  country: string;
  home: string;
  away: string;
  statusShort: string;
};

function getBangkokDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function fetchMatches(date: string): Promise<Match[]> {
  const apiKey = process.env.APIFOOTBALL_KEY;

  if (!apiKey) {
    throw new Error("Missing APIFOOTBALL_KEY");
  }

  const res = await fetch(
    `https://v3.football.api-sports.io/fixtures?date=${date}&timezone=Asia/Bangkok`,
    {
      headers: {
        "x-apisports-key": apiKey,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok || Object.keys(data.errors || {}).length > 0) {
    throw new Error(JSON.stringify(data.errors || data));
  }

  return (data.response || []).map((item: any) => ({
    id: item.fixture.id,
    date: item.fixture.date,
    time: new Date(item.fixture.date).toLocaleTimeString("th-TH", {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
    }),
    league: item.league.name,
    country: item.league.country,
    home: item.teams.home.name,
    away: item.teams.away.name,
    statusShort: item.fixture.status.short,
  }));
}

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
}

async function analyzeWithAI(matches: Match[]) {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const prompt = `
คุณคือผู้วิเคราะห์ฟุตบอลมืออาชีพของเว็บ KickData

วิเคราะห์คู่บอลต่อไปนี้ แล้วคืนค่าเป็น JSON array เท่านั้น ห้ามมี markdown ห้ามมีคำอธิบายอื่น

กติกา:
- วิเคราะห์เฉพาะแฮนดิแคป และ สูงต่ำ
- handicapPick ต้องเป็น "home" หรือ "away"
- totalPick ต้องเป็น "over" หรือ "under"
- handicapLine เป็นตัวเลข เช่น -0.5, 0.25, -1.25
- totalLine เป็นตัวเลข เช่น 2.25, 2.5, 2.75, 3
- confidence เป็นตัวเลข 1-100
- note เป็นภาษาไทย สั้น กระชับ
- visibility ให้ใช้ "vip30" เป็นค่าเริ่มต้น
- top เป็น true เฉพาะคู่ที่น่าสนใจจริง

ข้อมูลคู่บอล:
${JSON.stringify(matches, null, 2)}

รูปแบบ JSON:
[
  {
    "fixtureId": 123,
    "handicapLine": -0.5,
    "handicapPick": "home",
    "handicapText": "ทีมเหย้า ต่อ -0.5",
    "handicapPercent": 67,
    "totalLine": 2.75,
    "totalPick": "over",
    "totalText": "สูง 2.75",
    "totalPercent": 65,
    "note": "ทรงเกมเปิด มีโอกาสแลกกันสูง",
    "visibility": "vip30",
    "top": false
  }
]
`;

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: prompt,
      temperature: 0.4,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }

  const text =
    data.output_text ||
    data.output?.[0]?.content?.[0]?.text ||
    "";

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const secret = searchParams.get("secret");
  const expectedSecret = process.env.AUTO_ANALYSIS_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const date = searchParams.get("date") || getBangkokDate();

  const maxMatches = Number(process.env.AUTO_ANALYSIS_MAX_MATCHES || 60);

  try {
    const allMatches = await fetchMatches(date);

    const scheduledMatches = allMatches
      .filter((match) => match.statusShort === "NS")
      .slice(0, maxMatches);

    const batches = chunkArray(scheduledMatches, 8);

    let saved = 0;
    let skipped = 0;

    for (const batch of batches) {
      const aiResults = await analyzeWithAI(batch);

      for (const result of aiResults) {
        const match = batch.find((item) => item.id === result.fixtureId);

        if (!match) continue;

        const docId = `${date}_${match.id}`;
        const docRef = adminDb.collection("analysisPicks").doc(docId);
        const oldDoc = await docRef.get();

        if (oldDoc.exists && oldDoc.data()?.manualOverride === true) {
          skipped++;
          continue;
        }

        await docRef.set(
          {
            fixtureId: match.id,
            date,
            time: match.time,
            league: match.league,
            country: match.country,
            home: match.home,
            away: match.away,
            match: `${match.home} vs ${match.away}`,

            handicapLine: Number(result.handicapLine),
            handicapPick: result.handicapPick,
            handicapText: result.handicapText,
            handicapPercent: Number(result.handicapPercent),

            totalLine: Number(result.totalLine),
            totalPick: result.totalPick,
            totalText: result.totalText,
            totalPercent: Number(result.totalPercent),

            note: result.note || "",
            visibility: result.visibility || "vip30",
            top: Boolean(result.top),

            source: "ai",
            manualOverride: false,

            resultStatus: "pending",
            homeScore: null,
            awayScore: null,

            updatedAt: new Date().toISOString(),
            createdAt: oldDoc.exists
              ? oldDoc.data()?.createdAt || new Date().toISOString()
              : new Date().toISOString(),
          },
          { merge: true }
        );

        saved++;
      }
    }

    return NextResponse.json({
      ok: true,
      date,
      totalMatches: allMatches.length,
      scheduledMatches: scheduledMatches.length,
      saved,
      skippedManualOverride: skipped,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Auto analysis failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
