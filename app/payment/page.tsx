import styles from "./page.module.css";

export default function PaymentPage({
  searchParams,
}: {
  searchParams?: {
    plan?: string;
    price?: string;
  };
}) {
  const plan = searchParams?.plan || "VIP 30 วัน";
  const price = searchParams?.price || "299";

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.brand}>KickData Payment</p>
        <h1>แจ้งชำระเงิน</h1>
        <p className={styles.sub}>
          กรุณาโอนเงินตามแพ็กเกจที่เลือก แล้วส่งสลิปให้แอดมินเพื่อตรวจสอบและเปิด VIP
        </p>

        <div className={styles.orderBox}>
          <div>
            <span>แพ็กเกจ</span>
            <strong>{plan}</strong>
          </div>

          <div>
            <span>ยอดชำระ</span>
            <strong>{price} บาท</strong>
          </div>
        </div>

        <div className={styles.qrBox}>
          <div className={styles.qrPlaceholder}>
            QR
          </div>

          <div className={styles.bankInfo}>
            <h2>ช่องทางชำระเงิน</h2>
            <p><b>พร้อมเพย์:</b> ใส่เบอร์/เลขพร้อมเพย์ของคุณ</p>
            <p><b>ชื่อบัญชี:</b> ใส่ชื่อบัญชีของคุณ</p>
            <p><b>ธนาคาร:</b> ใส่ธนาคารของคุณ</p>
            <p className={styles.warning}>
              หลังโอนแล้ว กรุณาส่งสลิปพร้อมอีเมลที่ใช้สมัคร เพื่อเปิดสิทธิ์ VIP
            </p>
          </div>
        </div>

        <div className={styles.actionBox}>
          <a
            className={styles.lineButton}
            href="https://line.me/R/ti/p/@"
            target="_blank"
          >
            ส่งสลิปทาง LINE
          </a>

          <a className={styles.backButton} href="/pricing">
            กลับไปเลือกแพ็กเกจ
          </a>
        </div>

        <section className={styles.steps}>
          <h2>ขั้นตอนการสมัคร</h2>
          <ol>
            <li>เลือกแพ็กเกจสมาชิก</li>
            <li>โอนเงินตามยอดที่แสดง</li>
            <li>ส่งสลิป + อีเมลที่ใช้สมัครให้แอดมิน</li>
            <li>แอดมินตรวจสอบและเปิดสิทธิ์ VIP</li>
          </ol>
        </section>
      </section>
    </main>
  );
}
