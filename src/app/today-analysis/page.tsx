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
        eyebrow="วิเคราะห์วันนี้"
        title="สรุปข้อมูลก่อนเกมประจำวัน"
        description="ภาพรวมการแข่งขันประจำวันของ KickData ที่รวมสถิติทีม ข่าวทีม นักเตะที่คาดว่าจะลงสนาม ราคาตลาด และลิงก์ไปยังรายละเอียดของแต่ละคู่"
      />

      <section className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">สรุปตัวเลขสำคัญ</p>
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
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">แนวทางการอ่านข้อมูล</p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-white/72">
            <li>เริ่มจากดูฟอร์มล่าสุดและค่า xG เพื่อเข้าใจรูปแบบเกมของทั้งสองทีม</li>
            <li>เปรียบเทียบข่าวทีม นักเตะที่คาดว่าจะลงสนาม และราคาตลาดควบคู่กัน</li>
            <li>กดดูรายละเอียดในแต่ละคู่เพื่ออ่านข้อมูลก่อนเกมแบบเชิงลึกมากขึ้น</li>
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
          eyebrow="ช่องถ่ายทอดสด"
          title="ช่องถ่ายทอดสดและข้อมูลประกอบระหว่างแข่งขัน"
          description="รวบรวมช่องถ่ายทอดสดอย่างเป็นทางการและพื้นที่สรุปข้อมูลระหว่างเกม เพื่อให้ติดตามฟุตบอลได้สะดวกยิ่งขึ้น"
        />
        <BroadcastGrid />
      </section>
    </div>
  );
}
