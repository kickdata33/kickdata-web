import styles from "./page.module.css";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "บาท",
    badge: "เริ่มต้น",
    description: "เหมาะสำหรับดูผลบอลและทดลองใช้งาน",
    features: [
      "ดูผลบอลทุกลีก",
      "ดูทีเด็ดฟรีบางคู่",
      "ดูผลย้อนหลังบางส่วน",
      "เหมาะสำหรับผู้ใช้งานทั่วไป",
    ],
    buttonText: "ใช้งานฟรี",
    highlight: false,
  },
  {
    name: "VIP 7 วัน",
    price: "99",
    period: "บาท",
    badge: "ทดลองใช้",
    description: "เหมาะสำหรับทดลองดูทีเด็ด VIP ช่วงสั้น",
    features: [
      "ดูทีเด็ด VIP ทุกคู่",
      "ดู % ความมั่นใจ",
      "ดูตัวเด่นประจำวัน",
      "ดูผลย้อนหลัง 7 วัน",
    ],
    buttonText: "สมัคร VIP 7 วัน",
    highlight: false,
  },
  {
    name: "VIP 30 วัน",
    price: "299",
    period: "บาท",
    badge: "แนะนำ",
    description: "แพ็กเกจหลัก คุ้มสุดสำหรับใช้งานประจำ",
    features: [
      "ดูวิเคราะห์ทุกคู่",
      "ดูทรรศนะเต็ม",
      "ดูสถิติย้อนหลัง 30 วัน",
      "ดูสถิติแยกแฮนดิแคป / สูงต่ำ",
    ],
    buttonText: "สมัคร VIP 30 วัน",
    highlight: true,
  },
  {
    name: "VIP 90 วัน",
    price: "799",
    period: "บาท",
    badge: "คุ้มที่สุด",
    description: "เหมาะสำหรับสมาชิกที่ต้องการติดตามระยะยาว",
    features: [
      "สิทธิ์ VIP ครบทุกอย่าง",
      "ดูผลย้อนหลัง 90 วัน",
      "ดูสถิติแยกลีก",
      "ดูสถิติเชิงลึกทั้งหมด",
    ],
    buttonText: "สมัคร VIP 90 วัน",
    highlight: false,
  },
];

const comparisonRows = [
  {
    feature: "ผลบอลสด",
    free: "✅",
    vip7: "✅",
    vip30: "✅",
    vip90: "✅",
  },
  {
    feature: "โปรแกรมบอล",
    free: "✅",
    vip7: "✅",
    vip30: "✅",
    vip90: "✅",
  },
  {
    feature: "ทีเด็ดฟรี",
    free: "✅",
    vip7: "✅",
    vip30: "✅",
    vip90: "✅",
  },
  {
    feature: "ทีเด็ด VIP",
    free: "🔒",
    vip7: "✅",
    vip30: "✅",
    vip90: "✅",
  },
  {
    feature: "% ความมั่นใจ",
    free: "บางคู่",
    vip7: "✅",
    vip30: "✅",
    vip90: "✅",
  },
  {
    feature: "ทรรศนะเต็ม",
    free: "🔒",
    vip7: "สั้น",
    vip30: "✅",
    vip90: "✅",
  },
  {
    feature: "ตัวน่าเล่นสุดของวัน",
    free: "🔒",
    vip7: "✅",
    vip30: "✅",
    vip90: "✅",
  },
  {
    feature: "ผลย้อนหลัง",
    free: "3 วัน",
    vip7: "7 วัน",
    vip30: "30 วัน",
    vip90: "90 วัน",
  },
  {
    feature: "สถิติแฮนดิแคป / สูงต่ำ",
    free: "🔒",
    vip7: "พื้นฐาน",
    vip30: "✅",
    vip90: "✅",
  },
  {
    feature: "สถิติแยกลีก",
    free: "🔒",
    vip7: "🔒",
    vip30: "พื้นฐาน",
    vip90: "✅",
  },
  {
    feature: "สถิติตาม % ความมั่นใจ",
    free: "🔒",
    vip7: "🔒",
    vip30: "✅",
    vip90: "✅",
  },
  {
    feature: "รายงานสรุปรายสัปดาห์",
    free: "🔒",
    vip7: "🔒",
    vip30: "🔒",
    vip90: "✅",
  },
];

const flowSteps = [
  {
    title: "1. เลือกแพ็กเกจ",
    text: "เลือก Free, VIP 7 วัน, VIP 30 วัน หรือ VIP 90 วัน ตามการใช้งาน",
  },
  {
    title: "2. ชำระเงิน",
    text: "ระยะแรกใช้พร้อมเพย์หรือโอนเงิน แล้วส่งสลิปให้แอดมินตรวจสอบ",
  },
  {
    title: "3. แอดมินอนุมัติ",
    text: "เมื่อยอดถูกต้อง แอดมินเปิดสิทธิ์ VIP และตั้งวันหมดอายุสมาชิก",
  },
  {
    title: "4. ใช้งาน VIP",
    text: "สมาชิกล็อกอินแล้วดูทีเด็ด VIP, % ความมั่นใจ, ทรรศนะ และผลย้อนหลังตามระดับแพ็กเกจ",
  },
];

export default function PricingPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.brand}>KickData VIP</p>
          <h1>แพ็กเกจสมาชิก</h1>
          <p className={styles.sub}>
            เลือกระดับสมาชิกให้เหมาะกับการใช้งาน ดูทีเด็ด แฮนดิแคป สูงต่ำ
            สถิติย้อนหลัง และข้อมูลเชิงลึกตามระดับ VIP
          </p>
        </div>

        <div className={styles.statusBox}>
          <span>ระบบชำระเงิน</span>
          <strong>พร้อมเพย์ / โอนเงิน</strong>
        </div>
      </header>

      <section className={styles.planGrid}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`${styles.planCard} ${
              plan.highlight ? styles.highlight : ""
            }`}
          >
            <div className={styles.badge}>{plan.badge}</div>

            <h2>{plan.name}</h2>
            <p className={styles.desc}>{plan.description}</p>

            <div className={styles.price}>
              <strong>{plan.price}</strong>
              <span>{plan.period}</span>
            </div>

            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>

            <a
              href={`/payment?plan=${encodeURIComponent(
                plan.name
              )}&price=${plan.price}`}
              className={plan.highlight ? styles.primaryButton : styles.button}
            >
              {plan.buttonText}
            </a>
          </div>
        ))}
      </section>

      <section className={styles.compareCard}>
        <div className={styles.sectionTitle}>
          <h2>เปรียบเทียบสิทธิ์สมาชิก</h2>
          <p>แบ่งสิทธิ์การเข้าถึงข้อมูลให้ชัดเจนตามระดับสมาชิก</p>
        </div>

        <div className={styles.compareWrap}>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th>ฟีเจอร์</th>
                <th>Free</th>
                <th>VIP 7 วัน</th>
                <th>VIP 30 วัน</th>
                <th>VIP 90 วัน</th>
              </tr>
            </thead>

            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature}>
                  <td className={styles.featureName}>{row.feature}</td>
                  <td>{row.free}</td>
                  <td>{row.vip7}</td>
                  <td className={styles.recommendCol}>{row.vip30}</td>
                  <td>{row.vip90}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.flowCard}>
        <div className={styles.sectionTitle}>
          <h2>Flow การสมัครสมาชิก</h2>
          <p>เหมาะกับระบบเริ่มต้นแบบแอดมินอนุมัติเอง ก่อนต่อ Payment Gateway</p>
        </div>

        <div className={styles.flowGrid}>
          {flowSteps.map((step) => (
            <div key={step.title} className={styles.flowItem}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.infoGrid}>
        <div>
          <h3>Free ใช้ดึงคนเข้าเว็บ</h3>
          <p>
            ให้ดูผลบอล โปรแกรมบอล และทีเด็ดบางคู่ เพื่อให้ผู้ใช้เห็นคุณภาพของเว็บ
            ก่อนตัดสินใจสมัคร VIP
          </p>
        </div>

        <div>
          <h3>VIP 30 วันเป็นแพ็กหลัก</h3>
          <p>
            ควรดันแพ็กนี้เป็นหลัก เพราะคุ้มค่าที่สุดสำหรับสมาชิกประจำ
            และเหมาะกับการสร้างรายได้รายเดือน
          </p>
        </div>

        <div>
          <h3>VIP 90 วันสำหรับลูกค้าประจำ</h3>
          <p>
            ให้สิทธิ์ดูสถิติย้อนหลังและข้อมูลเชิงลึกมากกว่า เพื่อเพิ่มมูลค่าแพ็กเกจระยะยาว
          </p>
        </div>
      </section>

      <p className={styles.disclaimer}>
        ข้อมูลบนเว็บไซต์เป็นบทวิเคราะห์เชิงสถิติและมุมมองประกอบการตัดสินใจ
        ไม่รับประกันผลการแข่งขัน
      </p>
    </main>
  );
}
