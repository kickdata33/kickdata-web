"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Match = {
  id: number;
  date: string;
  time: string;
  league: string;
  country: string;
  leagueLogo: string;
  home: string;
  away: string;
  homeLogo: string;
  awayLogo: string;
  homeGoals: number | null;
  awayGoals: number | null;
  statusShort: string;
  statusLong: string;
  elapsed: number | null;
};

function getTodayBangkok() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getStatusText(match: Match) {
  if (match.statusShort === "NS") return "ยังไม่แข่ง";
  if (match.statusShort === "FT") return "จบเกม";
  if (match.statusShort === "HT") return "พักครึ่ง";
  if (["1H", "2H", "ET", "BT", "P"].includes(match.statusShort)) {
    return match.elapsed ? `สด ${match.elapsed}'` : "กำลังแข่ง";
  }
  if (["PST", "CANC", "ABD"].includes(match.statusShort)) return match.statusLong;
  return match.statusLong || match.statusShort;
}

function getStatusClass(match: Match) {
  if (match.statusShort === "FT") return styles.finished;
  if (["1H", "2H", "HT", "ET", "BT", "P"].includes(match.statusShort)) {
    return styles.live;
  }
  if (match.statusShort === "NS") return styles.upcoming;
  return styles.other;
}

export default function ScoresPage() {
  const [date, setDate] = useState(getTodayBangkok());
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [error, setError] = useState("");

  async function loadScores(selectedDate = date) {
    try {
      setError("");
      const res = await fetch(`/api/scores?date=${selectedDate}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "โหลดผลบอลไม่สำเร็จ");
        setMatches([]);
        return;
      }

      setMatches(data.matches || []);
      setUpdatedAt(data.updatedAt);
    } catch {
      setError("ไม่สามารถเชื่อมต่อข้อมูลผลบอลได้");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadScores(date);

    const timer = setInterval(() => {
      loadScores(date);
    }, 60000);

    return () => clearInterval(timer);
  }, [date]);

  const groupedMatches = useMemo(() => {
    return matches.reduce<Record<string, Match[]>>((acc, match) => {
      const key = `${match.country} - ${match.league}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(match);
      return acc;
    }, {});
  }, [matches]);

  const liveCount = matches.filter((m) =>
    ["1H", "2H", "HT", "ET", "BT", "P"].includes(m.statusShort)
  ).length;

  const finishedCount = matches.filter((m) => m.statusShort === "FT").length;
  const upcomingCount = matches.filter((m) => m.statusShort === "NS").length;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.brand}>KickData Scores</p>
          <h1>ผลบอลวันนี้</h1>
          <p className={styles.sub}>
            ผลบอลสดทุกลีก อัปเดตอัตโนมัติทุก 60 วินาที
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
        <div>
          <span>ทั้งหมด</span>
          <strong>{matches.length}</strong>
          <p>คู่</p>
        </div>
        <div>
          <span>กำลังแข่ง</span>
          <strong className={styles.liveText}>{liveCount}</strong>
          <p>คู่</p>
        </div>
        <div>
          <span>จบแล้ว</span>
          <strong>{finishedCount}</strong>
          <p>คู่</p>
        </div>
        <div>
          <span>ยังไม่แข่ง</span>
          <strong>{upcomingCount}</strong>
          <p>คู่</p>
        </div>
      </section>

      <section className={styles.toolbar}>
        <a href="/today-analysis">วิเคราะห์บอล</a>
        <a className={styles.active} href="/scores">ผลบอล</a>
        <span>
          อัปเดตล่าสุด:{" "}
          {updatedAt
            ? new Date(updatedAt).toLocaleTimeString("th-TH", {
                timeZone: "Asia/Bangkok",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "-"}
        </span>
      </section>

      {loading && <div className={styles.notice}>กำลังโหลดผลบอล...</div>}

      {error && <div className={styles.error}>{error}</div>}

      {!loading && !error && matches.length === 0 && (
        <div className={styles.notice}>ไม่พบโปรแกรม/ผลบอลในวันที่เลือก</div>
      )}

      <section className={styles.scoreList}>
        {Object.entries(groupedMatches).map(([leagueName, leagueMatches]) => (
          <div className={styles.leagueCard} key={leagueName}>
            <div className={styles.leagueHeader}>
              <h2>{leagueName}</h2>
              <span>{leagueMatches.length} คู่</span>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>เวลา</th>
                    <th>สถานะ</th>
                    <th>ทีมเหย้า</th>
                    <th>สกอร์</th>
                    <th>ทีมเยือน</th>
                  </tr>
                </thead>

                <tbody>
                  {leagueMatches.map((match) => (
                    <tr key={match.id}>
                      <td className={styles.time}>{match.time}</td>

                      <td>
                        <span className={`${styles.status} ${getStatusClass(match)}`}>
                          {getStatusText(match)}
                        </span>
                      </td>

                      <td>
                        <div className={styles.team}>
                          {match.homeLogo && (
                            <img src={match.homeLogo} alt={match.home} />
                          )}
                          <span>{match.home}</span>
                        </div>
                      </td>

                      <td className={styles.score}>
                        {match.homeGoals === null || match.awayGoals === null
                          ? "-"
                          : `${match.homeGoals} - ${match.awayGoals}`}
                      </td>

                      <td>
                        <div className={styles.team}>
                          {match.awayLogo && (
                            <img src={match.awayLogo} alt={match.away} />
                          )}
                          <span>{match.away}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      <p className={styles.disclaimer}>
        ข้อมูลผลบอลดึงจาก API-Football และอัปเดตตามรอบข้อมูลของผู้ให้บริการ
      </p>
    </main>
  );
}
