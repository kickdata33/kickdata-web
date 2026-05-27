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
  liveStatus: "รอแข่ง" | "ถ่ายทอดสด";
  homeTeam: string;
  awayTeam: string;
  homePrice: string;
  drawPrice: string;
  awayPrice: string;
  overUnder: string;
  analysisPercent: number;
  broadcast: string;
  hasAnalysis: boolean;
  isPremium: boolean;
};

const filterOptions: FilterKey[] = ["ทั้งหมด", "ถ่ายทอดสด", "มีบทวิเคราะห์", "พรีเมียม"];

const matchEnhancements: Record<
  string,
  Pick<TableMatch, "league" | "liveStatus" | "overUnder" | "analysisPercent" | "broadcast" | "hasAnalysis" | "isPremium">
> = {
  "arsenal-vs-chelsea": {
    league: "พรีเมียร์ลีก",
    liveStatus: "ถ่ายทอดสด",
    overUnder: "2.75",
    analysisPercent: 81,
    broadcast: "beIN SPORTS 1",
    hasAnalysis: true,
    isPremium: true,
  },
  "inter-vs-atalanta": {
    league: "กัลโช่ เซเรีย อา",
    liveStatus: "รอแข่ง",
    overUnder: "2.50",
    analysisPercent: 74,
    broadcast: "ทรู พรีเมียร์ ฟุตบอล 3",
    hasAnalysis: true,
    isPremium: true,
  },
  "psg-vs-lille": {
    league: "ลีกเอิง",
    liveStatus: "รอแข่ง",
    overUnder: "3.25",
    analysisPercent: 68,
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
        liveStatus: extra?.liveStatus ?? "รอแข่ง",
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        homePrice: match.homeOdds,
        drawPrice: match.drawOdds,
        awayPrice: match.awayOdds,
        overUnder: extra?.overUnder ?? "-",
        analysisPercent: extra?.analysisPercent ?? match.confidence,
        broadcast: extra?.broadcast ?? "รอตรวจสอบ",
        hasAnalysis: extra?.hasAnalysis ?? true,
        isPremium: extra?.isPremium ?? false,
      };
    })
    .sort((a, b) => toMinutes(a.kickoff) - toMinutes(b.kickoff));
}

function statusTone(status: TableMatch["liveStatus"]) {
  return status === "ถ่ายทอดสด"
    ? "border-rose-300/25 bg-rose-500/15 text-rose-100"
    : "border-white/10 bg-white/8 text-white/65";
}

function premiumTone(isPremium: boolean) {
  return isPremium
    ? "border-amber-300/25 bg-amber-300/15 text-amber-100"
    : "border-emerald-300/20 bg-emerald-400/10 text-emerald-300";
}

function analysisRingStyle(percent: number) {
  return {
    background: `conic-gradient(#34d399 0% ${percent}%, rgba(255,255,255,0.08) ${percent}% 100%)`,
  };
}

function PriceBox({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/18 p-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/42">{label}</p>
      <p className={`mt-2 text-xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
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
        return match.liveStatus === "ถ่ายทอดสด";
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

  const totalToday = matches.length;
  const liveCount = matches.filter((match) => match.liveStatus === "ถ่ายทอดสด").length;
  const analysisCount = matches.filter((match) => match.hasAnalysis).length;
  const leagueNames = Object.keys(groupedMatches);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 md:pt-10">
      <SectionHeading
        eyebrow="วิเคราะห์วันนี้"
        title="ตารางข้อมูลก่อนเกมที่อ่านง่ายและใช้งานสะดวก"
        description="ติดตามคู่แข่งขันตามลีกและเวลาแข่ง พร้อมราคาตลาด สถิติ มุมมองข้อมูล ช่องถ่ายทอดสด และปุ่มเข้าดูการวิเคราะห์รายคู่ในรูปแบบที่ชัดเจนขึ้น"
      />

      <section className="mt-8 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,15,0.98),rgba(4,8,6,0.98))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.24)] md:p-6">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <label className="block">
              <span className="mb-2 block text-sm text-white/65">ค้นหาทีมหรือลีก</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="เช่น พรีเมียร์ลีก, Arsenal, PSG"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/28"
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-3">
              {filterOptions.map((option) => {
                const isActive = option === activeFilter;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setActiveFilter(option)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-emerald-400 text-[#031109] shadow-[0_8px_24px_rgba(52,211,153,0.28)]"
                        : "border border-white/10 bg-white/5 text-white/78"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/55">คู่ทั้งหมดวันนี้</p>
              <p className="mt-3 text-4xl font-semibold text-white">{totalToday}</p>
              <p className="mt-2 text-sm text-emerald-300">ทุกลีกที่ติดตาม</p>
            </div>
            <div className="rounded-3xl border border-rose-300/12 bg-rose-500/8 p-5">
              <p className="text-sm text-white/55">ถ่ายทอดสด</p>
              <p className="mt-3 text-4xl font-semibold text-white">{liveCount}</p>
              <p className="mt-2 text-sm text-rose-100">คู่ที่กำลังแข่งขัน</p>
            </div>
            <div className="rounded-3xl border border-emerald-300/12 bg-emerald-500/8 p-5">
              <p className="text-sm text-white/55">มีบทวิเคราะห์</p>
              <p className="mt-3 text-4xl font-semibold text-white">{analysisCount}</p>
              <p className="mt-2 text-sm text-emerald-200">พร้อมอ่านต่อได้ทันที</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-6">
        {leagueNames.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/60">
            ไม่พบข้อมูลคู่แข่งขันที่ตรงกับเงื่อนไขที่เลือก
          </div>
        ) : (
          leagueNames.map((league) => (
            <div key={league} className="space-y-4">
              <div className="rounded-[28px] border border-emerald-400/18 bg-[linear-gradient(90deg,rgba(11,29,20,0.98),rgba(5,10,8,0.98))] px-5 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.2)] md:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">ลีกการแข่งขัน</p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">{league}</h2>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/68">
                    {groupedMatches[league].length} คู่
                  </div>
                </div>
              </div>

              <div className="hidden gap-4 lg:flex lg:flex-col">
                {groupedMatches[league].map((match, index) => (
                  <div
                    key={match.id}
                    className={`rounded-[28px] border p-5 shadow-[0_18px_50px_rgba(0,0,0,0.16)] ${
                      index % 2 === 0
                        ? "border-white/10 bg-[linear-gradient(180deg,rgba(14,20,16,0.98),rgba(7,10,8,0.98))]"
                        : "border-emerald-400/10 bg-[linear-gradient(180deg,rgba(10,15,12,0.98),rgba(5,8,6,0.98))]"
                    }`}
                  >
                    <div className="grid gap-4 xl:grid-cols-[110px_120px_1fr_290px_130px_150px_170px_190px] xl:items-center">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/42">เวลา</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{match.kickoff}</p>
                        <p className="mt-1 text-xs text-white/45">เวลาไทย</p>
                      </div>

                      <div className="space-y-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(match.liveStatus)}`}
                        >
                          {match.liveStatus}
                        </span>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${premiumTone(match.isPremium)}`}
                        >
                          {match.isPremium ? "พรีเมียม" : "มีบทวิเคราะห์"}
                        </span>
                      </div>

                      <div className="rounded-3xl border border-white/8 bg-white/[0.03] px-5 py-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-sm text-white/45">ทีมเหย้า</p>
                            <p className="mt-1 truncate text-2xl font-semibold text-white">{match.homeTeam}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-white/45">ทีมเยือน</p>
                            <p className="mt-1 truncate text-2xl font-semibold text-white">{match.awayTeam}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <PriceBox label="เจ้าบ้าน" value={match.homePrice} accent="text-emerald-300" />
                        <PriceBox label="เสมอ" value={match.drawPrice} accent="text-white" />
                        <PriceBox label="ทีมเยือน" value={match.awayPrice} accent="text-sky-200" />
                      </div>

                      <div>
                        <span className="inline-flex rounded-full border border-sky-300/18 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-100">
                          สูง/ต่ำ {match.overUnder}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div
                            className="flex h-16 w-16 items-center justify-center rounded-full p-[5px]"
                            style={analysisRingStyle(match.analysisPercent)}
                          >
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#08100c] text-base font-semibold text-white">
                              {match.analysisPercent}%
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white">มุมมองข้อมูล</p>
                            <div className="mt-2 h-2 rounded-full bg-white/8">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500"
                                style={{ width: `${match.analysisPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-white/8 bg-white/[0.03] px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/42">ช่องถ่ายทอดสด</p>
                        <p className="mt-2 text-base font-semibold text-white">{match.broadcast}</p>
                      </div>

                      <div className="flex justify-end">
                        <Link
                          href={`/matches/${match.id}`}
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#041109] shadow-[0_10px_28px_rgba(52,211,153,0.25)]"
                        >
                          ดูวิเคราะห์
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:hidden">
                {groupedMatches[league].map((match, index) => (
                  <div
                    key={match.id}
                    className={`rounded-[28px] border p-5 shadow-[0_18px_50px_rgba(0,0,0,0.16)] ${
                      index % 2 === 0
                        ? "border-white/10 bg-[linear-gradient(180deg,rgba(14,20,16,0.98),rgba(7,10,8,0.98))]"
                        : "border-emerald-400/10 bg-[linear-gradient(180deg,rgba(10,15,12,0.98),rgba(5,8,6,0.98))]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-white/45">เวลาแข่ง</p>
                        <p className="mt-1 text-2xl font-semibold text-white">{match.kickoff}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(match.liveStatus)}`}
                        >
                          {match.liveStatus}
                        </span>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${premiumTone(match.isPremium)}`}
                        >
                          {match.isPremium ? "พรีเมียม" : "มีบทวิเคราะห์"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 rounded-3xl border border-white/8 bg-white/[0.03] px-4 py-4">
                      <p className="text-sm text-white/45">ทีมเหย้า</p>
                      <p className="mt-1 text-2xl font-semibold text-white">{match.homeTeam}</p>
                      <div className="my-4 h-px bg-white/8" />
                      <p className="text-sm text-white/45">ทีมเยือน</p>
                      <p className="mt-1 text-2xl font-semibold text-white">{match.awayTeam}</p>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <PriceBox label="เจ้าบ้าน" value={match.homePrice} accent="text-emerald-300" />
                      <PriceBox label="เสมอ" value={match.drawPrice} accent="text-white" />
                      <PriceBox label="ทีมเยือน" value={match.awayPrice} accent="text-sky-200" />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span className="inline-flex rounded-full border border-sky-300/18 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-100">
                        สูง/ต่ำ {match.overUnder}
                      </span>
                      <span className="inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/70">
                        {match.broadcast}
                      </span>
                    </div>

                    <div className="mt-5 rounded-3xl border border-white/8 bg-black/14 p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-16 w-16 items-center justify-center rounded-full p-[5px]"
                          style={analysisRingStyle(match.analysisPercent)}
                        >
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#08100c] text-base font-semibold text-white">
                            {match.analysisPercent}%
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white">มุมมองข้อมูล</p>
                          <div className="mt-2 h-2 rounded-full bg-white/8">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500"
                              style={{ width: `${match.analysisPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/matches/${match.id}`}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#041109] shadow-[0_10px_28px_rgba(52,211,153,0.25)]"
                    >
                      ดูวิเคราะห์
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
