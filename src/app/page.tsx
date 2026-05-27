import Link from "next/link";

import { BroadcastGrid } from "@/components/broadcast-grid";
import { MatchCard } from "@/components/match-card";
import { MetricCard } from "@/components/metric-card";
import { OddsTable } from "@/components/odds-table";
import { SectionHeading } from "@/components/section-heading";
import { TeamNewsPanel } from "@/components/team-news-panel";
import { dashboardMetrics, heroSignals, mockMatches, pricingTiers } from "@/data/mock-matches";

export default function HomePage() {
  const featuredMatches = mockMatches.slice(0, 2);
  const featuredPricing = pricingTiers.slice(0, 3);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-20 px-6 pb-20 pt-8 md:pt-10">
      <section className="grid gap-8 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(140deg,rgba(10,16,13,0.98),rgba(6,10,8,0.94))] p-7 shadow-[0_26px_120px_rgba(0,0,0,0.36)] md:p-9">
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
            KickData Member Desk
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight text-white md:text-7xl">
            ฟุตบอล data-driven ที่ดู premium และคมแบบ trading dashboard.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            ดูทีเด็ดวันนี้, market edge, team news, official broadcast และ match detail ในหน้าตา dark neon
            green ที่ออกแบบมาสำหรับ serious football members.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/today-analysis"
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-[#041109] shadow-[0_10px_30px_rgba(52,211,153,0.25)]"
            >
              เปิด Today Analysis
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/82"
            >
              ดูแพ็กเกจสมาชิก
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {heroSignals.map((signal) => (
              <div key={signal.label} className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/42">{signal.label}</p>
                <p className="mt-2 text-xl font-semibold text-white">{signal.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,13,0.94),rgba(4,8,6,0.98))] p-6 shadow-[0_25px_100px_rgba(0,0,0,0.38)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">Matchday radar</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Market Pulse สดวันนี้</h2>
            </div>
            <span className="rounded-full bg-emerald-400/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Live mock data
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {mockMatches.map((match) => (
              <div key={match.id} className="rounded-3xl border border-white/8 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">{match.league}</p>
                    <p className="mt-1 text-lg font-medium text-white">
                      {match.homeTeam} vs {match.awayTeam}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/40">Confidence</p>
                    <p className="mt-1 text-lg font-semibold text-white">{match.confidence}%</p>
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/8">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500"
                    style={{ width: `${match.confidence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <OddsTable />
        <TeamNewsPanel />
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Featured card"
          title="Today’s sharpest football positions ทีเด็ดที่ดูแล้วใช้งานได้จริง"
          description="Mock data is wired through the UI already, so swapping in Firebase or another backend later will be straightforward."
        />
        <div className="grid gap-6">
          {featuredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Official broadcast"
          title="ช่องถ่ายทอดสดและ live member coverage"
          description="พื้นที่นี้ช่วยให้ reference feel ใกล้ dashboard ฟุตบอลมากขึ้น ทั้งเรื่อง official stream, live room และ data feed blocks."
        />
        <BroadcastGrid />
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Pricing cards ที่ดู premium และพร้อมต่อยอดเป็น membership จริง"
          description="ยังเป็น mock content แต่โครงสร้างพร้อมสำหรับ payment flow และ auth ภายหลัง."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredPricing.map((tier, index) => {
            const featured = index === 1;

            return (
              <div
                key={tier.name}
                className={`rounded-[30px] border p-6 ${
                  featured
                    ? "border-emerald-400/35 bg-[linear-gradient(180deg,rgba(16,35,26,0.95),rgba(5,10,7,0.98))]"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">{tier.name}</p>
                  <span className="rounded-full bg-white/7 px-3 py-1 text-xs text-white/60">{tier.badge}</span>
                </div>
                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-semibold text-white">{tier.price}</span>
                  <span className="pb-2 text-white/55">{tier.cadence}</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/70">{tier.description}</p>
                <ul className="mt-6 space-y-3 text-sm text-white/78">
                  {tier.features.map((feature) => (
                    <li key={feature} className="rounded-2xl border border-white/10 bg-black/12 px-4 py-3">
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#041109]"
                >
                  {tier.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
