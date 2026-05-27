import { BroadcastGrid } from "@/components/broadcast-grid";
import { MatchCard } from "@/components/match-card";
import { OddsTable } from "@/components/odds-table";
import { SectionHeading } from "@/components/section-heading";
import { TeamNewsPanel } from "@/components/team-news-panel";
import { dashboardMetrics, mockMatches } from "@/data/mock-matches";

export default function TodayAnalysisPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <SectionHeading
        eyebrow="Today analysis"
        title="Your matchday member dashboard โต๊ะวิเคราะห์บอลของวันนี้"
        description="A premium overview of the strongest edges on today’s football slate, with clean data blocks, team context, odds snapshots, and direct links into deeper match detail."
      />

      <section className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Daily board</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {dashboardMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-black/15 p-5">
                <p className="text-sm text-white/55">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-sm text-emerald-300">{metric.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,24,18,0.95),rgba(5,9,7,0.98))] p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Workflow notes</p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-white/72">
            <li>Prioritize markets where model edge is above +4% และ lineup uncertainty ต่ำ.</li>
            <li>Use match detail pages to compare projected xG, form, tactical angles, และราคา.</li>
            <li>Admin and auth are placeholders for now so the structure stays backend-agnostic.</li>
          </ul>
        </div>
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <OddsTable />
        <TeamNewsPanel />
      </section>

      <section className="mt-10 grid gap-6">
        {mockMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </section>

      <section className="mt-10 space-y-8">
        <SectionHeading
          eyebrow="Official broadcast"
          title="Official broadcast + live content blocks"
          description="เพิ่ม section สำหรับถ่ายทอดสดและ live data layer ให้หน้า analysis ใกล้ reference dashboard มากขึ้น."
        />
        <BroadcastGrid />
      </section>
    </div>
  );
}
