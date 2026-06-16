"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import styles from "./page.module.css";

type Match = {
  id: number;
  date: string;
  time: string;
  league: string;
  country: string;
  home: string;
  away: string;
  homeGoals: number | null;
  awayGoals: number | null;
  statusShort: string;
  statusLong: string;
};

type PickForm = {
  fixtureId: number;
  date: string;
  time: string;
  league: string;
  country: string;
  home: string;
  away: string;

  handicapLine: string;
  handicapPick: "home" | "away" | "none";
  handicapText: string;
  handicapPercent: string;

  totalLine: string;
  totalPick: "over" | "under" | "none";
  totalText: string;
  totalPercent: string;

  note: string;
  visibility: "free" | "vip7" | "vip30" | "vip90";
  top: boolean;
};

function getTodayBangkok() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function createDefaultPick(match: Match): PickForm {
  return {
    fixtureId: match.id,
    date: match.date.slice(0, 10),
    time: match.time,
    league: match.league,
    country: match.country,
    home: match.home,
    away: match.away,

    handicapLine: "",
    handicapPick: "none",
    handicapText: "",
    handicapPercent: "",

    totalLine: "",
    totalPick: "none",
    totalText: "",
    totalPercent: "",

    note: "",
    visibility: "vip30",
    top: false,
  };
}

export default function AdminAnalysisPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  const [date, setDate] = useState(getTodayBangkok());
  const [matches, setMatches] = useState<Match[]>([]);
  const [forms, setForms] = useState<Record<number, PickForm>>({});

  const [loadingMatches, setLoadingMatches] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      const role = userSnap.exists() ? userSnap.data().role : "member";

      if (role !== "admin") {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      setIsAdmin(true);
      setCheckingAdmin(false);
    });

    return () => unsubscribe();
  }, [router]);

  async function loadMatches() {
    setLoadingMatches(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`/api/scores?date=${date}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "โหลดคู่บอลไม่สำเร็จ");
        setMatches([]);
        return;
      }

      const loadedMatches: Match[] = data.matches || [];
      setMatches(loadedMatches);

      const nextForms: Record<number, PickForm> = {};
      loadedMatches.forEach((match) => {
        nextForms[match.id] = createDefaultPick(match);
      });

      setForms(nextForms);
      setMessage(`โหลดคู่บอลสำเร็จ ${loadedMatches.length} คู่`);
    } catch {
      setError("เชื่อมต่อ API ไม่สำเร็จ");
    } finally {
      setLoadingMatches(false);
    }
  }

  function updateForm(fixtureId: number, field: keyof PickForm, value: any) {
    setForms((prev) => ({
      ...prev,
      [fixtureId]: {
        ...prev[fixtureId],
        [field]: value,
      },
    }));
  }

  async function savePick(fixtureId: number) {
    const form = forms[fixtureId];

    if (!form) return;

    if (
      !form.handicapLine ||
      form.handicapPick === "none" ||
      !form.handicapPercent ||
      !form.totalLine ||
      form.totalPick === "none" ||
      !form.totalPercent
    ) {
      setError("กรุณากรอก แฮนดิแคป / สูงต่ำ / % ให้ครบก่อนบันทึก");
      return;
    }

    setSavingId(fixtureId);
    setError("");
    setMessage("");

    try {
      const matchName = `${form.home} vs ${form.away}`;

      await addDoc(collection(db, "analysisPicks"), {
        fixtureId: form.fixtureId,
        date: form.date,
        time: form.time,
        league: form.league,
        country: form.country,
        home: form.home,
        away: form.away,
        match: matchName,

        handicapLine: Number(form.handicapLine),
        handicapPick: form.handicapPick,
        handicapText:
          form.handicapText ||
          `${form.handicapPick === "home" ? form.home : form.away} ${form.handicapLine}`,
        handicapPercent: Number(form.handicapPercent),

        totalLine: Number(form.totalLine),
        totalPick: form.totalPick,
        totalText:
          form.totalText ||
          `${form.totalPick === "over" ? "สูง" : "ต่ำ"} ${form.totalLine}`,
        totalPercent: Number(form.totalPercent),

        note: form.note,
        visibility: form.visibility,
        top: form.top,

        resultStatus: "pending",
        homeScore: null,
        awayScore: null,

        createdBy: user?.uid || null,
        createdByEmail: user?.email || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setMessage(`บันทึกวิเคราะห์แล้ว: ${matchName}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "บันทึกไม่สำเร็จ");
    } finally {
      setSavingId(null);
    }
  }

  const filteredMatches = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return matches;

    return matches.filter((match) =>
      `${match.league} ${match.country} ${match.home} ${match.away}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [matches, search]);

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
          <p>หน้านี้สำหรับแอดมินเท่านั้น</p>
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
          <h1>เพิ่มรายการวิเคราะห์</h1>
          <p className={styles.sub}>
            เลือกวันที่ โหลดคู่บอลจริงจาก API แล้วกรอกทีเด็ดทุกคู่ที่ต้องการนำมาวิเคราะห์
          </p>
        </div>

        <div className={styles.statusBox}>
          <span>แอดมิน</span>
          <strong>{user?.email}</strong>
        </div>
      </header>

      <section className={styles.controlCard}>
        <div className={styles.controlGroup}>
          <label>
            เลือกวันที่
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <button onClick={loadMatches} disabled={loadingMatches}>
            {loadingMatches ? "กำลังโหลด..." : "โหลดคู่บอล"}
          </button>
        </div>

        <input
          className={styles.searchInput}
          type="text"
          placeholder="ค้นหาลีก / ประเทศ / ทีม"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {message && <div className={styles.success}>{message}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.tableCard}>
        <div className={styles.tableTitle}>
          <h2>คู่บอลวันที่ {date}</h2>
          <p>แสดงเฉพาะคู่จาก API จริง แล้วบันทึกคู่ที่นำมาวิเคราะห์ลง Firestore</p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>เวลา</th>
                <th>ลีก</th>
                <th>คู่แข่งขัน</th>
                <th>แฮนดิแคป</th>
                <th>เลือก</th>
                <th>%</th>
                <th>สูงต่ำ</th>
                <th>เลือก</th>
                <th>%</th>
                <th>สิทธิ์</th>
                <th>ตัวเด่น</th>
                <th>ทรรศนะ</th>
                <th>บันทึก</th>
              </tr>
            </thead>

            <tbody>
              {filteredMatches.length === 0 ? (
                <tr>
                  <td colSpan={13} className={styles.emptyCell}>
                    ยังไม่มีข้อมูล กด “โหลดคู่บอล” ก่อน
                  </td>
                </tr>
              ) : (
                filteredMatches.map((match) => {
                  const form = forms[match.id];

                  if (!form) return null;

                  return (
                    <tr key={match.id}>
                      <td className={styles.time}>{match.time}</td>

                      <td>
                        <span className={styles.league}>{match.league}</span>
                      </td>

                      <td className={styles.match}>
                        {match.home} vs {match.away}
                      </td>

                      <td>
                        <input
                          className={styles.smallInput}
                          type="number"
                          step="0.25"
                          placeholder="-0.75"
                          value={form.handicapLine}
                          onChange={(e) =>
                            updateForm(match.id, "handicapLine", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <select
                          value={form.handicapPick}
                          onChange={(e) =>
                            updateForm(match.id, "handicapPick", e.target.value)
                          }
                        >
                          <option value="none">เลือก</option>
                          <option value="home">{match.home}</option>
                          <option value="away">{match.away}</option>
                        </select>
                      </td>

                      <td>
                        <input
                          className={styles.percentInput}
                          type="number"
                          min="1"
                          max="100"
                          placeholder="65"
                          value={form.handicapPercent}
                          onChange={(e) =>
                            updateForm(match.id, "handicapPercent", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          className={styles.smallInput}
                          type="number"
                          step="0.25"
                          placeholder="2.75"
                          value={form.totalLine}
                          onChange={(e) =>
                            updateForm(match.id, "totalLine", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <select
                          value={form.totalPick}
                          onChange={(e) =>
                            updateForm(match.id, "totalPick", e.target.value)
                          }
                        >
                          <option value="none">เลือก</option>
                          <option value="over">สูง</option>
                          <option value="under">ต่ำ</option>
                        </select>
                      </td>

                      <td>
                        <input
                          className={styles.percentInput}
                          type="number"
                          min="1"
                          max="100"
                          placeholder="65"
                          value={form.totalPercent}
                          onChange={(e) =>
                            updateForm(match.id, "totalPercent", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <select
                          value={form.visibility}
                          onChange={(e) =>
                            updateForm(match.id, "visibility", e.target.value)
                          }
                        >
                          <option value="free">Free</option>
                          <option value="vip7">VIP 7+</option>
                          <option value="vip30">VIP 30+</option>
                          <option value="vip90">VIP 90</option>
                        </select>
                      </td>

                      <td>
                        <input
                          type="checkbox"
                          checked={form.top}
                          onChange={(e) =>
                            updateForm(match.id, "top", e.target.checked)
                          }
                        />
                      </td>

                      <td>
                        <textarea
                          placeholder="ทรรศนะ..."
                          value={form.note}
                          onChange={(e) =>
                            updateForm(match.id, "note", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <button
                          className={styles.saveButton}
                          disabled={savingId === match.id}
                          onClick={() => savePick(match.id)}
                        >
                          {savingId === match.id ? "..." : "บันทึก"}
                        </button>
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
        ข้อมูลที่บันทึกจะถูกเก็บใน Firestore collection analysisPicks
      </p>
    </main>
  );
}
