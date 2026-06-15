import styles from "./page.module.css";

type Pick = {
  time: string;
  league: string;
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

const picks: Pick[] = [
  {
    time: "23:00",
    league: "บอลโลก",
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

export default function TodayAnalysisPage() {
  const topHandicap = [...picks].sort(
    (a, b) => b.handicapPercent - a.handicapPercent
  )[0];

  const topTotal = [...picks].sort(
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
          <strong>{topHandicap.handicap}</strong>
          <p>{topHandicap.match}</p>
          <b>{topHandicap.handicapPercent}%</b>
        </div>

        <div className={styles.summaryCard}>
          <span>สูงต่ำเด่น</span>
          <strong>
            {topTotal.totalPick} {topTotal.total}
          </strong>
          <p>{topTotal.match}</p>
          <b>{topTotal.totalPercent}%</b>
        </div>

        <div className={styles.summaryCard}>
          <span>จำนวนคู่วันนี้</span>
          <strong>{picks.length} คู่</strong>
          <p>เฉพาะคู่ที่ผ่านการคัดแล้ว</p>
          <b>LIVE</b>
        </div>
      </section>

      <section className={styles.toolbar}>
        <button className={styles.active}>ทั้งหมด</button>
        <button>บอลโลก</button>
        <button>แฮนดิแคป</button>
        <button>สูงต่ำ</button>
        <button>65%+</button>
        <button>ตัวเด่น</button>
      </section>

      <section className={styles.tableCard}>
        <div className={styles.tableTitle}>
          <h2>ตารางวิเคราะห์</h2>
          <p>เน้นอ่านง่าย แยกแฮนดิแคปและสูงต่ำชัดเจน</p>
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
              {picks.map((pick, index) => (
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
