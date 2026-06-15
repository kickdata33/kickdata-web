"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MainNav.module.css";

const menuItems = [
  {
    label: "วิเคราะห์บอล",
    href: "/today-analysis",
  },
  {
    label: "ผลบอล",
    href: "/scores",
  },
  {
    label: "ผลย้อนหลัง",
    href: "/results",
  },
  {
    label: "VIP",
    href: "/pricing",
  },
  {
    label: "สมาชิก",
    href: "/member",
  },
  {
    label: "แอดมิน",
    href: "/admin-members",
  },
  {
    label: "เข้าสู่ระบบ",
    href: "/login",
  },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/today-analysis" className={styles.logo}>
          KickData
        </Link>

        <div className={styles.links}>
          {menuItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href === "/pricing" && pathname === "/payment");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.link} ${active ? styles.active : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
