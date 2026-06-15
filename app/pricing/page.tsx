import styles from "./page.module.css";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "บาท",
    badge: "เริ่มต้น",
    description: "ดูผลบอล และบทวิเคราะห์บางส่วน",
    features: [
      "ดูผลบอลทุกลีก",
      "ดูตารางวิเคราะห์บางคู่",
      "ดูผลย้อนหลังบางรายการ",
      "ไม่เห็นตัว VIP ทั้งหมด",
    ],
    buttonText: "ใช้งานฟรี",
    highlight: false,
  },
  {
    name: "VIP 7 วัน",
    price: "99",
    period: "บาท",
    badge: "ทดลองใช้",
    description: "เหมาะสำหรับลองดูทีเด็ดรายวัน",
    features: [
      "ดูทีเด็ดแฮนดิแคปทั้งหมด",
      "ดูทีเด็ดสูงต่ำทั้งหมด",
      "ดู % ความมั่นใจ",
      "ดูตัวเด่นประจำวัน",
      "อายุสมาชิก 7 วัน",
    ],
    buttonText: "สมัคร VIP 7 วัน",
    highlight: false,
  },
  {
    name: "VIP 30 วัน",
    price: "299",
    period: "บาท",
    badge: "แนะนำ",
    description: "คุ้มสุดสำหรับใช้งานประจำ",
    features: [
      "ดูวิเคราะห์ทุกคู่",
      "ดูตัวมั่นใจสูงสุด",
      "ดูทรรศนะเต็ม",
      "ดูผลย้อนหลัง VIP",
      "อายุสมาชิก 30 วัน",
    ],
    buttonText: "สมัคร VIP 30 วัน",
    highlight: true,
  },
  {
    name: "VIP 90 วัน",
    price: "799",
    period: "บาท",
    badge: "ประหยัด",
    description: "เหมาะสำหรับสมาชิกระยะยาว",
    features: [
      "สิทธิ์ VIP ครบทุกอย่าง",
      "ดูข้อมูลย้อนหลังนานขึ้น",
      "ดูสถิติความแม่นยำ",
      "เหมาะสำหรับติดตามต่อเนื่อง",
      "อายุสมาชิก 90 วัน",
    ],
    buttonText: "สมัคร VIP 90 วัน",
    highlight: false,
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
            สมัครสมาชิก VIP เพื่อดูบทวิเคราะห์เต็ม แฮนดิแคป สูงต่ำ และตัวเด่นประจำวัน
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
            className={`${styles.planCard} ${plan.highlight ? styles.highlight : ""}`}
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
              href={`/payment?plan=${encodeURIComponent(plan.name)}&price=${plan.price}`}
              className={plan.highlight ? styles.primaryButton : styles.button}
            >
              {plan.buttonText}
            </a>
          </div>
        ))}
      </section>

      <section className={styles.infoGrid}>
        <div>
          <h3>สมาชิกฟรีเห็นอะไรบ้าง?</h3>
          <p>
            สมาชิกฟรีสามารถดูผลบอล ตารางบางส่วน และบทวิเคราะห์ที่เปิดเผยได้
            แต่ข้อมูลตัวเด่นและทรรศนะเต็มจะถูกล็อกไว้สำหรับ VIP
          </p>
        </div>

        <div>
          <h3>สมาชิก VIP ได้อะไร?</h3>
          <p>
            ดูครบทุกคู่ที่วิเคราะห์ เห็น % ความมั่นใจ เหตุผลเต็ม ตัวน่าเล่นสุด
            และผลวิเคราะห์ย้อนหลังแบบละเอียด
          </p>
        </div>

        <div>
          <h3>อนุมัติยังไง?</h3>
          <p>
            ระยะแรกใช้ระบบโอนเงินแล้วแอดมินอนุมัติเอง หลังจากระบบนิ่งแล้วค่อยต่อ
            Payment Gateway อัตโนมัติ
          </p>
        </div>
      </section>

      <p className={styles.disclaimer}>
        ข้อมูลบนเว็บไซต์เป็นบทวิเคราะห์เชิงสถิติและมุมมองประกอบการตัดสินใจ ไม่รับประกันผลการแข่งขัน
      </p>
    </main>
  );
}
