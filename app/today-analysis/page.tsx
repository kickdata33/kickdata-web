import styles from "./page.module.css";

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

type Pick = {
  time: string;
  league: string;
  leagueKey: LeagueFilter;
  match: string;
  handicap: string;
  handicapPick: string;
  handicapPercent: number;
  total: string;
  totalPick: string;
  totalPercent: number;
  note: string;
  top?: boolean;
};

const leagueFilters: { label: string; value: LeagueFilter }[] = [
  { label: "ทั้งหมด", value: "ALL" },
  { label: "บอลโลก", value: "WORLD" },
  { label: "พรีเมียร์ลีก", value: "EPL" },
  { label: "ลาลีกา", value: "LALIGA" },
  { label: "เซเรียอา", value: "SERIEA" },
  { label: "บุนเดสลีกา", value: "BUNDESLIGA" },
  { label: "ลีกเอิง", value: "LIGUE1" },
  { label: "UCL", value: "UCL" },
  { label: "ไทยลีก", value: "THAI" },
  { label: "เจลีก", value: "JLEAGUE" },
  { label: "เคลีก", value: "KLEAGUE" },
  { label: "MLS", value: "MLS" },
];

const picks: Pick[] = [
  {
    time: "23:00",
    league: "บอลโลก",
    leagueKey: "WORLD",
    match: "Spain vs Cape Verde",
    handicap: "Spain -1.75",
    handicapPick: "Spain ต่อ",
    handicapPercent: 77,
    total: "2.75",
    totalPick: "สูง",
    totalPercent: 68,
    note: "สเปนเหนือกว่าชัด ถ้าไลน์ไม่เกิน -1.75 ยังน่าเล่น",
    top: true,
  },
  {
    time: "02:00",
    league: "บอลโลก",
    leagueKey: "WORLD",
    match: "Belgium vs Egypt",
    handicap: "Belgium -0.75",
    handicapPick: "Belgium ต่อ",
    handicapPercent: 65,
    total: "2.75",
    totalPick: "ต่ำ",
    totalPercent: 62,
    note: "เบลเยียมดีกว่า แต่ Egypt มีเกมสวนกลับ",
  },
  {
    time: "05:00",
    league: "บอลโลก",
    leagueKey: "WORLD",
    match: "Saudi Arabia vs Uruguay",
    handicap: "Uruguay -1",
    handicapPick: "Uruguay ต่อ",
    handicapPercent: 69,
    total: "2.75",
    totalPick: "ต่ำ",
    totalPercent: 66,
    note: "อุรุกวัยคุณภาพดีกว่า แต่ซาอุฯ อาจเน้นรับแน่น",
    top: true,
  },
  {
    time: "08:00",
    league: "บอลโลก",
    leagueKey: "WORLD",
    match: "Iran vs New Zealand",
    handicap: "Iran -0.5",
    handicapPick: "Iran ต่อ",
    handicapPercent: 67,
    total: "2.25",
    totalPick: "ต่ำ",
    totalPercent: 68,
    note: "เกมมีโอกาสอึดอัด ยิงไม่เยอะ",
    top: true,
  },

  {
    time: "18:00",
    league: "เจลีก",
    leagueKey: "JLEAGUE",
    match: "Kawasaki Frontale vs Yokohama F. Marinos",
    handicap: "Kawasaki -0.25",
    handicapPick: "Kawasaki ต่อ",
    handicapPercent: 64,
    total: "2.75",
    totalPick: "สูง",
    totalPercent: 66,
    note: "บอลญี่ปุ่นจังหวะเร็ว มีโอกาสเปิดแลก",
  },
  {
    time: "18:30",
    league: "เคลีก",
    leagueKey: "KLEAGUE",
    match: "Ulsan HD vs Jeonbuk Hyundai",
    handicap: "Ulsan -0.25",
    handicapPick: "Ulsan ต่อ",
    handicapPercent: 63,
    total: "2.5",
    totalPick: "ต่ำ",
    totalPercent: 61,
    note: "เกมใหญ่เกาหลีมักรัดกุม โอกาสเฉือนมากกว่ายิงขาด",
  },
  {
    time: "19:00",
    league: "ไทยลีก",
    leagueKey: "THAI",
    match: "Buriram United vs BG Pathum United",
    handicap: "Buriram -0.75",
    handicapPick: "Buriram ต่อ",
    handicapPercent: 68,
    total: "2.75",
    totalPick: "สูง",
    totalPercent: 64,
    note: "บุรีรัมย์ในบ้านแข็ง เกมรุกมีความต่อเนื่อง",
    top: true,
  },
  {
    time: "21:00",
    league: "พรีเมียร์ลีก",
    leagueKey: "EPL",
    match: "Arsenal vs West Ham",
    handicap: "Arsenal -1.25",
    handicapPick: "Arsenal ต่อ",
    handicapPercent: 70,
    total: "2.75",
    totalPick: "สูง",
    totalPercent: 65,
    note: "อาร์เซนอลครองเกมเหนือกว่า ถ้ายิงไวมีโอกาสขาด",
    top: true,
  },
  {
    time: "21:00",
    league: "พรีเมียร์ลีก",
    leagueKey: "EPL",
    match: "Brighton vs Brentford",
    handicap: "Brighton -0.5",
    handicapPick: "Brighton ต่อ",
    handicapPercent: 66,
    total: "3.0",
    totalPick: "สูง",
    totalPercent: 67,
    note: "ไบรท์ตันเล่นเปิด เกมมีโอกาสแลกกันสูง",
  },
  {
    time: "23:30",
    league: "ลาลีกา",
    leagueKey: "LALIGA",
    match: "Real Sociedad vs Villarreal",
    handicap: "Real Sociedad -0.25",
    handicapPick: "Sociedad ต่อ",
    handicapPercent: 62,
    total: "2.25",
    totalPick: "ต่ำ",
    totalPercent: 66,
    note: "คู่นี้ทรงสูสี จังหวะเข้าทำไม่เยอะ ต่ำดูดีกว่า",
  },
  {
    time: "00:00",
    league: "เซเรียอา",
    leagueKey: "SERIEA",
    match: "Roma vs Fiorentina",
    handicap: "Roma -0.5",
    handicapPick: "Roma ต่อ",
    handicapPercent: 65,
    total: "2.25",
    totalPick: "ต่ำ",
    totalPercent: 64,
    note: "โรม่ามีภาษีในบ้าน แต่เกมอาจออกแนวชิงจังหวะ",
  },
  {
    time: "01:30",
    league: "บุนเดสลีกา",
    leagueKey: "BUNDESLIGA",
    match: "Leverkusen vs Stuttgart",
    handicap: "Leverkusen -0.75",
    handicapPick: "Leverkusen ต่อ",
    handicapPercent: 69,
    total: "3.0",
    totalPick: "สูง",
    totalPercent: 70,
    note: "เกมรุกทั้งสองทีมดี สูงน่าสนใจมาก",
    top: true,
  },
  {
    time: "02:00",
    league: "ลีกเอิง",
    leagueKey: "LIGUE1",
    match: "Lyon vs Rennes",
    handicap: "Lyon -0.25",
    handicapPick: "Lyon ต่อ",
    handicapPercent: 61,
    total: "2.5",
    totalPick: "สูง",
    totalPercent: 63,
    note: "ลียงได้เปรียบในบ้าน แต่ราคายังเสี่ยง",
  },
  {
    time: "02:00",
    league: "UCL",
    leagueKey: "UCL",
    match: "PSG vs Atletico Madrid",
    handicap: "PSG -0.5",
    handicapPick: "PSG ต่อ",
    handicapPercent: 67,
    total: "2.5",
    totalPick: "ต่ำ",
    totalPercent: 62,
    note: "PSG เหนือกว่า แต่แอตฯ เล่นเกมรับเหนียว",
  },
  {
    time: "06:30",
    league: "MLS",
    leagueKey: "MLS",
    match: "Inter Miami vs Atlanta United",
    handicap: "Inter Miami -0.75",
    handicapPick: "Inter Miami ต่อ",
    handicapPercent: 66,
    total: "3.25",
    totalPick: "สูง",
    totalPercent: 71,
    note: "MLS เกมเปิด พื้นที่เยอะ สูงน่าสนใจ",
    top: true,
  },
];

function percentClass(percent: number) {
  if (percent >= 70) return styles.percentHigh;
  if (percent >= 65) return styles.percentMedium;
  return styles.percentLow;
}

export default function TodayAnalysisPage({
  searchParams,
}: {
  searchParams?: { league?: LeagueFilter };
}) {
  const selectedLeague = searchParams?.league || "ALL";

  const filteredPicks =
    selectedLeague === "ALL"
      ? picks
      : picks.filter((pick) => pick.leagueKey === selectedLeague);

  const topHandicap = [...filteredPicks].sort(
    (a, b) => b.handicapPercent - a.handicapPercent
  )[0];

  const topTotal = [...filteredPicks].sort(
    (a, b) => b.totalPercent - a.totalPercent
  )[0];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.brand}>KickData</p>
          <h1>วิเคราะห์บอลวันนี้</h1>
          <p className={styles.sub}>
            ตารางวิเคราะห์แฮนดิแคปและสูงต่ำ พร้อม % ความมั่นใจ
          </p>
        </div>

        <div className={styles.dateBox}>
          <span>อัปเดตล่าสุด</span>
          <strong>วันนี้</strong>
        </div>
      </header>

      <section className={styles.summary}>
        <div className={styles.summaryCard}>
          <span>แฮนดิแคปเด่น</span>
          <strong>{topHandicap?.handicap || "-"}</strong>
          <p>{topHandicap?.match || "ไม่มีข้อมูล"}</p>
          <b>{topHandicap ? `${topHandicap.handicapPercent}%` : "-"}</b>
        </div>

        <div className={styles.summaryCard}>
          <span>สูงต่ำเด่น</span>
          <strong>
            {topTotal ? `${topTotal.totalPick} ${topTotal.total}` : "-"}
          </strong>
          <p>{topTotal?.match || "ไม่มีข้อมูล"}</p>
          <b>{topTotal ? `${topTotal.totalPercent}%` : "-"}</b>
        </div>

        <div className={styles.summaryCard}>
          <span>จำนวนคู่วันนี้</span>
          <strong>{filteredPicks.length} คู่</strong>
          <p>เฉพาะคู่ที่ผ่านการคัดแล้ว</p>
          <b>LIVE</b>
        </div>
      </section>

      <section className={styles.toolbar}>
        {leagueFilters.map((item) => (
          <a
            key={item.value}
            href={`/today-analysis?league=${item.value}`}
            className={selectedLeague === item.value ? styles.active : ""}
          >
            {item.label}
          </a>
        ))}
      </section>

      <section className={styles.tableCard}>
        <div className={styles.tableTitle}>
          <h2>ตารางวิเคราะห์</h2>
          <p>รวมลีกหลัก ไม่จำกัดเฉพาะบอลโลก</p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>เวลา</th>
                <th>ลีก</th>
                <th>คู่แข่งขัน</th>
                <th>ราคาแฮนดิแคป</th>
                <th>เลือก</th>
                <th>%</th>
                <th>สูง/ต่ำ</th>
                <th>เลือก</th>
                <th>%</th>
                <th>ตัวเด่น</th>
                <th>หมายเหตุ</th>
              </tr>
            </thead>

            <tbody>
              {filteredPicks.map((pick, index) => (
                <tr key={index}>
                  <td className={styles.time}>{pick.time}</td>

                  <td>
                    <span className={styles.league}>{pick.league}</span>
                  </td>

                  <td className={styles.match}>{pick.match}</td>

                  <td>{pick.handicap}</td>

                  <td>
                    <span className={styles.pick}>{pick.handicapPick}</span>
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

                  <td>{pick.total}</td>

                  <td>
                    <span className={styles.pick}>{pick.totalPick}</span>
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
                    {pick.top ? (
                      <span className={styles.star}>แนะนำ</span>
                    ) : (
                      <span className={styles.normal}>ทั่วไป</span>
                    )}
                  </td>

                  <td className={styles.note}>{pick.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className={styles.disclaimer}>
        ข้อมูลนี้เป็นบทวิเคราะห์เชิงสถิติและมุมมองประกอบการตัดสินใจ ไม่รับประกันผลการแข่งขัน
      </p>
    </main>
  );
}
