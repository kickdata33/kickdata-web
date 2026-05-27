import { SectionHeading } from "@/components/section-heading";
import { pricingTiers } from "@/data/mock-matches";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <SectionHeading
        eyebrow="แพ็กเกจสมาชิก"
        title="เลือกแพ็กเกจสมาชิกของ KickData"
        description="รายละเอียดแพ็กเกจสำหรับผู้ใช้ชาวไทยที่ต้องการติดตามฟุตบอลผ่านข้อมูลก่อนเกม สถิติทีม ข่าวทีม และหน้าวิเคราะห์แบบครบถ้วน"
      />

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        {pricingTiers.map((tier, index) => {
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
              <button className="mt-8 w-full rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#041109]">
                {tier.cta}
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}
