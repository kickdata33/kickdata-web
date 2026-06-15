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
            const active = pathname === item.href;

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
