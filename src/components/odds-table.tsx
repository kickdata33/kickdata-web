import { oddsRows } from "@/data/mock-matches";

export function OddsTable() {
  return (
    <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,18,15,0.95),rgba(5,9,7,0.98))] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">ราคาตลาด</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">ตารางราคาตลาดก่อนเกม</h3>
        </div>
        <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          อัปเดต 10:45 น.
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-white/45">
            <tr>
              <th className="px-6 py-4 font-medium">คู่แข่งขัน</th>
              <th className="px-6 py-4 font-medium">ประเภทข้อมูล</th>
              <th className="px-6 py-4 font-medium">ราคาตลาด</th>
              <th className="px-6 py-4 font-medium">ราคาอ้างอิง</th>
              <th className="px-6 py-4 font-medium">ส่วนต่างข้อมูล</th>
              <th className="px-6 py-4 font-medium">การเปลี่ยนแปลง</th>
            </tr>
          </thead>
          <tbody>
            {oddsRows.map((row) => (
              <tr key={`${row.match}-${row.market}`} className="border-t border-white/6">
                <td className="px-6 py-5">
                  <p className="font-medium text-white">{row.match}</p>
                  <p className="mt-1 text-xs text-white/45">{row.note}</p>
                </td>
                <td className="px-6 py-5 text-white/72">{row.market}</td>
                <td className="px-6 py-5 text-white">{row.bestPrice}</td>
                <td className="px-6 py-5 text-white/65">{row.fairPrice}</td>
                <td className="px-6 py-5">
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 font-semibold text-emerald-300">
                    {row.edge}
                  </span>
                </td>
                <td className="px-6 py-5 text-white/72">{row.movement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
