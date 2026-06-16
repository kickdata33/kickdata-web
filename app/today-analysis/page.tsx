"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import styles from "./page.module.css";

type Visibility = "free" | "vip7" | "vip30" | "vip90";

type AnalysisPick = {
  id: string;
  fixtureId: number;
  date: string;
  time: string;
  league: string;
  country: string;
  home: string;
  away: string;
  match: string;

  handicapLine: number;
  handicapPick: "home" | "away";
  handicapText: string;
  handicapPercent: number;

  totalLine: number;
  totalPick: "over" | "under";
  totalText: string;
  totalPercent: number;

  note: string;
  visibility: Visibility;
  top: boolean;

  resultStatus?: string;
  homeScore?: number | null;
  awayScore?: number | null;
};

function getTodayBangkok() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function formatThaiDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function percentClass(percent: number) {
  if (percent >= 70) return styles.percentHigh;
  if (percent >= 65) return styles.percentMedium;
  return styles.percentLow;
}

function visibilityText(visibility: Visibility) {
  if (visibility === "free") return "Free";
  if (visibility === "vip7") return "VIP 7+";
  if (visibility === "vip30") return "VIP 30+";
  return "VIP 90";
}

function groupByLeague(items: AnalysisPick[]) {
  return items.reduce<Record<string, AnalysisPick[]>>((acc, item) => {
    const key = item.league || "ไม่ระบุลีก";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export default function TodayAnalysisPage() {
  const [date, setDate] = useState(getTodayBangkok());
  const [picks, setPicks] = useState<AnalysisPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [leagueFilter, setLeagueFilter] = useState("ALL");

  async function loadPicks(selectedDate = date) {
    setLoading(true);
    setError("");

    try {
      const q = query(
        collection(db, "analysisPicks"),
        where("date", "==", selectedDate)
      );

      const snap = await getDocs(q);

      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<AnalysisPick, "id">),
      }));

      list.sort((a, b) => {
        if (a.league !== b.league) return a.league.localeCompare(b.league);
        return a.time.localeCompare(b.time);
      });

      setPicks(list);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "โหลดข้อมูลวิเคราะห์ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPicks(date);
  }, [date]);

  const leagues = useMemo(() => {
    return Array.from(new Set(picks.map((item) => item.league))).sort();
  }, [picks]);

  const filteredPicks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return picks.filter((pick) => {
      const leagueOk = leagueFilter === "ALL" || pick.league === leagueFilter;

      const searchOk =
        !keyword ||
        `${pick.league} ${pick.country} ${pick.home} ${pick.away} ${pick.note}`
          .toLowerCase()
          .includes(keyword);

      return leagueOk && searchOk;
    });
  }, [picks, search, leagueFilter]);

  const groupedPicks = groupByLeague(filteredPicks);

  const topHandicap = [...filteredPicks].sort(
    (a, b) => b.handicapPercent - a.handicapPercent
  )[0];

  const topTotal = [...filteredPicks].sort(
    (a, b) => b.totalPercent - a.totalPercent
  )[0];

  const topCount = filteredPicks.filter((item) => item.top).length;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.brand}>KickData</p>
          <h1>วิเคราะห์บอลวันนี้</h1>
          <p className={styles.sub}>
            ดึงข้อมูลวิเคราะห์จาก Firestore เฉพาะคู่ที่แอดมินบันทึกไว้
          </p>
        </div>

        <div className={styles.dateBox}>
          <label>เลือกวันที่</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </header>

      <section className={styles.summary}>
        <div className={styles.summaryCard}>
          <span>แฮนดิแคปเด่น</span>
          <strong>{topHandicap?.handicapText || "-"}</strong>
          <p>{topHandicap?.match || "ยังไม่มีข้อมูล"}</p>
          <b>{topHandicap ? `${topHandicap.handicapPercent}%` : "-"}</b>
        </div>

        <div className={styles.summaryCard}>
          <span>สูงต่ำเด่น</span>
          <strong>{topTotal?.totalText || "-"}</strong>
          <p>{topTotal?.match || "ยังไม่มีข้อมูล"}</p>
          <b>{topTotal ? `${topTotal.totalPercent}%` : "-"}</b>
        </div>

        <div className={styles.summaryCard}>
          <span>จำนวนคู่ที่วิเคราะห์</span>
          <strong>{filteredPicks.length} คู่</strong>
          <p>วันที่ {formatThaiDate(date)}</p>
          <b>{topCount} ตัวเด่น</b>
        </div>
      </section>

      <section className={styles.toolbar}>
        <button
          className={leagueFilter === "ALL" ? styles.active : ""}
          onClick={() => setLeagueFilter("ALL")}
        >
          ทั้งหมด
        </button>

        {leagues.map((league) => (
          <button
            key={league}
            className={leagueFilter === league ? styles.active : ""}
            onClick={() => setLeagueFilter(league)}
          >
            {league}
          </button>
        ))}

        <input
          type="text"
          placeholder="ค้นหาทีม / ลีก / ทรรศนะ"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <a href="/admin-analysis">เพิ่มโพย</a>
      </section>

      {loading && (
        <section className={styles.noticeCard}>
          กำลังโหลดข้อมูลวิเคราะห์...
        </section>
      )}

      {error && <section className={styles.errorCard}>{error}</section>}

      {!loading && !error && filteredPicks.length === 0 && (
        <section className={styles.emptyCard}>
          <h2>ยังไม่มีรายการวิเคราะห์ของวันที่เลือก</h2>
          <p>
            ให้ไปที่หน้าเพิ่มโพย เลือกวันที่ โหลดคู่บอลจาก API แล้วบันทึกคู่ที่ต้องการวิเคราะห์
          </p>
          <a href="/admin-analysis">ไปหน้าเพิ่มโพย</a>
        </section>
      )}

      {!loading && !error && filteredPicks.length > 0 && (
        <section className={styles.compactTableCard}>
          <div className={styles.compactTableWrap}>
            <table className={styles.compactTable}>
              <thead>
                <tr>
                  <th>เวลา</th>
                  <th>ลีก</th>
                  <th>คู่แข่งขัน</th>
                  <th>ราคาแฮนดิแคป</th>
                  <th>ทีเด็ดแฮนดิแคป</th>
                  <th>%</th>
                  <th>สูง/ต่ำ</th>
                  <th>ทีเด็ดสูงต่ำ</th>
                  <th>%</th>
                  <th>สิทธิ์</th>
                  <th>ตัวเด่น</th>
                  <th>ทรรศนะ</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(groupedPicks).map(([leagueName, leaguePicks]) => (
                  <>
                    <tr key={`${leagueName}-header`} className={styles.groupRow}>
                      <td colSpan={12}>
                        {leagueName}{" "}
                        <span>{leaguePicks.length} คู่</span>
                      </td>
                    </tr>

                    {leaguePicks.map((pick) => (
                      <tr key={pick.id} className={styles.matchRow}>
                        <td className={styles.time}>{pick.time}</td>

                        <td>
                          <span className={styles.league}>{pick.league}</span>
                        </td>

                        <td className={styles.match}>
                          {pick.home} vs {pick.away}
                        </td>

                        <td>{pick.handicapLine}</td>

                        <td>
                          <span className={styles.pick}>{pick.handicapText}</span>
                        </td>

                        <td>
                          <span
                            className={`${styles.percent} ${percentClass(
                              pick.handicapPercent
                            )}`}
                          >
                            {pick.handicapPercent}%
                          </span>
                        </td>

                        <td>{pick.totalLine}</td>

                        <td>
                          <span className={styles.pick}>{pick.totalText}</span>
                        </td>

                        <td>
                          <span
                            className={`${styles.percent} ${percentClass(
                              pick.totalPercent
                            )}`}
                          >
                            {pick.totalPercent}%
                          </span>
                        </td>

                        <td>
                          <span className={styles.visibility}>
                            {visibilityText(pick.visibility)}
                          </span>
                        </td>

                        <td>
                          {pick.top ? (
                            <span className={styles.star}>แนะนำ</span>
                          ) : (
                            <span className={styles.normal}>ทั่วไป</span>
                          )}
                        </td>

                        <td className={styles.note}>
                          {pick.note || "-"}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <p className={styles.disclaimer}>
        รายการนี้แสดงเฉพาะคู่ที่แอดมินบันทึกใน Firestore collection analysisPicks
      </p>
    </main>
  );
}
