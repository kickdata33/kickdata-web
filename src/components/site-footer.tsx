export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-black/15">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">KickData</p>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-white/68">
          เว็บไซต์นี้นำเสนอข้อมูลก่อนเกม สถิติทีม ข่าวทีม นักเตะที่คาดว่าจะลงสนาม ราคาตลาด และช่องถ่ายทอดสด
          เพื่อใช้ประกอบการติดตามฟุตบอลเชิงข้อมูลเท่านั้น
        </p>
        <div className="mt-5 rounded-3xl border border-amber-300/20 bg-amber-300/8 px-5 py-4 text-sm leading-7 text-amber-50/90">
          ข้อความชี้แจง: เว็บไซต์นี้ไม่ใช่เว็บพนัน ไม่มีระบบรับเดิมพัน ไม่มีระบบทายผล
          ไม่มีการเติมเงินหรือถอนเงิน ข้อมูลทั้งหมดจัดทำขึ้นเพื่อการติดตามฟุตบอลและการศึกษาสถิติเท่านั้น
        </div>
      </div>
    </footer>
  );
}
