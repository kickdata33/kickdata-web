import styles from "./page.module.css";

type MemberStatus = "free" | "vip7" | "vip30" | "vip90" | "expired";

const member = {
  name: "สมาชิก KickData",
  email: "demo@kickdata.com",
  status: "vip30" as MemberStatus,
  planName: "VIP 30 วัน",
  vipUntil: "2026-07-15",
  remainingDays: 23,
  joinedAt: "2026-06-15",
};

const paymentHistory = [
  {
    date: "2026-06-15",
    plan: "VIP 30 วัน",
    amount: "299 บาท",
    status: "อนุมัติแล้ว",
  },
  {
    date: "2026-06-01",
    plan: "VIP 7 วัน",
    amount: "99 บาท",
    status: "หมดอายุแล้ว",
  },
];

const accessItems = [
  {
    title: "วิเคราะห์ทุกคู่",
    free: false,
    vip7: true,
    vip30: true,
    vip90: true,
  },
  {
    title: "% ความมั่นใจ",
    free: false,
    vip7: true,
    vip30: true,
    vip90: true,
  },
  {
    title: "ทรรศนะเต็ม",
    free: false,
    vip7: false,
    vip30: true,
    vip90: true,
  },
  {
    title: "ผลย้อนหลัง 30 วัน",
    free: false,
    vip7: false,
    vip30: true,
    vip90: true,
  },
  {
    title: "สถิติแยกลีก",
    free: false,
    vip7: false,
    vip30: false,
    vip90: true,
  },
];

function getStatusLabel(status: MemberStatus) {
  if (status === "free") return "Free";
  if (status === "vip7") return "VIP 7 วัน";
  if (status === "vip30") return "VIP 30 วัน";
  if (status === "vip90") return "VIP 90 วัน";
  return "หมดอายุ";
}

function getStatusClass(status: MemberStatus) {
  if (status === "expired") return styles.expired;
  if (status === "free") return styles.free;
  return styles.vip;
}

function hasAccess(item: typeof accessItems[number]) {
  if (member.status === "vip90") return item.vip90;
  if (member.status === "vip30") return item.vip30;
  if (member.status === "vip7") return item.vip7;
  return item.free;
}

function formatThaiDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export default function MemberPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.brand}>KickData Member</p>
          <h1>สมาชิกของฉัน</h1>
          <p className={styles.sub}>
            ตรวจสอบสถานะสมาชิก แพ็กเกจ วันหมดอายุ และประวัติการชำระเงิน
          </p>
        </div>

        <div className={styles.statusBox}>
          <span>สถานะปัจจุบัน</span>
          <strong className={getStatusClass(member.status)}>
            {getStatusLabel(member.status)}
          </strong>
        </div>
      </header>

      <section className={styles.memberGrid}>
        <div className={styles.profileCard}>
          <div className={styles.avatar}>KD</div>

          <div>
            <h2>{member.name}</h2>
            <p>{member.email}</p>
            <span className={`${styles.statusBadge} ${getStatusClass(member.status)}`}>
              {getStatusLabel(member.status)}
            </span>
          </div>
        </div>

        <div className={styles.planCard}>
          <span>แพ็กเกจปัจจุบัน</span>
          <strong>{member.planName}</strong>
          <p>เริ่มใช้งาน: {formatThaiDate(member.joinedAt)}</p>
        </div>

        <div className={styles.planCard}>
          <span>วันหมดอายุ</span>
          <strong>{formatThaiDate(member.vipUntil)}</strong>
          <p>เหลือ {member.remainingDays} วัน</p>
        </div>
      </section>

      <section className={styles.actionCard}>
        <div>
          <h2>ต่ออายุสมาชิก</h2>
          <p>
            หากสมาชิกใกล้หมดอายุ สามารถเลือกแพ็กเกจใหม่เพื่อใช้งานต่อได้ทันที
          </p>
        </div>

        <div className={styles.actions}>
          <a href="/pricing" className={styles.primaryButton}>
            ต่ออายุ / อัปเกรด VIP
          </a>
          <a href="/today-analysis" className={styles.secondaryButton}>
            ไปหน้าวิเคราะห์บอล
          </a>
        </div>
      </section>

      <section className={styles.accessCard}>
        <div className={styles.sectionTitle}>
          <h2>สิทธิ์การเข้าถึงของคุณ</h2>
          <p>แสดงฟีเจอร์ที่บัญชีนี้ใช้งานได้ตามระดับสมาชิก</p>
        </div>

        <div className={styles.accessList}>
          {accessItems.map((item) => (
            <div key={item.title} className={styles.accessItem}>
              <span>{item.title}</span>

              {hasAccess(item) ? (
                <strong className={styles.allowed}>ใช้งานได้</strong>
              ) : (
                <strong className={styles.locked}>ล็อก</strong>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.historyCard}>
        <div className={styles.sectionTitle}>
          <h2>ประวัติการชำระเงิน</h2>
          <p>รายการนี้เป็นตัวอย่างก่อนเชื่อม Firebase จริง</p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>วันที่</th>
                <th>แพ็กเกจ</th>
                <th>ยอดเงิน</th>
                <th>สถานะ</th>
              </tr>
            </thead>

            <tbody>
              {paymentHistory.map((item, index) => (
                <tr key={index}>
                  <td>{formatThaiDate(item.date)}</td>
                  <td>{item.plan}</td>
                  <td>{item.amount}</td>
                  <td>
                    <span
                      className={
                        item.status === "อนุมัติแล้ว"
                          ? styles.paymentApproved
                          : styles.paymentExpired
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className={styles.disclaimer}>
        ขั้นตอนถัดไปคือเชื่อมระบบ Login และ Firebase เพื่อให้ข้อมูลสมาชิกเป็นของผู้ใช้จริง
      </p>
    </main>
  );
}
