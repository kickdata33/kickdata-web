"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SectionHeading } from "@/components/section-heading";
import { mockMatches } from "@/data/mock-matches";

type FilterKey = "ทั้งหมด" | "ถ่ายทอดสด" | "มีบทวิเคราะห์" | "พรีเมียม";

type TableMatch = {
  id: string;
  league: string;
  kickoff: string;
  isLive: boolean;
  homeTeam: string;
  awayTeam: string;
  marketPrice: string;
  overUnder: string;
  analysisPercent: string;
  broadcast: string;
  hasAnalysis: boolean;
  isPremium: boolean;
};

const filterOptions: FilterKey[] = ["ทั้งหมด", "ถ่ายทอดสด", "มีบทวิเคราะห์", "พรีเมียม"];

const matchEnhancements: Record<
  string,
  Pick<TableMatch, "league" | "isLive" | "overUnder" | "analysisPercent" | "broadcast" | "hasAnalysis" | "isPremium">
> = {
  "arsenal-vs-chelsea": {
    league: "พรีเมียร์ลีก",
    isLive: true,
    overUnder: "2.75",
    analysisPercent: "81%",
    broadcast: "beIN SPORTS 1",
    hasAnalysis: true,
    isPremium: true,
  },
  "inter-vs-atalanta": {
    league: "กัลโช่ เซเรีย อา",
    isLive: false,
    overUnder: "2.50",
    analysisPercent: "74%",
    broadcast: "ทรู พรีเมียร์ ฟุตบอล 3",
    hasAnalysis: true,
    isPremium: true,
  },
  "psg-vs-lille": {
    league: "ลีกเอิง",
    isLive: false,
    overUnder: "3.25",
    analysisPercent: "68%",
    broadcast: "beIN SPORTS 3",
    hasAnalysis: true,
    isPremium: false,
  },
};

function toMinutes(kickoff: string) {
  const [hour, minute] = kickoff.split(":").map(Number);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return 0;
  }

  return hour * 60 + minute;
}

function normalizeMatches(): TableMatch[] {
  return mockMatches
    .map((match) => {
      const extra = matchEnhancements[match.id];

      return {
        id: match.id,
        league: extra?.league ?? match.league,
        kickoff: match.kickoff,
        isLive: extra?.isLive ?? false,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        marketPrice: `${match.homeOdds} / ${match.drawOdds} / ${match.awayOdds}`,
        overUnder: extra?.overUnder ?? "-",
        analysisPercent: extra?.analysisPercent ?? `${match.confidence}%`,
        broadcast: extra?.broadcast ?? "รอตรวจสอบ",
        hasAnalysis: extra?.hasAnalysis ?? true,
        isPremium: extra?.isPremium ?? false,
      };
    })
    .sort((a, b) => toMinutes(a.kickoff) - toMinutes(b.kickoff));
}

export default function TodayAnalysisPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ทั้งหมด");
  const [search, setSearch] = useState("");

  const matches = useMemo(() => normalizeMatches(), []);

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const keyword = search.trim().toLowerCase();
      const searchableText = `${match.league} ${match.homeTeam} ${match.awayTeam}`.toLowerCase();
      const passSearch = keyword.length === 0 || searchableText.includes(keyword);

      if (!passSearch) {
        return false;
      }

      if (activeFilter === "ถ่ายทอดสด") {
        return match.isLive;
      }

      if (activeFilter === "มีบทวิเคราะห์") {
        return match.hasAnalysis;
      }

      if (activeFilter === "พรีเมียม") {
        return match.isPremium;
      }

      return true;
    });
  }, [activeFilter, matches, search]);

  const groupedMatches = useMemo(() => {
    return filteredMatches.reduce<Record<string, TableMatch[]>>((groups, match) => {
      if (!groups[match.league]) {
        groups[match.league] = [];
      }

      groups[match.league].push(match);
      return groups;
    }, {});
  }, [filteredMatches]);

  const leagueNames = Object.keys(groupedMatches);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 md:pt-10">
      <SectionHeading
        eyebrow="วิเคราะห์วันนี้"
        title="ตารางข้อมูลก่อนเกมประจำวัน"
        description="ดูคู่แข่งขันแยกตามลีก เรียงตามเวลาแข่ง พร้อมราคาตลาด สถิติ มุมมองข้อมูล ช่องถ่ายทอดสด และลิงก์ไปยังหน้ารายละเอียดของแต่ละคู่"
      />

      <section className="mt-8 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,13,0.95),rgba(4,8,6,0.98))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-3">
            {filterOptions.map((option) => {
              const isActive = option === activeFilter;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setActiveFilter(option)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    isActive
                      ? "bg-emerald-400 text-[#031109]"
                      : "border border-white/10 bg-white/5 text-white/75"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <label className="block xl:min-w-[320px]">
            <span className="mb-2 block text-sm text-white/65">ค้นหาทีมหรือลีก</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="เช่น พรีเมียร์ลีก, Arsenal, PSG"
              className="w-full rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none placeholder:text-white/28"
            />
          </label>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/55">คู่แข่งขันที่แสดง</p>
          <p className="mt-3 text-4xl font-semibold text-white">{filteredMatches.length}</p>
          <p className="mt-2 text-sm text-emerald-300">ปรับตามตัวกรองและการค้นหา</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/55">กำลังถ่ายทอดสด</p>
          <p className="mt-3 text-4xl font-semibold text-white">
            {filteredMatches.filter((match) => match.isLive).length}
          </p>
          <p className="mt-2 text-sm text-rose-200">อัปเดตจากข้อมูลจำลอง</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/55">มีบทวิเคราะห์</p>
          <p className="mt-3 text-4xl font-semibold text-white">
            {filteredMatches.filter((match) => match.hasAnalysis).length}
          </p>
          <p className="mt-2 text-sm text-emerald-300">พร้อมอ่านข้อมูลเชิงลึก</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/55">คอนเทนต์พรีเมียม</p>
          <p className="mt-3 text-4xl font-semibold text-white">
            {filteredMatches.filter((match) => match.isPremium).length}
          </p>
          <p className="mt-2 text-sm text-amber-200">สำหรับสมาชิก KickData</p>
        </div>
      </section>

      <section className="mt-8 space-y-6">
        {leagueNames.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/60">
            ไม่พบข้อมูลคู่แข่งขันที่ตรงกับเงื่อนไขที่เลือก
          </div>
        ) : (
          leagueNames.map((league) => (
            <div
              key={league}
              className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,18,15,0.95),rgba(5,9,7,0.98))] shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
            >
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-5 md:px-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">ลีกการแข่งขัน</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{league}</h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/65">
                  {groupedMatches[league].length} คู่
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[1120px] text-left text-sm">
                  <thead className="bg-white/[0.03] text-white/45">
                    <tr>
                      <th className="px-4 py-4 font-medium">เวลา</th>
                      <th className="px-4 py-4 font-medium">สด</th>
                      <th className="px-4 py-4 font-medium">ทีมเหย้า</th>
                      <th className="px-4 py-4 font-medium">ราคาตลาด</th>
                      <th className="px-4 py-4 font-medium">ทีมเยือน</th>
                      <th className="px-4 py-4 font-medium">สูง/ต่ำ</th>
                      <th className="px-4 py-4 font-medium">% วิเคราะห์</th>
                      <th className="px-4 py-4 font-medium">ช่องถ่ายทอดสด</th>
                      <th className="px-4 py-4 font-medium">รายละเอียด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedMatches[league].map((match) => (
                      <tr key={match.id} className="border-t border-white/6">
                        <td className="px-4 py-4">
                          <p className="font-medium text-white">{match.kickoff}</p>
                          <p className="mt-1 text-xs text-white/45">เวลาไทย</p>
                        </td>
                        <td className="px-4 py-4">
                          {match.isLive ? (
                            <span className="inline-flex rounded-full bg-rose-400/15 px-3 py-1 text-xs font-semibold text-rose-100">
                              ถ่ายทอดสด
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-white/6 px-3 py-1 text-xs text-white/60">
                              รอแข่ง
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-white">{match.homeTeam}</p>
                            <p className="mt-1 text-xs text-white/45">เจ้าบ้าน</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-white">{match.marketPrice}</p>
                          <p className="mt-1 text-xs text-white/45">เจ้าบ้าน / เสมอ / ทีมเยือน</p>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-white">{match.awayTeam}</p>
                            <p className="mt-1 text-xs text-white/45">ทีมเยือน</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-white">{match.overUnder}</p>
                          <p className="mt-1 text-xs text-white/45">ข้อมูลสูง/ต่ำ</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full bg-emerald-400/12 px-3 py-1 font-semibold text-emerald-300">
                            {match.analysisPercent}
                          </span>
                          <p className="mt-1 text-xs text-white/45">มุมมองข้อมูล</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-white">{match.broadcast}</p>
                          <p className="mt-1 text-xs text-white/45">
                            {match.isPremium ? "พรีเมียม" : "เปิดอ่าน"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/matches/${match.id}`}
                            className="inline-flex rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#041109]"
                          >
                            ดูวิเคราะห์
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
