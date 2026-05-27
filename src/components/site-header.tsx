"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "หน้าแรก" },
  { href: "/today-analysis", label: "วิเคราะห์วันนี้" },
  { href: "/pricing", label: "แพ็กเกจสมาชิก" },
  { href: "/login", label: "เข้าสู่ระบบ" },
  { href: "/admin", label: "หลังบ้านผู้ดูแลระบบ" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(6,10,8,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/35 bg-emerald-400/12 text-lg font-semibold text-emerald-300">
            KD
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/45">KickData</p>
            <p className="text-base font-semibold text-white">ศูนย์วิเคราะห์ฟุตบอลเชิงข้อมูล</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-emerald-400 text-[#031109]"
                    : "text-white/70 hover:bg-white/6 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
