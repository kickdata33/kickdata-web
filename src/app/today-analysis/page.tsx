"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SectionHeading } from "@/components/section-heading";
import { mockMatches } from "@/data/mock-matches";

type FilterKey = "ทั้งหมด" | "ถ่ายทอดสด" | "มีบทวิเคราะห์" | "พรีเมียม";

type AnalysisSide = "เจ้าบ้าน" | "เสมอ" | "ทีมเยือน";

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
  handicap: string;
  overUnder: string;
  analysisPercent: number;
  analysisSide: AnalysisSide;
  broadcast: string;
  hasAnalysis: boolean;
  isPremium: boolean;
};

const filterOptions: FilterKey[] = ["ทั้งหมด", "ถ่ายทอดสด", "มีบทวิเคราะห์", "พรีเมียม"];

const matchEnhancements: Record<
  string,
  Pick<
    TableMatch,
    "league" | "liveStatus" | "handicap" | "overUnder" | "analysisPercent" | "analysisSide" | "broadcast" | "hasAnalysis" | "isPremium"
  >
> = {
  "arsenal-vs-chelsea": {
    league: "พรีเมียร์ลีก",
    liveStatus: "ถ่ายทอดสด",
    handicap: "Arsenal ต่อ 0.5",
    overUnder: "2.75",
    analysisPercent: 81,
    analysisSide: "เจ้าบ้าน",
    broadcast: "beIN SPORTS 1",
    hasAnalysis: true,
    isPremium: true,
  },
  "inter-vs-atalanta": {
    league: "กัลโช่ เซเรีย อา",
    liveStatus: "รอแข่ง",
    handicap: "Inter ต่อ 0.25",
    overUnder: "2.50",
    analysisPercent: 74,
    analysisSide: "เจ้าบ้าน",
    broadcast: "ทรู พรีเมียร์ ฟุตบอล 3",
    hasAnalysis: true,
    isPremium: true,
  },
  "psg-vs-lille": {
    league: "ลีกเอิง",
    liveStatus: "รอแข่ง",
    handicap: "PSG ต่อ 1.0",
    overUnder: "3.25",
    analysisPercent: 68,
    analysisSide: "เจ้าบ้าน",
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
        handicap: extra?.handicap ?? "-",
        overUnder: extra?.overUnder ?? "-",
        analysisPercent: extra?.analysisPercent ?? match.confidence,
        analysisSide: extra?.analysisSide ?? "เจ้าบ้าน",
        broadcast: extra?.broadcast ?? "รอตรวจสอบ",
        hasAnalysis: extra?.hasAnalysis ?? true,
        isPremium: extra?.isPremium ?? false,
      };
    })
    .sort((a, b) => toMinutes(a.kickoff) - toMinutes(b.kickoff));
}

function statusTone(status: TableMatch["liveStatus"]) {
  return status === "ถ่ายทอดสด"
    ? "border-[#FF3B5F]/45 bg-[#FF3B5F]/16 text-white shadow-[0_0_0_1px_rgba(255,59,95,0.16)]"
    : "border-[#33463C] bg-[#1A211E] text-[#C8D2CD]";
}

function analysisTone(hasAnalysis: boolean) {
  return hasAnalysis
    ? "border-[#21E58A]/30 bg-[#21E58A]/12 text-[#7CFFB2]"
    : "border-[#33463C] bg-[#161C19] text-[#A7B5AE]";
}

function premiumTone(isPremium: boolean) {
  return isPremium
    ? "border-[#F5C542]/35 bg-[#F5C542]/15 text-[#FFE8A3]"
    : "border-[#33463C] bg-[#161C19] text-[#A7B5AE]";
}

function analysisSideLabel(side: AnalysisSide) {
  if (side === "เจ้าบ้าน") {
    return "มุมมองข้อมูลฝั่งเจ้าบ้าน";
  }

  if (side === "ทีมเยือน") {
    return "มุมมองข้อมูลฝั่งทีมเยือน";
  }

  return "มุมมองข้อมูลฝั่งเสมอ";
}

function analysisRingStyle(percent: number) {
  return {
    background: `conic-gradient(#21E58A 0% ${percent}%, rgba(255,255,255,0.08) ${percent}% 100%)`,
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
    <div className="rounded-3xl border border-[#294336] bg-[linear-gradient(180deg,#17201C_0%,#101614_100%)] px-4 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#A7B5AE]">{label}</p>
      <p className={`mt-2 text-[1.65rem] font-semibold leading-none ${accent}`}>{value}</p>
    </div>
  );
}

function InfoBadge({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent";
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        tone === "accent"
          ? "border-[#285340] bg-[#123D2B]/35 text-[#7CFFB2]"
          : "border-[#294336] bg-[#151C19] text-[#FFFFFF]"
      }`}
    >
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#A7B5AE]">{label}</p>
      <p className="mt-2 text-base font-semibold">{value}</p>
    </div>
  );
}

function DesktopMatchCard({ match, index }: { match: TableMatch; index: number }) {
  return (
    <article
      className={`rounded-[32px] border p-6 shadow-[0_22px_60px_rgba(0,0,0,0.22)] ${
        index % 2 === 0
          ? "border-[#294336] bg-[linear-gradient(180deg,#151C19_0%,#101614_100%)]"
          : "border-[#294336] bg-[linear-gradient(180deg,#18211D_0%,#111715_100%)]"
      }`}
    >
      <div className="grid gap-5 xl:grid-cols-[124px_156px_1.15fr_328px_210px_220px_210px] xl:items-center">
        <div className="rounded-3xl border border-[#294336] bg-[#141A18] px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#A7B5AE]">เวลาแข่ง</p>
          <p className="mt-2 text-[2rem] font-semibold leading-none text-[#FFFFFF]">{match.kickoff}</p>
          <p className="mt-2 text-xs text-[#A7B5AE]">เวลาไทย</p>
        </div>

        <div className="space-y-2">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(match.liveStatus)}`}
          >
            {match.liveStatus}
          </span>
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${analysisTone(match.hasAnalysis)}`}
          >
            มีบทวิเคราะห์
          </span>
          {match.isPremium ? (
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${premiumTone(match.isPremium)}`}
            >
              พรีเมียม
            </span>
          ) : null}
        </div>

        <div className="rounded-[28px] border border-[#294336] bg-[linear-gradient(180deg,#1A2320_0%,#141A18_100%)] px-5 py-5">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="min-w-0">
              <p className="text-sm text-[#A7B5AE]">ทีมเหย้า</p>
              <p className="mt-2 truncate text-[2.1rem] font-semibold leading-none text-[#FFFFFF]">{match.homeTeam}</p>
            </div>
            <div className="h-16 w-px bg-[#294336]" />
            <div className="min-w-0 text-right">
              <p className="text-sm text-[#A7B5AE]">ทีมเยือน</p>
              <p className="mt-2 truncate text-[2.1rem] font-semibold leading-none text-[#FFFFFF]">{match.awayTeam}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#FFFFFF]">ราคาตลาด 1X2</p>
          <div className="grid grid-cols-3 gap-3">
            <PriceBox label="เจ้าบ้าน" value={match.homePrice} accent="text-[#21E58A]" />
            <PriceBox label="เสมอ" value={match.drawPrice} accent="text-[#FFFFFF]" />
            <PriceBox label="ทีมเยือน" value={match.awayPrice} accent="text-[#7CFFB2]" />
          </div>
        </div>

        <div className="space-y-3">
          <InfoBadge label="แฮนดิแคป" value={match.handicap} />
          <div className="inline-flex rounded-full border border-[#285340] bg-[#123D2B]/35 px-4 py-2 text-sm font-semibold text-[#7CFFB2]">
            สูง/ต่ำ {match.overUnder}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#294336] bg-[linear-gradient(180deg,#1A2320_0%,#141A18_100%)] px-4 py-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full p-[6px] shadow-[0_0_24px_rgba(33,229,138,0.14)]"
              style={analysisRingStyle(match.analysisPercent)}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#050807] text-lg font-semibold text-[#FFFFFF]">
                {match.analysisPercent}%
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#FFFFFF]">มุมมองข้อมูล</p>
              <div className="mt-2 inline-flex rounded-full border border-[#21E58A]/30 bg-[#21E58A]/12 px-3 py-1 text-sm font-semibold text-[#7CFFB2]">
                {analysisSideLabel(match.analysisSide)}
              </div>
              <div className="mt-3 h-3 rounded-full bg-white/8">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-[#21E58A] to-[#7CFFB2]"
                  style={{ width: `${match.analysisPercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs leading-6 text-[#A7B5AE]">
                ค่าเปอร์เซ็นต์นี้ใช้สื่อมุมมองข้อมูลเชิงสถิติว่าภาพรวมโน้มไปทาง{match.analysisSide}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <InfoBadge label="ช่องถ่ายทอดสด" value={match.broadcast} tone="accent" />
          <Link
            href={`/matches/${match.id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#21E58A] px-6 py-4 text-base font-semibold text-[#041109] shadow-[0_18px_36px_rgba(33,229,138,0.3)] transition hover:translate-y-[-1px]"
          >
            ดูวิเคราะห์
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function MobileMatchCard({ match, index }: { match: TableMatch; index: number }) {
  return (
    <article
      className={`rounded-[28px] border p-5 shadow-[0_20px_55px_rgba(0,0,0,0.2)] ${
        index % 2 === 0
          ? "border-[#294336] bg-[linear-gradient(180deg,#171F1B_0%,#101614_100%)]"
          : "border-[#294336] bg-[linear-gradient(180deg,#19231E_0%,#101614_100%)]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl border border-[#294336] bg-[#141A18] px-4 py-3">
          <p className="text-xs text-[#A7B5AE]">เวลาแข่ง</p>
          <p className="mt-1 text-3xl font-semibold text-[#FFFFFF]">{match.kickoff}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(match.liveStatus)}`}
          >
            {match.liveStatus}
          </span>
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${analysisTone(match.hasAnalysis)}`}
          >
            มีบทวิเคราะห์
          </span>
          {match.isPremium ? (
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${premiumTone(match.isPremium)}`}
            >
              พรีเมียม
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-4 rounded-[26px] border border-[#294336] bg-[linear-gradient(180deg,#1A2320_0%,#141A18_100%)] px-4 py-4">
        <div className="grid gap-4">
          <div>
            <p className="text-sm text-[#A7B5AE]">ทีมเหย้า</p>
            <p className="mt-1 text-3xl font-semibold text-[#FFFFFF]">{match.homeTeam}</p>
          </div>
          <div className="h-px bg-[#294336]" />
          <div>
            <p className="text-sm text-[#A7B5AE]">ทีมเยือน</p>
            <p className="mt-1 text-3xl font-semibold text-[#FFFFFF]">{match.awayTeam}</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold text-[#FFFFFF]">ราคาตลาด 1X2</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <PriceBox label="เจ้าบ้าน" value={match.homePrice} accent="text-[#21E58A]" />
          <PriceBox label="เสมอ" value={match.drawPrice} accent="text-[#FFFFFF]" />
          <PriceBox label="ทีมเยือน" value={match.awayPrice} accent="text-[#7CFFB2]" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <InfoBadge label="แฮนดิแคป" value={match.handicap} />
        <div className="inline-flex items-center justify-center rounded-2xl border border-[#285340] bg-[#123D2B]/35 px-4 py-3 text-sm font-semibold text-[#7CFFB2]">
          สูง/ต่ำ {match.overUnder}
        </div>
      </div>

      <div className="mt-4 rounded-[26px] border border-[#294336] bg-[linear-gradient(180deg,#1A2320_0%,#141A18_100%)] p-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full p-[6px] shadow-[0_0_24px_rgba(33,229,138,0.14)]"
            style={analysisRingStyle(match.analysisPercent)}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#050807] text-lg font-semibold text-[#FFFFFF]">
              {match.analysisPercent}%
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#FFFFFF]">มุมมองข้อมูล</p>
            <div className="mt-2 inline-flex rounded-full border border-[#21E58A]/30 bg-[#21E58A]/12 px-3 py-1 text-sm font-semibold text-[#7CFFB2]">
              {analysisSideLabel(match.analysisSide)}
            </div>
            <div className="mt-3 h-3 rounded-full bg-white/8">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-[#21E58A] to-[#7CFFB2]"
                style={{ width: `${match.analysisPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs leading-6 text-[#A7B5AE]">
              ค่าเปอร์เซ็นต์นี้ใช้สื่อมุมมองข้อมูลเชิงสถิติว่าภาพรวมโน้มไปทาง{match.analysisSide}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[26px] border border-[#294336] bg-[#161D1A] px-4 py-4">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#A7B5AE]">ช่องถ่ายทอดสด</p>
        <p className="mt-2 text-base font-semibold text-[#FFFFFF]">{match.broadcast}</p>
      </div>

      <Link
        href={`/matches/${match.id}`}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#21E58A] px-5 py-4 text-base font-semibold text-[#041109] shadow-[0_18px_36px_rgba(33,229,138,0.3)] transition hover:translate-y-[-1px]"
      >
        ดูวิเคราะห์
        <span aria-hidden="true">→</span>
      </Link>
    </article>
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
  const premiumCount = matches.filter((match) => match.isPremium).length;
  const leagueNames = Object.keys(groupedMatches);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 md:pt-10">
      <SectionHeading
        eyebrow="วิเคราะห์วันนี้"
        title="ตารางข้อมูลก่อนเกมที่อ่านง่าย เด่นชัด และใช้งานจริงได้เร็วขึ้น"
        description="รวมคู่แข่งขันตามลีกและเวลาแข่ง พร้อมราคาตลาด 1X2 แฮนดิแคป สูง/ต่ำ มุมมองข้อมูลเชิงสถิติ และช่องถ่ายทอดสดอย่างเป็นระเบียบในรูปแบบที่อ่านครั้งเดียวเข้าใจ"
      />

      <section className="mt-8 rounded-[34px] border border-[#294336] bg-[linear-gradient(180deg,#141D19_0%,#0D1210_100%)] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] md:p-6">
        <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
          <div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#C5D0CA]">ค้นหาทีมหรือลีก</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="เช่น พรีเมียร์ลีก, Arsenal, PSG"
                className="w-full rounded-2xl border border-[#294336] bg-[#161D1A] px-4 py-3.5 text-[#FFFFFF] outline-none placeholder:text-[#809089] focus:border-[#21E58A]"
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
                    className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#21E58A] text-[#041109] shadow-[0_10px_24px_rgba(33,229,138,0.28)]"
                        : "border border-[#294336] bg-[#161D1A] text-[#C5D0CA]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-[#294336] bg-[linear-gradient(180deg,#1A2320_0%,#141A18_100%)] p-5">
              <p className="text-sm text-[#A7B5AE]">คู่ทั้งหมดวันนี้</p>
              <p className="mt-3 text-4xl font-semibold text-[#FFFFFF]">{totalToday}</p>
              <p className="mt-2 text-sm text-[#7CFFB2]">ทุกลีกที่ติดตาม</p>
            </div>
            <div className="rounded-3xl border border-[#FF3B5F]/30 bg-[#FF3B5F]/10 p-5">
              <p className="text-sm text-[#A7B5AE]">ถ่ายทอดสด</p>
              <p className="mt-3 text-4xl font-semibold text-[#FFFFFF]">{liveCount}</p>
              <p className="mt-2 text-sm text-[#FFD6DE]">คู่ที่กำลังแข่งขัน</p>
            </div>
            <div className="rounded-3xl border border-[#21E58A]/25 bg-[#21E58A]/10 p-5">
              <p className="text-sm text-[#A7B5AE]">มีบทวิเคราะห์</p>
              <p className="mt-3 text-4xl font-semibold text-[#FFFFFF]">{analysisCount}</p>
              <p className="mt-2 text-sm text-[#7CFFB2]">พร้อมอ่านต่อได้ทันที</p>
            </div>
            <div className="rounded-3xl border border-[#F5C542]/25 bg-[#F5C542]/10 p-5">
              <p className="text-sm text-[#A7B5AE]">พรีเมียม</p>
              <p className="mt-3 text-4xl font-semibold text-[#FFFFFF]">{premiumCount}</p>
              <p className="mt-2 text-sm text-[#FFE8A3]">ข้อมูลเชิงลึกเพิ่มเติม</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-6">
        {leagueNames.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-[#294336] bg-[#101614] p-8 text-center text-[#A7B5AE]">
            ไม่พบข้อมูลคู่แข่งขันที่ตรงกับเงื่อนไขที่เลือก
          </div>
        ) : (
          leagueNames.map((league) => (
            <div key={league} className="space-y-4">
              <div className="relative overflow-hidden rounded-[30px] border border-[#285340] bg-[linear-gradient(90deg,#0B1F17_0%,#123D2B_52%,#08120E_100%)] px-5 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:px-6">
                <div className="absolute inset-y-0 left-0 w-20 bg-[radial-gradient(circle_at_left,rgba(124,255,178,0.24),transparent_72%)]" />
                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.34em] text-[#7CFFB2]">ลีกการแข่งขัน</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#FFFFFF] md:text-[2.15rem]">
                      {league}
                    </h2>
                  </div>
                  <div className="rounded-full border border-[#3A5E4A] bg-black/18 px-4 py-2 text-sm font-medium text-[#D5E0DA]">
                    {groupedMatches[league].length} คู่
                  </div>
                </div>
              </div>

              <div className="hidden gap-4 lg:flex lg:flex-col">
                {groupedMatches[league].map((match, index) => (
                  <DesktopMatchCard key={match.id} match={match} index={index} />
                ))}
              </div>

              <div className="grid gap-4 lg:hidden">
                {groupedMatches[league].map((match, index) => (
                  <MobileMatchCard key={match.id} match={match} index={index} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
