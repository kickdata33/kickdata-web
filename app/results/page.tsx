"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type ResultStatus = "win" | "lose" | "halfWin" | "halfLose" | "void";

type AnalysisResult = {
  id: number;
  date: string;
  league: string;
  match: string;
  pickType: "แฮนดิแคป" | "สูงต่ำ";
  pick: string;
  line: string;
  confidence: number;
  score: string;
  status: ResultStatus;
  note: string;
};

const results: AnalysisResult[] = [
  {
    id: 1,
    date: "2026-06-14",
    league: "บอลโลก",
    match: "Germany vs Curaçao",
    pickType: "แฮนดิแคป",
    pick: "Germany ต่อ",
    line: "-2.5 / -3",
    confidence: 78,
    score: "7-1",
    status: "win",
    note: "เยอรมันชนะขาด เข้าเต็ม",
  },
  {
    id: 2,
    date: "2026-06-14",
    league: "บอลโลก",
    match: "Germany vs Curaçao",
    pickType: "สูงต่ำ",
    pick: "สูง",
    line: "3.5",
    confidence: 70,
    score: "7-1",
    status: "win",
    note: "รวม 8 ประตู สูงเข้าเต็ม",
  },
  {
    id: 3,
    date: "2026-06-14",
    league: "บอลโลก",
    match: "Netherlands vs Japan",
    pickType: "แฮนดิแคป",
    pick: "Japan รอง",
    line: "+0.5 / +0.75",
    confidence: 63,
    score: "2-2",
    status: "win",
    note: "ญี่ปุ่นไม่แพ้ รองเข้าเต็ม",
  },
  {
    id: 4,
    date: "2026-06-14",
    league: "บอลโลก",
    match: "Netherlands vs Japan",
    pickType: "สูงต่ำ",
    pick: "ต่ำ",
    line: "2.75",
    confidence: 60,
    score: "2-2",
    status: "lose",
    note: "รวม 4 ประตู ต่ำเสีย",
  },
  {
    id: 5,
    date: "2026-06-15",
    league: "บอลโลก",
    match: "Spain vs Cape Verde",
    pickType: "แฮนดิแคป",
    pick: "Spain ต่อ",
    line: "-1.75",
    confidence: 77,
    score: "รอผล",
    status: "void",
    note: "รอสรุปผลหลังแข่ง",
  },
  {
    id: 6,
    date: "2026-06-15",
    league: "บอลโลก",
    match: "Iran vs New Zealand",
    pickType: "สูงต่ำ",
    pick: "ต่ำ",
    line: "2.25",
    confidence: 68,
    score: "รอผล",
    status: "void",
    note: "รอสรุปผลหลังแข่ง",
  },
];

function getStatusText(status: ResultStatus) {
  if (status === "win") return "เข้า";
  if (status === "lose") return "เสีย";
  if (status === "halfWin") return "ได้ครึ่ง";
  if (status === "halfLose") return "เสียครึ่ง";
  return "รอผล";
}

function getStatusClass(status: ResultStatus) {
  if (status === "win") return styles.win;
  if (status === "lose") return styles.lose;
  if (status === "halfWin") return styles.halfWin;
  if (status === "halfLose") return styles.halfLose;
  return styles.void;
}

function formatThaiDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export default function ResultsPage() {
  const [selectedDate, setSelectedDate] = useState<string>("ALL");

  const availableDates = useMemo(() => {
    return Array.from(new Set(results.map((item) => item.date))).sort(
      (a, b) => b.localeCompare(a)
    );
  }, []);

  const filteredResults = useMemo(() => {
    if (selectedDate === "ALL") return results;
    return results.filter((item) => item.date === selectedDate);
  }, [selectedDate]);

  const settledResults = filteredResults.filter((item) => item.status !== "void");

  const winCount = settledResults.filter((item) => item.status === "win").length;
  const loseCount = settledResults.filter((item) => item.status === "lose").length;
  const halfWinCount = settledResults.filter((item) => item.status === "halfWin").length;
  const halfLoseCount = settledResults.filter((item) => item.status === "halfLose").length;

  const handicapResults = settledResults.filter((item) => item.pickType === "แฮนดิแคป");
  const totalResults = settledResults.filter((item) => item.pickType === "สูงต่ำ");

  const handicapWins = handicapResults.filter(
    (item) => item.status === "win" || item.status === "halfWin"
  ).length;

  const totalWins = totalResults.filter(
    (item) => item.status === "win" || item.status === "halfWin"
  ).length;

  const winRate =
    settledResults.length > 0
      ? Math.round(((winCount + halfWinCount) / settledResults.length) * 100)
      : 0;

  const handicapRate =
    handicapResults.length > 0
      ? Math.round((handicapWins / handicapResults.length) * 100)
      : 0;

  const totalRate =
    totalResults.length > 0
      ? Math.round((totalWins / totalResults.length) * 100)
      : 0;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.brand}>KickData Results</p>
          <h1>ผลวิเคราะห์ย้อนหลัง</h1>
          <p className={styles.sub}>
            เลือกวันที่เพื่อดูผลโพยย้อนหลัง แฮนดิแคป / สูงต่ำ / % ความแม่นยำ
          </p>
        </div>

        <div className={styles.dateBox}>
          <span>สถิติของช่วงที่เลือก</span>
          <strong>{winRate}%</strong>
        </div>
      </header>

      <section className={styles.dateFilterCard}>
        <div>
          <h2>เลือกวันที่ย้อนหลัง</h2>
          <p>
            เลือกดูเฉพาะวัน หรือดูรวมทุกวันที่มีการบันทึกผลวิเคราะห์
          </p>
        </div>

        <div className={styles.dateControls}>
          <button
            className={selectedDate === "ALL" ? styles.dateActive : ""}
            onClick={() => setSelectedDate("ALL")}
          >
            ทั้งหมด
          </button>

          {availableDates.map((date) => (
            <button
              key={date}
              className={selectedDate === date ? styles.dateActive : ""}
              onClick={() => setSelectedDate(date)}
            >
              {formatThaiDate(date)}
            </button>
          ))}

          <input
            type="date"
            value={selectedDate === "ALL" ? "" : selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value || "ALL");
            }}
          />
        </div>
      </section>

      <section className={styles.summary}>
        <div className={styles.summaryCard}>
          <span>ทั้งหมดที่ตัดสินแล้ว</span>
          <strong>{settledResults.length}</strong>
          <p>รายการ</p>
        </div>

        <div className={styles.summaryCard}>
          <span>เข้า</span>
          <strong className={styles.greenText}>{winCount}</strong>
          <p>รายการ</p>
        </div>

        <div className={styles.summaryCard}>
          <span>เสีย</span>
          <strong className={styles.redText}>{loseCount}</strong>
          <p>รายการ</p>
        </div>

        <div className={styles.summaryCard}>
          <span>อัตราเข้า</span>
          <strong>{winRate}%</strong>
          <p>รวมทุกตลาด</p>
        </div>
      </section>

      <section className={styles.statGrid}>
        <div>
          <span>แฮนดิแคป</span>
          <strong>{handicapRate}%</strong>
          <p>
            เข้า {handicapWins} จาก {handicapResults.length}
          </p>
        </div>

        <div>
          <span>สูงต่ำ</span>
          <strong>{totalRate}%</strong>
          <p>
            เข้า {totalWins} จาก {totalResults.length}
          </p>
        </div>

        <div>
          <span>ได้ครึ่ง</span>
          <strong>{halfWinCount}</strong>
          <p>รายการ</p>
        </div>

        <div>
          <span>เสียครึ่ง</span>
          <strong>{halfLoseCount}</strong>
          <p>รายการ</p>
        </div>
      </section>

      <section className={styles.tableCard}>
        <div className={styles.tableTitle}>
          <h2>
            ตารางผลย้อนหลัง{" "}
            {selectedDate === "ALL" ? "ทั้งหมด" : formatThaiDate(selectedDate)}
          </h2>
          <p>บันทึกผลจากโพยที่วิเคราะห์ไว้</p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>วันที่</th>
                <th>ลีก</th>
                <th>คู่แข่งขัน</th>
                <th>ประเภท</th>
                <th>ทีเด็ด</th>
                <th>ราคา</th>
                <th>%</th>
                <th>ผลจริง</th>
                <th>ผลราคา</th>
                <th>หมายเหตุ</th>
              </tr>
            </thead>

            <tbody>
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={10} className={styles.emptyCell}>
                    ไม่พบข้อมูลผลวิเคราะห์ของวันที่เลือก
                  </td>
                </tr>
              ) : (
                filteredResults.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.date}>{formatThaiDate(item.date)}</td>

                    <td>
                      <span className={styles.league}>{item.league}</span>
                    </td>

                    <td className={styles.match}>{item.match}</td>

                    <td>
                      <span className={styles.type}>{item.pickType}</span>
                    </td>

                    <td className={styles.pick}>{item.pick}</td>

                    <td>{item.line}</td>

                    <td>
                      <span className={styles.percent}>{item.confidence}%</span>
                    </td>

                    <td className={styles.score}>{item.score}</td>

                    <td>
                      <span className={`${styles.status} ${getStatusClass(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </td>

                    <td className={styles.note}>{item.note}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className={styles.disclaimer}>
        หน้านี้ใช้สำหรับบันทึกผลวิเคราะห์ย้อนหลัง เพื่อวัดความแม่นยำของโพยแต่ละวัน
      </p>
    </main>
  );
}
