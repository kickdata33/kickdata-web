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
const visiblePerLeague = 5;

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
        homeTeam: match.homeTeam || "-",
        awayTeam: match.awayTeam || "-",
        homePrice: match.homeOdds,
        drawPrice: match.drawOdds,
        awayPrice: match.awayOdds,
        handicap: extra?.handicap ?? "-",
        overUnder: extra?.overUnder ?? "-",
        analysisPercent: extra?.analysisPercent ?? match.confidence,
        analysisSide: extra?.analysisSide ?? "เจ้าบ้าน",
        broadcast: extra?.broadcast ?? "-",
        hasAnalysis: extra?.hasAnalysis ?? true,
        isPremium: extra?.isPremium ?? false,
      };
    })
    .sort((a, b) => toMinutes(a.kickoff) - toMinutes(b.kickoff));
}

function statusTone(status: TableMatch["liveStatus"]) {
  return status === "ถ่ายทอดสด"
    ? "border-[#FF3B5F]/40 bg-[#FF3B5F]/16 text-[#FFE4EA]"
    : "border-[#32463B] bg-[#171D1B] text-[#C2CCC7]";
}

function analysisTone(hasAnalysis: boolean) {
  return hasAnalysis
    ? "border-[#21E58A]/30 bg-[#21E58A]/12 text-[#7CFFB2]"
    : "border-[#32463B] bg-[#171D1B] text-[#A7B5AE]";
}

function premiumTone(isPremium: boolean) {
  return isPremium
    ? "border-[#F5C542]/30 bg-[#F5C542]/14 text-[#FFE8A3]"
    : "border-[#32463B] bg-[#171D1B] text-[#A7B5AE]";
}

function analysisSideText(side: AnalysisSide) {
  if (side === "เจ้าบ้าน") {
    return "ฝั่งเจ้าบ้าน";
  }

  if (side === "ทีมเยือน") {
    return "ฝั่งทีมเยือน";
  }

  return "ฝั่งเสมอ";
}

function oddsSummary(match: TableMatch) {
  return `${match.homePrice} / ${match.drawPrice} / ${match.awayPrice}`;
}

function DesktopMatchRow({ match }: { match: TableMatch }) {
  return (
    <article className="grid min-h-[84px] grid-cols-[84px_138px_minmax(150px,1fr)_170px_minmax(150px,1fr)_92px_124px_138px_126px] items-center gap-3 rounded-[24px] border border-[#294336] bg-[linear-gradient(180deg,#151C19_0%,#101614_100%)] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="rounded-2xl border border-[#24372D] bg-[#131917] px-3 py-2 text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#A7B5AE]">เวลา</p>
        <p className="mt-1 text-2xl font-semibold leading-none text-[#FFFFFF]">{match.kickoff}</p>
      </div>

      <div className="space-y-1.5">
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(match.liveStatus)}`}>
          {match.liveStatus}
        </span>
        <div className="flex flex-wrap gap-1.5">
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${analysisTone(match.hasAnalysis)}`}>
            มีบทวิเคราะห์
          </span>
          {match.isPremium ? (
            <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${premiumTone(match.isPremium)}`}>
              พรีเมียม
            </span>
          ) : null}
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[#A7B5AE]">ทีมเหย้า</p>
        <p className="mt-1 truncate text-lg font-semibold text-[#FFFFFF]">{match.homeTeam}</p>
      </div>

      <div className="rounded-2xl border border-[#264135] bg-[#161E1B] px-3 py-2 text-center">
        <p className="text-sm font-semibold tracking-[0.02em] text-[#FFFFFF]">{oddsSummary(match)}</p>
        <p className="mt-1 text-[10px] text-[#A7B5AE]">เจ้าบ้าน / เสมอ / ทีมเยือน</p>
      </div>

      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[#A7B5AE]">ทีมเยือน</p>
        <p className="mt-1 truncate text-lg font-semibold text-[#FFFFFF]">{match.awayTeam}</p>
      </div>

      <div className="space-y-1 text-center">
        <p className="inline-flex rounded-full border border-[#285340] bg-[#123D2B]/30 px-3 py-1.5 text-sm font-semibold text-[#7CFFB2]">
          {match.overUnder}
        </p>
        <p className="text-[10px] text-[#A7B5AE]">สูง/ต่ำ</p>
      </div>

      <div className="rounded-2xl border border-[#264135] bg-[#141A18] px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-[#FFFFFF]">{match.analysisPercent}%</span>
          <span className="text-[10px] text-[#7CFFB2]">{analysisSideText(match.analysisSide)}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/8">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-[#21E58A] to-[#7CFFB2]"
            style={{ width: `${match.analysisPercent}%` }}
          />
        </div>
      </div>

      <div className="truncate rounded-2xl border border-[#24372D] bg-[#131917] px-3 py-2 text-sm font-medium text-[#FFFFFF]">
        {match.broadcast}
      </div>

      <Link
        href={`/matches/${match.id}`}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#21E58A] px-4 py-2.5 text-sm font-semibold text-[#041109] shadow-[0_12px_28px_rgba(33,229,138,0.24)] transition hover:translate-y-[-1px]"
      >
        ดูวิเคราะห์
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

function MobileMatchCard({ match }: { match: TableMatch }) {
  return (
    <article className="rounded-[22px] border border-[#294336] bg-[linear-gradient(180deg,#151C19_0%,#101614_100%)] px-4 py-4 shadow-[0_10px_28px_rgba(0,0,0,0.18)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#FFFFFF]">
          <span>{match.kickoff}</span>
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusTone(match.liveStatus)}`}>
            {match.liveStatus}
          </span>
        </div>
        <p className="text-xs text-[#A7B5AE]">{match.league}</p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="min-w-0 flex-1 truncate text-base font-semibold text-[#FFFFFF]">{match.homeTeam}</p>
        <span className="rounded-full border border-[#294336] bg-[#141A18] px-2.5 py-1 text-xs font-semibold text-[#7CFFB2]">
          VS
        </span>
        <p className="min-w-0 flex-1 truncate text-right text-base font-semibold text-[#FFFFFF]">{match.awayTeam}</p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-[#264135] bg-[#151D1A] px-3 py-2 text-center">
          <p className="text-xs font-semibold text-[#FFFFFF]">{oddsSummary(match)}</p>
          <p className="mt-1 text-[10px] text-[#A7B5AE]">ราคาตลาด 1X2</p>
        </div>
        <div className="rounded-2xl border border-[#285340] bg-[#123D2B]/25 px-3 py-2 text-center">
          <p className="text-sm font-semibold text-[#7CFFB2]">{match.overUnder}</p>
          <p className="mt-1 text-[10px] text-[#A7B5AE]">สูง/ต่ำ</p>
        </div>
        <div className="rounded-2xl border border-[#264135] bg-[#151D1A] px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[#FFFFFF]">{match.analysisPercent}%</p>
            <p className="text-[10px] text-[#7CFFB2]">{match.analysisSide}</p>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/8">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-[#21E58A] to-[#7CFFB2]"
              style={{ width: `${match.analysisPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-sm text-[#C7D3CC]">{match.broadcast}</p>
        <Link
          href={`/matches/${match.id}`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#21E58A] px-4 py-2.5 text-sm font-semibold text-[#041109] shadow-[0_12px_24px_rgba(33,229,138,0.24)]"
        >
          ดูวิเคราะห์
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default function TodayAnalysisPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ทั้งหมด");
  const [search, setSearch] = useState("");
  const [expandedLeagues, setExpandedLeagues] = useState<Record<string, boolean>>({});

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

  function toggleLeague(league: string) {
    setExpandedLeagues((current) => ({
      ...current,
      [league]: !current[league],
    }));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 md:pt-10">
      <SectionHeading
        eyebrow="วิเคราะห์วันนี้"
        title="ตารางข้อมูลก่อนเกมแบบกระชับสำหรับเช็คหลายคู่ได้เร็ว"
        description="รวมคู่แข่งขันตามลีกและเวลาแข่ง พร้อมราคาตลาด 1X2 สูง/ต่ำ มุมมองข้อมูลเชิงสถิติ ช่องถ่ายทอดสด และทางลัดดูรายละเอียดในรูปแบบที่เหมาะกับการเช็คบอลหลายคู่ต่อวัน"
      />

      <section className="mt-8 rounded-[30px] border border-[#294336] bg-[linear-gradient(180deg,#141D19_0%,#0D1210_100%)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.26)] md:p-6">
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
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
            </div>
            <div className="rounded-3xl border border-[#FF3B5F]/30 bg-[#FF3B5F]/10 p-5">
              <p className="text-sm text-[#A7B5AE]">ถ่ายทอดสด</p>
              <p className="mt-3 text-4xl font-semibold text-[#FFFFFF]">{liveCount}</p>
            </div>
            <div className="rounded-3xl border border-[#21E58A]/25 bg-[#21E58A]/10 p-5">
              <p className="text-sm text-[#A7B5AE]">มีบทวิเคราะห์</p>
              <p className="mt-3 text-4xl font-semibold text-[#FFFFFF]">{analysisCount}</p>
            </div>
            <div className="rounded-3xl border border-[#F5C542]/25 bg-[#F5C542]/10 p-5">
              <p className="text-sm text-[#A7B5AE]">พรีเมียม</p>
              <p className="mt-3 text-4xl font-semibold text-[#FFFFFF]">{premiumCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-6">
        {leagueNames.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[#294336] bg-[#101614] p-8 text-center text-[#A7B5AE]">
            ไม่พบข้อมูลคู่แข่งขันที่ตรงกับเงื่อนไขที่เลือก
          </div>
        ) : (
          leagueNames.map((league) => {
            const matchesForLeague = groupedMatches[league];
            const isExpanded = expandedLeagues[league] ?? false;
            const visibleMatches = isExpanded ? matchesForLeague : matchesForLeague.slice(0, visiblePerLeague);
            const hasMore = matchesForLeague.length > visiblePerLeague;

            return (
              <div key={league} className="space-y-3">
                <div className="rounded-[26px] border border-[#285340] bg-[linear-gradient(90deg,#0B1F17_0%,#123D2B_55%,#09130F_100%)] px-5 py-4 shadow-[0_16px_42px_rgba(0,0,0,0.22)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-[#7CFFB2]">ลีกการแข่งขัน</p>
                      <h2 className="mt-1 text-2xl font-semibold text-[#FFFFFF]">{league}</h2>
                    </div>
                    <div className="rounded-full border border-[#3A5E4A] bg-black/16 px-4 py-2 text-sm font-medium text-[#D5E0DA]">
                      {matchesForLeague.length} คู่
                    </div>
                  </div>
                </div>

                <div className="hidden gap-3 lg:flex lg:flex-col">
                  <div className="grid grid-cols-[84px_138px_minmax(150px,1fr)_170px_minmax(150px,1fr)_92px_124px_138px_126px] gap-3 px-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#7E8D86]">
                    <p>เวลา</p>
                    <p>สถานะ</p>
                    <p>ทีมเหย้า</p>
                    <p>ราคาตลาด 1X2</p>
                    <p>ทีมเยือน</p>
                    <p>สูง/ต่ำ</p>
                    <p>% วิเคราะห์</p>
                    <p>ช่องถ่ายทอดสด</p>
                    <p className="text-right">รายละเอียด</p>
                  </div>

                  {visibleMatches.map((match) => (
                    <DesktopMatchRow key={match.id} match={match} />
                  ))}
                </div>

                <div className="grid gap-3 lg:hidden">
                  {visibleMatches.map((match) => (
                    <MobileMatchCard key={match.id} match={match} />
                  ))}
                </div>

                {hasMore ? (
                  <div className="flex justify-center pt-1">
                    <button
                      type="button"
                      onClick={() => toggleLeague(league)}
                      className="rounded-full border border-[#294336] bg-[#151D1A] px-5 py-2.5 text-sm font-semibold text-[#C7D3CC] transition hover:border-[#21E58A] hover:text-[#FFFFFF]"
                    >
                      {isExpanded ? "ย่อรายการ" : `แสดงทั้งหมด (${matchesForLeague.length} คู่)`}
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
