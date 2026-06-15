"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import styles from "./page.module.css";

type VipLevel = "free" | "vip7" | "vip30" | "vip90";

type Member = {
  id: string;
  email: string;
  role?: string;
  vipLevel?: VipLevel;
  vipUntil?: string | null;
  createdAt?: any;
  updatedAt?: any;
};

function getTodayDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatThaiDate(date?: string | null) {
  if (!date) return "-";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function getVipLabel(level?: string) {
  if (level === "vip7") return "VIP 7 วัน";
  if (level === "vip30") return "VIP 30 วัน";
  if (level === "vip90") return "VIP 90 วัน";
  return "Free";
}

function getRemainingDays(vipUntil?: string | null) {
  if (!vipUntil) return 0;

  const now = new Date();
  const end = new Date(`${vipUntil}T23:59:59`);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 0;

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function AdminMembersPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  async function loadMembers() {
    setLoading(true);

    const q = query(collection(db, "users"), orderBy("email", "asc"));
    const snap = await getDocs(q);

    const list = snap.docs.map((item) => ({
      id: item.id,
      ...(item.data() as Omit<Member, "id">),
    }));

    setMembers(list);
    setLoading(false);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      const adminRef = doc(db, "users", currentUser.uid);
      const adminSnap = await getDoc(adminRef);

      const role = adminSnap.exists() ? adminSnap.data().role : "member";

      if (role !== "admin") {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      setIsAdmin(true);
      setCheckingAdmin(false);
      await loadMembers();
    });

    return () => unsubscribe();
  }, [router]);

  async function updateVip(memberId: string, level: VipLevel) {
    setSavingId(memberId);
    setMessage("");

    let vipUntil: string | null = null;

    if (level === "vip7") vipUntil = addDays(7);
    if (level === "vip30") vipUntil = addDays(30);
    if (level === "vip90") vipUntil = addDays(90);

    await updateDoc(doc(db, "users", memberId), {
      vipLevel: level,
      vipUntil,
      updatedAt: new Date().toISOString(),
    });

    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? {
              ...member,
              vipLevel: level,
              vipUntil,
            }
          : member
      )
    );

    setMessage(`อัปเดตสมาชิกเรียบร้อย: ${getVipLabel(level)}`);
    setSavingId("");
  }

  async function makeAdmin(memberId: string) {
    setSavingId(memberId);
    setMessage("");

    await updateDoc(doc(db, "users", memberId), {
      role: "admin",
      updatedAt: new Date().toISOString(),
    });

    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? {
              ...member,
              role: "admin",
            }
          : member
      )
    );

    setMessage("ตั้งค่าเป็นแอดมินเรียบร้อย");
    setSavingId("");
  }

  const filteredMembers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return members;

    return members.filter((member) =>
      `${member.email} ${member.role} ${member.vipLevel}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [members, search]);

  const vipCount = members.filter(
    (member) =>
      member.vipLevel &&
      member.vipLevel !== "free" &&
      getRemainingDays(member.vipUntil) > 0
  ).length;

  const freeCount = members.filter(
    (member) => !member.vipLevel || member.vipLevel === "free"
  ).length;

  if (checkingAdmin) {
    return (
      <main className={styles.page}>
        <section className={styles.noticeCard}>กำลังตรวจสอบสิทธิ์แอดมิน...</section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className={styles.page}>
        <section className={styles.deniedCard}>
          <h1>ไม่มีสิทธิ์เข้าใช้งาน</h1>
          <p>หน้านี้สำหรับแอดมินเท่านั้น กรุณาให้แอดมินตั้ง role เป็น admin ใน Firestore ก่อน</p>
          <a href="/member">กลับหน้าสมาชิก</a>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.brand}>KickData Admin</p>
          <h1>จัดการสมาชิก VIP</h1>
          <p className={styles.sub}>
            อนุมัติ VIP 7 วัน / 30 วัน / 90 วัน และตรวจสอบสถานะสมาชิก
          </p>
        </div>

        <div className={styles.statusBox}>
          <span>แอดมิน</span>
          <strong>{user?.email}</strong>
        </div>
      </header>

      <section className={styles.summary}>
        <div>
          <span>สมาชิกทั้งหมด</span>
          <strong>{members.length}</strong>
          <p>บัญชี</p>
        </div>

        <div>
          <span>VIP ที่ยังใช้งานได้</span>
          <strong className={styles.blueText}>{vipCount}</strong>
          <p>บัญชี</p>
        </div>

        <div>
          <span>Free</span>
          <strong>{freeCount}</strong>
          <p>บัญชี</p>
        </div>

        <div>
          <span>วันนี้</span>
          <strong>{formatThaiDate(getTodayDate())}</strong>
          <p>วันที่ระบบ</p>
        </div>
      </section>

      <section className={styles.toolbar}>
        <input
          type="text"
          placeholder="ค้นหาอีเมล / role / VIP"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={loadMembers}>รีเฟรชข้อมูล</button>

        {message && <span>{message}</span>}
      </section>

      <section className={styles.tableCard}>
        <div className={styles.tableTitle}>
          <h2>รายชื่อสมาชิก</h2>
          <p>กดปุ่มเพื่อเปิดสิทธิ์ VIP ให้สมาชิกหลังตรวจสอบสลิปแล้ว</p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>อีเมล</th>
                <th>Role</th>
                <th>แพ็กเกจ</th>
                <th>วันหมดอายุ</th>
                <th>เหลือ</th>
                <th>เปิด VIP</th>
                <th>จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className={styles.emptyCell}>
                    กำลังโหลดสมาชิก...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyCell}>
                    ไม่พบสมาชิกตามคำค้นหา
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const remaining = getRemainingDays(member.vipUntil);
                  const activeVip =
                    member.vipLevel &&
                    member.vipLevel !== "free" &&
                    remaining > 0;

                  return (
                    <tr key={member.id}>
                      <td className={styles.email}>{member.email || "-"}</td>

                      <td>
                        <span
                          className={
                            member.role === "admin"
                              ? styles.adminBadge
                              : styles.memberBadge
                          }
                        >
                          {member.role || "member"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={activeVip ? styles.vipBadge : styles.freeBadge}
                        >
                          {activeVip ? getVipLabel(member.vipLevel) : "Free"}
                        </span>
                      </td>

                      <td>{formatThaiDate(member.vipUntil)}</td>

                      <td>
                        {activeVip ? (
                          <span className={styles.remaining}>{remaining} วัน</span>
                        ) : (
                          <span className={styles.expired}>-</span>
                        )}
                      </td>

                      <td>
                        <div className={styles.buttonGroup}>
                          <button
                            disabled={savingId === member.id}
                            onClick={() => updateVip(member.id, "vip7")}
                          >
                            VIP 7
                          </button>

                          <button
                            disabled={savingId === member.id}
                            onClick={() => updateVip(member.id, "vip30")}
                          >
                            VIP 30
                          </button>

                          <button
                            disabled={savingId === member.id}
                            onClick={() => updateVip(member.id, "vip90")}
                          >
                            VIP 90
                          </button>
                        </div>
                      </td>

                      <td>
                        <div className={styles.buttonGroup}>
                          <button
                            disabled={savingId === member.id}
                            onClick={() => updateVip(member.id, "free")}
                            className={styles.freeButton}
                          >
                            Free
                          </button>

                          {member.role !== "admin" && (
                            <button
                              disabled={savingId === member.id}
                              onClick={() => makeAdmin(member.id)}
                              className={styles.adminButton}
                            >
                              Admin
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className={styles.disclaimer}>
        หน้านี้ใช้สำหรับแอดมินตรวจสอบสมาชิกและเปิดสิทธิ์ VIP หลังได้รับชำระเงิน
      </p>
    </main>
  );
}
