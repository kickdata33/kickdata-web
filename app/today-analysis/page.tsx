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

/**
 * สำคัญ:
 * ใส่เฉพาะคู่ที่มีเตะจริงและมีการวิเคราะห์จริงในวันนั้นเท่านั้น
 * ห้ามใส่ลีก/คู่บอลตัวอย่าง เพราะจะทำให้ข้อมูลเว็บไม่น่าเชื่อถือ
 */
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
];

function percentClass(percent: number) {
  if (percent >= 70) return styles.percentHigh;
  if (percent >= 65) return styles.percentMedium;
  return styles.percentLow;
}

function groupByLeague(items: Pick[]) {
  return items.reduce<Record<string, Pick[]>>((acc, item) => {
    if (!acc[item.league]) acc[item.league] = [];
    acc[item.league].push(item);
    return acc;
  }, {});
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

  const groupedPicks = groupByLeague(filteredPicks);

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
          <p>{topHandicap?.match || "ไม่มีข้อมูลวิเคราะห์"}</p>
          <b>{topHandicap ? `${topHandicap.handicapPercent}%` : "-"}</b>
        </div>

        <div className={styles.summaryCard}>
          <span>สูงต่ำเด่น</span>
          <strong>
            {topTotal ? `${topTotal.totalPick} ${topTotal.total}` : "-"}
          </strong>
          <p>{topTotal?.match || "ไม่มีข้อมูลวิเคราะห์"}</p>
          <b>{topTotal ? `${topTotal.totalPercent}%` : "-"}</b>
        </div>

        <div className={styles.summaryCard}>
          <span>จำนวนคู่วันนี้</span>
          <strong>{filteredPicks.length} คู่</strong>
          <p>เฉพาะคู่ที่มีวิเคราะห์จริง</p>
          <b>VERIFIED</b>
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

      {filteredPicks.length === 0 ? (
        <section className={styles.emptyCard}>
          <h2>ยังไม่มีข้อมูลวิเคราะห์ของลีกนี้ในวันนี้</h2>
          <p>
            ระบบจะแสดงเฉพาะลีกที่มีคู่แข่งขันจริงและมีการวิเคราะห์แล้วเท่านั้น
            เพื่อป้องกันข้อมูลผิดพลาด
          </p>
          <a href="/today-analysis?league=ALL">กลับไปดูทั้งหมด</a>
        </section>
      ) : (
        <section className={styles.leagueGroups}>
          {Object.entries(groupedPicks).map(([leagueName, leaguePicks]) => (
            <div className={styles.tableCard} key={leagueName}>
              <div className={styles.leagueTitle}>
                <div>
                  <h2>{leagueName}</h2>
                  <p>{leaguePicks.length} คู่ที่มีวิเคราะห์วันนี้</p>
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>เวลา</th>
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
                    {leaguePicks.map((pick, index) => (
                      <tr key={index}>
                        <td className={styles.time}>{pick.time}</td>

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
            </div>
          ))}
        </section>
      )}

      <p className={styles.disclaimer}>
        ข้อมูลนี้เป็นบทวิเคราะห์เชิงสถิติและมุมมองประกอบการตัดสินใจ
        แสดงเฉพาะคู่ที่มีการวิเคราะห์จริงในวันนั้น
      </p>
    </main>
  );
}
