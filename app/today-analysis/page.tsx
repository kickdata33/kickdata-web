import styles from "./page.module.css";

type LeagueFilter =
  | "ALL"
  | "WORLD"
  | "ICELAND_BESTA"
  | "SWEDEN_SUPERETTAN"
  | "FINLAND_YKKOSLIIGA"
  | "ICELAND_D2"
  | "BRAZIL_SERIE_B";

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
  { label: "ไอซ์แลนด์", value: "ICELAND_BESTA" },
  { label: "สวีเดน", value: "SWEDEN_SUPERETTAN" },
  { label: "ฟินแลนด์", value: "FINLAND_YKKOSLIIGA" },
  { label: "ไอซ์แลนด์ D2", value: "ICELAND_D2" },
  { label: "บราซิล B", value: "BRAZIL_SERIE_B" },
];

const picks: Pick[] = [
  {
    time: "23:00",
    league: "บอลโลก 2026",
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
    league: "บอลโลก 2026",
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
    league: "บอลโลก 2026",
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
    league: "บอลโลก 2026",
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
    time: "01:00",
    league: "ไอซ์แลนด์ เบสต้า เดลิดิน",
    leagueKey: "ICELAND_BESTA",
    match: "อัคราเนส vs เฟรม เรย์จาวิค",
    handicap: "0 / 0.5",
    handicapPick: "เฟรม รอง",
    handicapPercent: 64,
    total: "3.0",
    totalPick: "สูง",
    totalPercent: 66,
    note: "บอลไอซ์แลนด์จังหวะเปิด มีโอกาสยิงกันหลายลูก",
    top: true,
  },
  {
    time: "00:00",
    league: "สวีเดน ซูเปอร์เร็ตเท่น",
    leagueKey: "SWEDEN_SUPERETTAN",
    match: "ซันด์สวาลล์ vs ออสเตอร์",
    handicap: "0 / 0.5",
    handicapPick: "ออสเตอร์ ต่อ",
    handicapPercent: 63,
    total: "2.5",
    totalPick: "ต่ำ",
    totalPercent: 61,
    note: "เกมสวีเดนลีกรองมักสูสี ต่อไม่แรงแต่ต้องระวังเสมอ",
  },
  {
    time: "00:05",
    league: "สวีเดน ซูเปอร์เร็ตเท่น",
    leagueKey: "SWEDEN_SUPERETTAN",
    match: "นอร์โคปิ้ง vs วาลเบิร์ก",
    handicap: "0 / 0.5",
    handicapPick: "นอร์โคปิ้ง ต่อ",
    handicapPercent: 65,
    total: "2.75",
    totalPick: "สูง",
    totalPercent: 67,
    note: "เกมมีโอกาสแลก นอร์โคปิ้งได้เปรียบในบ้าน",
    top: true,
  },
  {
    time: "22:30",
    league: "ฟินแลนด์ ยัคโคสลีก้า",
    leagueKey: "FINLAND_YKKOSLIIGA",
    match: "เอสเจเค อคาเดเมีย vs ยาโร",
    handicap: "0.5 / 1",
    handicapPick: "ยาโร ต่อ",
    handicapPercent: 66,
    total: "2.75",
    totalPick: "สูง",
    totalPercent: 64,
    note: "ยาโรคุณภาพเกมรุกดีกว่า แต่ราคาต่อค่อนข้างลึก",
    top: true,
  },
  {
    time: "02:15",
    league: "ไอซ์แลนด์ ดิวิชั่น 2",
    leagueKey: "ICELAND_D2",
    match: "ฟอลเนอร์ vs คาริ อัคราเนส",
    handicap: "0.5 / 1",
    handicapPick: "ฟอลเนอร์ ต่อ",
    handicapPercent: 62,
    total: "3.0",
    totalPick: "สูง",
    totalPercent: 69,
    note: "ลีกไอซ์แลนด์รองมีสกอร์สูงบ่อย สูงน่าสนใจกว่าต่อ",
  },
  {
    time: "02:15",
    league: "ไอซ์แลนด์ ดิวิชั่น 2",
    leagueKey: "ICELAND_D2",
    match: "โมลาลุนด์ vs ฮัวการ์",
    handicap: "0.5 / 1",
    handicapPick: "โมลาลุนด์ ต่อ",
    handicapPercent: 61,
    total: "3.0",
    totalPick: "สูง",
    totalPercent: 68,
    note: "เกมเปิด โอกาสมีประตูเยอะ",
  },
  {
    time: "07:00",
    league: "บราซิล ซีรี่ย์ B",
    leagueKey: "BRAZIL_SERIE_B",
    match: "คอริติบ้า vs ซิเอร่า",
    handicap: "0.5",
    handicapPick: "คอริติบ้า ต่อ",
    handicapPercent: 67,
    total: "2.25",
    totalPick: "ต่ำ",
    totalPercent: 65,
    note: "คอริติบ้าได้เปรียบในบ้าน แต่บราซิล B มักยิงไม่ขาด",
    top: true,
  },
  {
    time: "07:00",
    league: "บราซิล ซีรี่ย์ B",
    leagueKey: "BRAZIL_SERIE_B",
    match: "ลอนดริน่า vs อาไว",
    handicap: "0 / 0.5",
    handicapPick: "อาไว รอง",
    handicapPercent: 64,
    total: "2.0",
    totalPick: "ต่ำ",
    totalPercent: 67,
    note: "ทรงเกมสูสี อาไวมีลุ้นยันเสมอ",
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
          <p>เฉพาะคู่ที่มีวิเคราะห์</p>
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
          </p>
          <a href="/today-analysis?league=ALL">กลับไปดูทั้งหมด</a>
        </section>
      ) : (
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
                  <th>ตัวเด่น</th>
                  <th>ทรรศนะ</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(groupedPicks).map(([leagueName, leaguePicks]) => (
                  <>
                    <tr key={`${leagueName}-header`} className={styles.groupRow}>
                      <td colSpan={11}>{leagueName}</td>
                    </tr>

                    {leaguePicks.map((pick, index) => (
                      <tr key={`${leagueName}-${index}`} className={styles.matchRow}>
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
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <p className={styles.disclaimer}>
        ข้อมูลนี้เป็นบทวิเคราะห์เชิงสถิติและมุมมองประกอบการตัดสินใจ
        แสดงเฉพาะคู่ที่มีการวิเคราะห์จริงในวันนั้น
      </p>
    </main>
  );
}
