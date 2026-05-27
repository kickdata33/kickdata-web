import { broadcastPartners } from "@/data/mock-matches";

export function BroadcastGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {broadcastPartners.map((item) => (
        <div
          key={item.channel}
          className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,13,0.95),rgba(4,8,6,0.98))] p-6"
        >
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">{item.title}</p>
          <h3 className="mt-3 text-xl font-semibold text-white">{item.channel}</h3>
          <p className="mt-4 text-sm leading-7 text-white/68">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
