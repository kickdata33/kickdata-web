import Link from "next/link";

import type { Match } from "@/types/match";

type MatchCardProps = {
  match: Match;
};

function renderForm(form: Match["homeForm"]) {
  return form.map((result, index) => {
    const tone =
      result === "W"
        ? "bg-emerald-400/18 text-emerald-300"
        : result === "D"
          ? "bg-amber-400/18 text-amber-200"
          : "bg-rose-400/18 text-rose-200";

    const label = result === "W" ? "ช" : result === "D" ? "ส" : "พ";

    return (
      <span
        key={`${result}-${index}`}
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${tone}`}
      >
        {label}
      </span>
    );
  });
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <div className="group overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,20,0.96),rgba(5,9,7,0.98))] p-6 transition hover:border-emerald-400/35 hover:shadow-[0_24px_90px_rgba(16,185,129,0.15)]">
      <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/12 text-sm font-bold text-emerald-300">
            {match.homeTeam.slice(0, 2).toUpperCase()}
          </span>
          <div className="text-sm text-white/70">
            <p className="font-semibold text-white">
              {match.homeTeam} <span className="text-white/35">พบ</span> {match.awayTeam}
            </p>
            <p className="mt-1 text-xs tracking-[0.24em] text-white/40">{match.kickoff} เวลาไทย</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/35">ระดับความชัดเจน</p>
          <p className="mt-1 text-xl font-semibold text-emerald-300">{match.confidence}%</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">{match.league}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            {match.homeTeam} พบ {match.awayTeam}
          </h3>
        </div>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          {match.status}
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-white/45">เวลาแข่งขัน</p>
          <p className="mt-2 text-lg font-medium text-white">{match.kickoff}</p>
          <p className="mt-1 text-sm text-white/55">{match.venue}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-white/45">มุมมองจากข้อมูล</p>
          <p className="mt-2 text-lg font-medium text-white">{match.modelLean}</p>
          <p className="mt-1 text-sm text-emerald-300">ส่วนต่างจากราคาตลาด {match.edge}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-white/45">ค่า xG คาดการณ์</p>
          <p className="mt-2 text-lg font-medium text-white">{match.xgProjection}</p>
          <p className="mt-1 text-sm text-white/55">ระดับความชัดเจน {match.confidence}%</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-white/45">ราคาตลาด</p>
          <p className="mt-2 text-lg font-medium text-white">
            {match.homeOdds} / {match.drawOdds} / {match.awayOdds}
          </p>
          <p className="mt-1 text-sm text-white/55">เจ้าบ้าน / เสมอ / ทีมเยือน</p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-white/68">{match.summary}</p>

      <div className="mt-5 h-2 rounded-full bg-white/8">
        <div
          className="h-2 rounded-full bg-[linear-gradient(90deg,#6ee7b7_0%,#34d399_45%,#10b981_100%)]"
          style={{ width: `${match.confidence}%` }}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {match.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">ฟอร์ม {match.homeTeam}</p>
            <div className="mt-2 flex gap-2">{renderForm(match.homeForm)}</div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">ฟอร์ม {match.awayTeam}</p>
            <div className="mt-2 flex gap-2">{renderForm(match.awayForm)}</div>
          </div>
        </div>

        <Link
          href={`/matches/${match.id}`}
          className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#041109] transition group-hover:translate-x-1"
        >
          ดูรายละเอียด
        </Link>
      </div>
    </div>
  );
}
