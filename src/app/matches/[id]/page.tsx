import Link from "next/link";
import { notFound } from "next/navigation";

import { mockMatches } from "@/data/mock-matches";

type MatchDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
  const { id } = await params;
  const match = mockMatches.find((item) => item.id === id);

  if (!match) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-10">
      <Link href="/today-analysis" className="text-sm text-emerald-300">
        กลับไปหน้าวิเคราะห์วันนี้
      </Link>

      <section className="mt-6 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,21,17,0.94),rgba(4,8,6,0.98))] p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">{match.league}</p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">
              {match.homeTeam} พบ {match.awayTeam}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">{match.summary}</p>
          </div>
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-right">
            <p className="text-xs uppercase tracking-[0.22em] text-white/50">ระดับความชัดเจนของข้อมูล</p>
            <p className="mt-2 text-4xl font-semibold text-white">{match.confidence}%</p>
            <p className="mt-1 text-sm text-emerald-300">ส่วนต่างจากราคาตลาด {match.edge}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">เวลาแข่งขัน</p>
            <p className="mt-2 text-lg font-medium text-white">{match.kickoff}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">สนามแข่งขัน</p>
            <p className="mt-2 text-lg font-medium text-white">{match.venue}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">ค่า xG คาดการณ์</p>
            <p className="mt-2 text-lg font-medium text-white">{match.xgProjection}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">ราคาตลาด</p>
            <p className="mt-2 text-lg font-medium text-white">
              {match.homeOdds} / {match.drawOdds} / {match.awayOdds}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">มุมมองจากข้อมูล</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{match.modelLean}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {match.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">ประเด็นสำคัญก่อนเกม</p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-white/72">
            {match.keyAngles.map((angle) => (
              <li key={angle}>{angle}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
