"use client";

import { useMemo, useState } from "react";

type MatchStatus = "รอวิเคราะห์" | "เผยแพร่แล้ว" | "พรีเมียม";

type AdminMatch = {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  status: MatchStatus;
  homePrice: string;
  drawPrice: string;
  awayPrice: string;
  handicap: string;
  overUnder: string;
  homePercent: string;
  drawPercent: string;
  awayPercent: string;
  teamNews: string;
  expectedLineup: string;
  broadcastChannel: string;
  officialBroadcastLink: string;
  preMatchSummary: string;
};

const initialMatches: AdminMatch[] = [
  {
    id: "match-001",
    league: "พรีเมียร์ลีก",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    kickoff: "2026-05-27T20:30",
    status: "พรีเมียม",
    homePrice: "1.82",
    drawPrice: "3.75",
    awayPrice: "4.20",
    handicap: "Arsenal -0.5",
    overUnder: "2.75",
    homePercent: "58",
    drawPercent: "24",
    awayPercent: "18",
    teamNews: "Arsenal มีแกนหลักพร้อมลงสนาม ขณะที่ Chelsea ต้องติดตามแนวรับก่อนเริ่มเกม",
    expectedLineup: "Arsenal: Raya, White, Saliba, Gabriel, Zinchenko, Rice, Odegaard, Havertz",
    broadcastChannel: "beIN SPORTS 1",
    officialBroadcastLink: "https://example.com/arsenal-chelsea",
    preMatchSummary:
      "Arsenal มีความต่อเนื่องในการสร้างโอกาสและสถิติในบ้านเด่นกว่า ขณะที่ Chelsea ยังมีจุดที่ต้องติดตามในเกมรับ",
  },
  {
    id: "match-002",
    league: "กัลโช่ เซเรีย อา",
    homeTeam: "Inter",
    awayTeam: "Atalanta",
    kickoff: "2026-05-27T23:00",
    status: "เผยแพร่แล้ว",
    homePrice: "1.95",
    drawPrice: "3.60",
    awayPrice: "3.90",
    handicap: "Inter -0.25",
    overUnder: "2.50",
    homePercent: "51",
    drawPercent: "27",
    awayPercent: "22",
    teamNews: "Inter มีสภาพทีมค่อนข้างสมบูรณ์ ส่วน Atalanta ต้องติดตามความพร้อมของตัวรุกริมเส้น",
    expectedLineup: "Inter: Sommer, Pavard, Acerbi, Bastoni, Barella, Calhanoglu, Mkhitaryan",
    broadcastChannel: "ทรู พรีเมียร์ ฟุตบอล 3",
    officialBroadcastLink: "https://example.com/inter-atalanta",
    preMatchSummary:
      "Inter ดูมีความนิ่งในการควบคุมพื้นที่แดนกลางมากกว่า และมีแนวโน้มคุมจังหวะเกมได้ดีกว่า",
  },
  {
    id: "match-003",
    league: "ลีกเอิง",
    homeTeam: "PSG",
    awayTeam: "Lille",
    kickoff: "2026-05-28T01:45",
    status: "รอวิเคราะห์",
    homePrice: "1.56",
    drawPrice: "4.40",
    awayPrice: "5.50",
    handicap: "PSG -1.0",
    overUnder: "3.25",
    homePercent: "63",
    drawPercent: "21",
    awayPercent: "16",
    teamNews: "PSG มีตัวรุกหลักพร้อมหลายราย ขณะที่ Lille มีแนวโน้มจัดชุดสมดุลเน้นรับและสวนกลับ",
    expectedLineup: "PSG: Donnarumma, Hakimi, Marquinhos, Skriniar, Mendes, Vitinha, Dembele",
    broadcastChannel: "beIN SPORTS 3",
    officialBroadcastLink: "https://example.com/psg-lille",
    preMatchSummary:
      "คู่นี้มีแนวโน้มเป็นเกมที่จังหวะเปิดและมีข้อมูลด้าน xG ที่น่าติดตาม โดยเฉพาะช่วงต้นเกมและครึ่งหลัง",
  },
];

const emptyForm: AdminMatch = {
  id: "",
  league: "",
  homeTeam: "",
  awayTeam: "",
  kickoff: "",
  status: "รอวิเคราะห์",
  homePrice: "",
  drawPrice: "",
  awayPrice: "",
  handicap: "",
  overUnder: "",
  homePercent: "",
  drawPercent: "",
  awayPercent: "",
  teamNews: "",
  expectedLineup: "",
  broadcastChannel: "",
  officialBroadcastLink: "",
  preMatchSummary: "",
};

function formatKickoff(value: string) {
  if (!value) {
    return "-";
  }

  const [date, time] = value.split("T");

  if (!date || !time) {
    return value;
  }

  return `${date} ${time}`;
}

function statusTone(status: MatchStatus) {
  if (status === "เผยแพร่แล้ว") {
    return "bg-sky-400/15 text-sky-200 border-sky-300/20";
  }

  if (status === "พรีเมียม") {
    return "bg-emerald-400/15 text-emerald-300 border-emerald-300/20";
  }

  return "bg-amber-400/15 text-amber-200 border-amber-300/20";
}

export default function AdminPage() {
  const [matches, setMatches] = useState<AdminMatch[]>(initialMatches);
  const [form, setForm] = useState<AdminMatch>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string>(initialMatches[0].id);

  const previewMatch = useMemo(
    () => matches.find((match) => match.id === previewId) ?? matches[0] ?? null,
    [matches, previewId],
  );

  const publishedCount = useMemo(
    () => matches.filter((match) => match.status === "เผยแพร่แล้ว").length,
    [matches],
  );

  const premiumCount = useMemo(
    () => matches.filter((match) => match.status === "พรีเมียม").length,
    [matches],
  );

  function handleChange<K extends keyof AdminMatch>(key: K, value: AdminMatch[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleAddNew() {
    resetForm();
  }

  function handleEdit(match: AdminMatch) {
    setForm(match);
    setEditingId(match.id);
  }

  function handleDelete(id: string) {
    setMatches((current) => current.filter((match) => match.id !== id));
    if (previewId === id) {
      const next = matches.find((match) => match.id !== id);
      if (next) {
        setPreviewId(next.id);
      }
    }
    if (editingId === id) {
      resetForm();
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingId) {
      setMatches((current) =>
        current.map((match) => (match.id === editingId ? { ...form, id: editingId } : match)),
      );
      setPreviewId(editingId);
      return;
    }

    const newId = `match-${Date.now()}`;
    const newMatch = { ...form, id: newId };
    setMatches((current) => [newMatch, ...current]);
    setPreviewId(newId);
    setForm(emptyForm);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 md:pt-10">
      <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(140deg,rgba(10,16,13,0.98),rgba(6,10,8,0.94))] p-6 shadow-[0_26px_120px_rgba(0,0,0,0.36)] md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">KickData หลังบ้านผู้ดูแลระบบ</p>
            <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
              จัดการข้อมูลคู่บอลและข้อมูลก่อนเกม
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
              หน้านี้เป็น mockup สำหรับจัดการคู่แข่งขัน สถิติ ข้อมูลก่อนเกม ราคาตลาด ข่าวทีม และช่องถ่ายทอดสด
              โดยยังไม่เชื่อม Firebase และยังไม่เชื่อมระบบภายนอก
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddNew}
            className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-[#041109] shadow-[0_10px_30px_rgba(52,211,153,0.25)]"
          >
            เพิ่มคู่บอลใหม่
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/55">จำนวนคู่บอลวันนี้</p>
          <p className="mt-3 text-4xl font-semibold text-white">{matches.length}</p>
          <p className="mt-2 text-sm text-emerald-300">อัปเดตจากข้อมูลจำลอง</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/55">รอวิเคราะห์</p>
          <p className="mt-3 text-4xl font-semibold text-white">
            {matches.filter((match) => match.status === "รอวิเคราะห์").length}
          </p>
          <p className="mt-2 text-sm text-amber-200">พร้อมเติมข้อมูลก่อนเผยแพร่</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/55">เผยแพร่แล้ว</p>
          <p className="mt-3 text-4xl font-semibold text-white">{publishedCount}</p>
          <p className="mt-2 text-sm text-sky-200">แสดงผลบนเว็บไซต์แล้ว</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/55">เนื้อหาพรีเมียม</p>
          <p className="mt-3 text-4xl font-semibold text-white">{premiumCount}</p>
          <p className="mt-2 text-sm text-emerald-300">ใช้สำหรับสมาชิก</p>
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">รายการคู่บอลทั้งหมด</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">ตารางจัดการคู่แข่งขัน</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/65">
              ใช้ mock data สำหรับออกแบบหน้าจอ
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-[980px] text-left text-sm">
              <thead className="border-b border-white/8 text-white/45">
                <tr>
                  <th className="px-4 py-4 font-medium">คู่แข่งขัน</th>
                  <th className="px-4 py-4 font-medium">ลีก</th>
                  <th className="px-4 py-4 font-medium">เวลาแข่ง</th>
                  <th className="px-4 py-4 font-medium">สถานะ</th>
                  <th className="px-4 py-4 font-medium">ราคาตลาด 1X2</th>
                  <th className="px-4 py-4 font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id} className="border-b border-white/6 align-top">
                    <td className="px-4 py-4">
                      <p className="font-medium text-white">
                        {match.homeTeam} พบ {match.awayTeam}
                      </p>
                      <p className="mt-1 text-xs text-white/45">{match.preMatchSummary}</p>
                    </td>
                    <td className="px-4 py-4 text-white/72">{match.league}</td>
                    <td className="px-4 py-4 text-white/72">{formatKickoff(match.kickoff)}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(match.status)}`}
                      >
                        {match.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white/72">
                      {match.homePrice} / {match.drawPrice} / {match.awayPrice}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(match)}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/75"
                        >
                          แก้ไข
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(match.id)}
                          className="rounded-full border border-rose-300/20 bg-rose-400/10 px-3 py-2 text-xs text-rose-100"
                        >
                          ลบ
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewId(match.id)}
                          className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-300"
                        >
                          ดูตัวอย่าง
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,13,0.95),rgba(4,8,6,0.98))] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">ตัวอย่างข้อมูล</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">ดูตัวอย่างก่อนเผยแพร่</h2>

          {previewMatch ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-3xl border border-white/8 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">{previewMatch.league}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">
                      {previewMatch.homeTeam} พบ {previewMatch.awayTeam}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(previewMatch.status)}`}
                  >
                    {previewMatch.status}
                  </span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-black/15 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">เวลาแข่ง</p>
                    <p className="mt-2 text-lg font-medium text-white">{formatKickoff(previewMatch.kickoff)}</p>
                  </div>
                  <div className="rounded-2xl bg-black/15 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">ราคาตลาด 1X2</p>
                    <p className="mt-2 text-lg font-medium text-white">
                      {previewMatch.homePrice} / {previewMatch.drawPrice} / {previewMatch.awayPrice}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/8 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-emerald-300">ข้อมูลก่อนเกม</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-white/72">
                  <li>แฮนดิแคป: {previewMatch.handicap}</li>
                  <li>สูงต่ำ: {previewMatch.overUnder}</li>
                  <li>
                    สัดส่วนแบบจำลอง: เจ้าบ้าน {previewMatch.homePercent}% / เสมอ {previewMatch.drawPercent}% /
                    ทีมเยือน {previewMatch.awayPercent}%
                  </li>
                  <li>ข่าวทีม: {previewMatch.teamNews}</li>
                  <li>นักเตะที่คาดว่าจะลงสนาม: {previewMatch.expectedLineup}</li>
                  <li>ช่องถ่ายทอดสด: {previewMatch.broadcastChannel}</li>
                  <li>ลิงก์ถ่ายทอดสดอย่างเป็นทางการ: {previewMatch.officialBroadcastLink}</li>
                </ul>
                <div className="mt-5 rounded-2xl border border-white/8 bg-black/12 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/45">สรุปมุมมองก่อนเกม</p>
                  <p className="mt-2 text-sm leading-7 text-white/78">{previewMatch.preMatchSummary}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-white/60">
              ยังไม่มีข้อมูลให้แสดงตัวอย่าง
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">
              {editingId ? "แก้ไขข้อมูลคู่บอล" : "เพิ่มคู่บอลใหม่"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              แบบฟอร์มจัดการข้อมูลก่อนเกม
            </h2>
          </div>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70"
            >
              ยกเลิกการแก้ไข
            </button>
          ) : null}
        </div>

        <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="grid gap-2 text-sm text-white/75">
              ลีก
              <input
                value={form.league}
                onChange={(event) => handleChange("league", event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              ทีมเหย้า
              <input
                value={form.homeTeam}
                onChange={(event) => handleChange("homeTeam", event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              ทีมเยือน
              <input
                value={form.awayTeam}
                onChange={(event) => handleChange("awayTeam", event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              เวลาแข่ง
              <input
                type="datetime-local"
                value={form.kickoff}
                onChange={(event) => handleChange("kickoff", event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="grid gap-2 text-sm text-white/75">
              สถานะ
              <select
                value={form.status}
                onChange={(event) => handleChange("status", event.target.value as MatchStatus)}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              >
                <option value="รอวิเคราะห์">รอวิเคราะห์</option>
                <option value="เผยแพร่แล้ว">เผยแพร่แล้ว</option>
                <option value="พรีเมียม">พรีเมียม</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              แฮนดิแคป
              <input
                value={form.handicap}
                onChange={(event) => handleChange("handicap", event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              สูงต่ำ
              <input
                value={form.overUnder}
                onChange={(event) => handleChange("overUnder", event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/8 px-4 py-3 text-sm text-emerald-100">
              ใช้ข้อมูลจำลองเท่านั้น และยังไม่เชื่อม Firebase
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm text-white/75">
              ราคาตลาด 1X2: เจ้าบ้าน
              <input
                value={form.homePrice}
                onChange={(event) => handleChange("homePrice", event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              ราคาตลาด 1X2: เสมอ
              <input
                value={form.drawPrice}
                onChange={(event) => handleChange("drawPrice", event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              ราคาตลาด 1X2: ทีมเยือน
              <input
                value={form.awayPrice}
                onChange={(event) => handleChange("awayPrice", event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm text-white/75">
              % เจ้าบ้าน
              <input
                value={form.homePercent}
                onChange={(event) => handleChange("homePercent", event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              % เสมอ
              <input
                value={form.drawPercent}
                onChange={(event) => handleChange("drawPercent", event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              % ทีมเยือน
              <input
                value={form.awayPercent}
                onChange={(event) => handleChange("awayPercent", event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2 text-sm text-white/75">
              ข่าวทีม
              <textarea
                value={form.teamNews}
                onChange={(event) => handleChange("teamNews", event.target.value)}
                rows={3}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              นักเตะที่คาดว่าจะลงสนาม
              <textarea
                value={form.expectedLineup}
                onChange={(event) => handleChange("expectedLineup", event.target.value)}
                rows={3}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-white/75">
              ช่องถ่ายทอดสด
              <input
                value={form.broadcastChannel}
                onChange={(event) => handleChange("broadcastChannel", event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              ลิงก์ถ่ายทอดสดอย่างเป็นทางการ
              <input
                value={form.officialBroadcastLink}
                onChange={(event) => handleChange("officialBroadcastLink", event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm text-white/75">
            สรุปมุมมองก่อนเกม
            <textarea
              value={form.preMatchSummary}
              onChange={(event) => handleChange("preMatchSummary", event.target.value)}
              rows={4}
              className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-white outline-none"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-[#041109]"
            >
              {editingId ? "บันทึกการแก้ไข" : "บันทึกคู่บอลใหม่"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/75"
            >
              ล้างฟอร์ม
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
