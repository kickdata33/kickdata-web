"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function createUserProfile(uid: string, userEmail: string) {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: userEmail,
        role: "member",
        vipLevel: "free",
        vipUntil: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await createUserProfile(credential.user.uid, credential.user.email || email);
      } else {
        const credential = await signInWithEmailAndPassword(auth, email, password);

        await createUserProfile(credential.user.uid, credential.user.email || email);
      }

      router.push("/member");
    } catch (err: any) {
      console.error("Firebase Auth Error:", err.code, err.message);

      if (err.code === "auth/email-already-in-use") {
        setError("อีเมลนี้ถูกใช้งานแล้ว ให้กดเข้าสู่ระบบแทน");
      } else if (err.code === "auth/invalid-credential") {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else if (err.code === "auth/weak-password") {
        setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("ยังไม่ได้เปิด Email/Password ใน Firebase Authentication");
      } else if (err.code === "auth/invalid-api-key") {
        setError("Firebase API Key ไม่ถูกต้อง หรือยังไม่ได้ใส่ Environment Variable");
      } else if (err.code === "permission-denied") {
        setError("Firestore Rules ยังไม่อนุญาตให้บันทึกข้อมูลสมาชิก");
      } else {
        setError(`${err.code || "unknown"}: ${err.message || "เกิดข้อผิดพลาด"}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.brand}>KickData Account</p>

        <h1>{mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</h1>

        <p className={styles.sub}>
          เข้าสู่ระบบเพื่อดูสถานะสมาชิก VIP และข้อมูลที่ปลดล็อกตามแพ็กเกจ
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            อีเมล
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            รหัสผ่าน
            <input
              type="password"
              placeholder="อย่างน้อย 6 ตัวอักษร"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" disabled={loading}>
            {loading
              ? "กำลังดำเนินการ..."
              : mode === "login"
              ? "เข้าสู่ระบบ"
              : "สมัครสมาชิก"}
          </button>
        </form>

        <div className={styles.switchBox}>
          {mode === "login" ? (
            <p>
              ยังไม่มีบัญชี?{" "}
              <button onClick={() => setMode("register")}>สมัครสมาชิก</button>
            </p>
          ) : (
            <p>
              มีบัญชีแล้ว?{" "}
              <button onClick={() => setMode("login")}>เข้าสู่ระบบ</button>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
