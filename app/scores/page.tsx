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

type StatusFilter = "ALL" | "LIVE" | "FT" | "NS";

type LeagueFilter =
  | "ALL"
  | "WORLD"
  | "EPL"
  | "LALIGA"
  | "SERIEA"
  | "BUNDESLIGA"
  | "LIGUE1"
  | "UCL"
  | "THAI"
  | "JLEAGUE"
  | "KLEAGUE"
  | "MLS";

const leagueFilters: { label: string; value: LeagueFilter; keywords: string[] }[] = [
  { label: "ทั้งหมด", value: "ALL", keywords: [] },
  { label: "บอลโลก", value: "WORLD", keywords: ["world cup", "fifa"] },
  { label: "พรีเมียร์ลีก", value: "EPL", keywords: ["premier league", "england"] },
  { label: "ลาลีกา", value: "LALIGA", keywords: ["la liga", "spain"] },
  { label: "เซเรียอา", value: "SERIEA", keywords: ["serie a", "italy"] },
  { label: "บุนเดสลีกา", value: "BUNDESLIGA", keywords: ["bundesliga", "germany"] },
  { label: "ลีกเอิง", value: "LIGUE1", keywords: ["ligue 1", "france"] },
  { label: "UCL", value: "UCL", keywords: ["champions league"] },
  { label: "ไทยลีก", value: "THAI", keywords: ["thai league", "thailand"] },
  { label: "เจลีก", value: "JLEAGUE", keywords: ["j1 league", "j-league", "japan"] },
  { label: "เคลีก", value: "KLEAGUE", keywords: ["k league", "korea"] },
  { label: "MLS", value: "MLS", keywords: ["major league soccer", "mls", "usa"] },
];

function formatDateBangkok(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getStatusText(match: Match) {
  if (match.statusShort === "NS") return "ยังไม่แข่ง";
  if (match.statusShort === "FT") return "จบเกม";
  if (match.statusShort === "HT") return "พักครึ่ง";
  if (["1H", "2H", "ET", "BT", "P"].includes(match.statusShort)) {
    return match.elapsed ? `สด ${match.elapsed}'` : "กำลังแข่ง";
  }
  if (match.statusShort === "PST") return "เลื่อนแข่ง";
  if (match.statusShort === "CANC") return "ยกเลิก";
  if (match.statusShort === "ABD") return "ยุติการแข่งขัน";
  return match.statusLong || match.statusShort;
}

function isLive(match: Match) {
  return ["1H", "2H", "HT", "ET", "BT", "P"].includes(match.statusShort);
}

function getStatusClass(match: Match) {
  if (match.statusShort === "FT") return styles.finished;
  if (isLive(match)) return styles.live;
  if (match.statusShort === "NS") return styles.upcoming;
  return styles.other;
}

function scoreText(match: Match) {
  if (match.homeGoals === null || match.awayGoals === null) return "-";
  return `${match.homeGoals} - ${match.awayGoals}`;
}

export default function ScoresPage() {
  const [date, setDate] = useState(formatDateBangkok());
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState("");
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [leagueFilter, setLeagueFilter] = useState<LeagueFilter>("ALL");
  const [search, setSearch] = useState("");

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
      setUpdatedAt(data.updatedAt || "");
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

  const filteredMatches = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const selectedLeague = leagueFilters.find((item) => item.value === leagueFilter);

    return matches.filter((match) => {
      const statusOk =
        statusFilter === "ALL" ||
        (statusFilter === "LIVE" && isLive(match)) ||
        (statusFilter === "FT" && match.statusShort === "FT") ||
        (statusFilter === "NS" && match.statusShort === "NS");

      const leagueText = `${match.league} ${match.country}`.toLowerCase();

      const leagueOk =
        leagueFilter === "ALL" ||
        selectedLeague?.keywords.some((word) => leagueText.includes(word));

      const searchOk =
        !keyword ||
        match.home.toLowerCase().includes(keyword) ||
        match.away.toLowerCase().includes(keyword) ||
        match.league.toLowerCase().includes(keyword) ||
        match.country.toLowerCase().includes(keyword);

      return statusOk && leagueOk && searchOk;
    });
  }, [matches, statusFilter, leagueFilter, search]);

  const groupedMatches = useMemo(() => {
    return filteredMatches.reduce<Record<string, Match[]>>((acc, match) => {
      const key = `${match.country} - ${match.league}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(match);
      return acc;
    }, {});
  }, [filteredMatches]);

  const liveMatches = matches.filter(isLive);
  const liveCount = liveMatches.length;
  const finishedCount = matches.filter((m) => m.statusShort === "FT").length;
  const upcomingCount = matches.filter((m) => m.statusShort === "NS").length;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.brand}>KickData Scores</p>
          <h1>ผลบอลวันนี้</h1>
          <p className={styles.sub}>
            ผลบอลสดทุกลีก ค้นหาได้ กรองสถานะได้ อัปเดตทุก 60 วินาที
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

      <section className={styles.quickDates}>
        <button onClick={() => setDate(formatDateBangkok(-1))}>เมื่อวาน</button>
        <button className={styles.quickActive} onClick={() => setDate(formatDateBangkok(0))}>
          วันนี้
        </button>
        <button onClick={() => setDate(formatDateBangkok(1))}>พรุ่งนี้</button>
      </section>

      <section className={styles.summary}>
        <button
          className={statusFilter === "ALL" ? styles.summaryActive : ""}
          onClick={() => setStatusFilter("ALL")}
        >
          <span>ทั้งหมด</span>
          <strong>{matches.length}</strong>
          <p>คู่</p>
        </button>

        <button
          className={statusFilter === "LIVE" ? styles.summaryActive : ""}
          onClick={() => setStatusFilter("LIVE")}
        >
          <span>กำลังแข่ง</span>
          <strong className={styles.liveText}>{liveCount}</strong>
          <p>คู่</p>
        </button>

        <button
          className={statusFilter === "FT" ? styles.summaryActive : ""}
          onClick={() => setStatusFilter("FT")}
        >
          <span>จบแล้ว</span>
          <strong>{finishedCount}</strong>
          <p>คู่</p>
        </button>

        <button
          className={statusFilter === "NS" ? styles.summaryActive : ""}
          onClick={() => setStatusFilter("NS")}
        >
          <span>ยังไม่แข่ง</span>
          <strong>{upcomingCount}</strong>
          <p>คู่</p>
        </button>
      </section>

      <section className={styles.leagueFilters}>
        {leagueFilters.map((item) => (
          <button
            key={item.value}
            className={leagueFilter === item.value ? styles.leagueActive : ""}
            onClick={() => setLeagueFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </section>

      <section className={styles.toolbar}>
        <div className={styles.navLinks}>
          <a href="/today-analysis">วิเคราะห์บอล</a>
          <a className={styles.active} href="/scores">ผลบอล</a>
        </div>

        <input
          className={styles.search}
          type="text"
          placeholder="ค้นหาทีม / ลีก / ประเทศ"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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

      {liveMatches.length > 0 && (
        <section className={styles.livePanel}>
          <div className={styles.livePanelHeader}>
            <h2>🔴 กำลังแข่งตอนนี้</h2>
            <span>{liveMatches.length} คู่</span>
          </div>

          <div className={styles.liveGrid}>
            {liveMatches.slice(0, 6).map((match) => (
              <div className={styles.liveCard} key={match.id}>
                <div className={styles.liveLeague}>{match.league}</div>
                <div className={styles.liveTeams}>
                  <span>{match.home}</span>
                  <strong>{scoreText(match)}</strong>
                  <span>{match.away}</span>
                </div>
                <div className={styles.liveMinute}>{getStatusText(match)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {loading && <div className={styles.notice}>กำลังโหลดผลบอล...</div>}

      {error && <div className={styles.error}>{error}</div>}

      {!loading && !error && filteredMatches.length === 0 && (
        <div className={styles.notice}>ไม่พบข้อมูลตามเงื่อนไขที่เลือก</div>
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
                          {match.homeLogo && <img src={match.homeLogo} alt={match.home} />}
                          <span>{match.home}</span>
                        </div>
                      </td>

                      <td className={styles.score}>{scoreText(match)}</td>

                      <td>
                        <div className={styles.team}>
                          {match.awayLogo && <img src={match.awayLogo} alt={match.away} />}
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
