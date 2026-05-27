export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-7xl items-center px-6 py-16">
      <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">เข้าสู่ระบบสมาชิก</p>
          <h1 className="mt-5 text-5xl font-semibold text-white">เข้าสู่ระบบ KickData</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/70">
            หน้านี้เป็นตัวอย่างหน้าสำหรับสมาชิกในอนาคต เพื่อแสดงรูปแบบการเข้าสู่ระบบของเว็บไซต์ โดยยังไม่ได้เชื่อมต่อระบบภายนอก
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,19,15,0.95),rgba(4,8,6,0.98))] p-8">
          <form className="space-y-5">
            <div>
              <label htmlFor="email" className="text-sm text-white/70">
                อีเมล
              </label>
              <input
                id="email"
                type="email"
                placeholder="member@kickdata.com"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/28"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm text-white/70">
                รหัสผ่าน
              </label>
              <input
                id="password"
                type="password"
                placeholder="********"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/28"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#041109]"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
