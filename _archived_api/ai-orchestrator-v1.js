import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    console.log("🚀 AUTO ORCHESTRATOR STARTED");

    /* ================= 1️⃣ GET APPROVED KEYWORDS ================= */
    const keywordsSnap = await getDocs(collection(db, "keywords"));

    const keywords = keywordsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const approved = keywords
      .filter((k) => k.status === "approved")
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // 🔥 أهم 5 كلمات يوميًا

    if (approved.length === 0) {
      return res.json({
        success: false,
        message: "No approved keywords found",
      });
    }

    /* ================= 2️⃣ PROCESS EACH KEYWORD ================= */
    const results = [];

    for (const item of approved) {
      try {
        console.log("🧠 Processing:", item.keyword);

        /* ================= GENERATE BLOG ================= */
        const blogResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auto-blog-generator-v2`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              keyword: item.keyword,
            }),
          }
        );

        const blogData = await blogResponse.json();

        if (!blogData.success) {
          throw new Error("Blog generation failed");
        }

        /* ================= INDEXING PIPELINE ================= */
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/master-pipeline`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "blog",
              id: blogData.blogId || item.id,
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
            }),
          }
        );

        /* ================= LOG SUCCESS ================= */
        await addDoc(collection(db, "cron_logs"), {
          type: "auto_orchestrator_success",
          keyword: item.keyword,
          score: item.score,
          status: "done",
          createdAt: serverTimestamp(),
        });

        results.push({
          keyword: item.keyword,
          status: "success",
        });

      } catch (err) {
        console.log("❌ Error:", err.message);

        await addDoc(collection(db, "cron_logs"), {
          type: "auto_orchestrator_error",
          keyword: item.keyword,
          error: err.message,
          createdAt: serverTimestamp(),
        });

        results.push({
          keyword: item.keyword,
          status: "failed",
          error: err.message,
        });
      }
    }

    /* ================= FINAL RESPONSE ================= */
    return res.status(200).json({
      success: true,
      processed: approved.length,
      results,
    });

  } catch (e) {
    console.error("❌ ORCHESTRATOR ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
