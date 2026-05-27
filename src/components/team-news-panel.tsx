import { teamNews } from "@/data/mock-matches";

export function TeamNewsPanel() {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">ข่าวทีม</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">ข่าวทีมและนักเตะที่คาดว่าจะลงสนาม</h3>
        </div>
        <span className="rounded-full bg-white/6 px-3 py-1 text-xs text-white/55">อัปเดตรายวัน</span>
      </div>

      <div className="mt-6 space-y-4">
        {teamNews.map((item) => (
          <article key={item.club} className="rounded-3xl border border-white/8 bg-black/12 p-5">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-lg font-semibold text-white">{item.club}</h4>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                {item.status}
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-white/90">{item.headline}</p>
            <p className="mt-2 text-sm leading-7 text-white/65">{item.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
