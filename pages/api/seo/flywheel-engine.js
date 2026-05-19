import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= KEYWORD GENERATOR ================= */
function generateKeyword(seed = []) {
  const base = [
    "best", "review", "cheap", "top", "vs", "guide",
    "amazon", "2026", "trending", "buy", "budget"
  ];

  const topics = [
    "headphones",
    "smart watches",
    "gaming accessories",
    "home devices",
    "usb c",
    "power bank"
  ];

  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const randomBase = base[Math.floor(Math.random() * base.length)];

  return `${randomBase} ${randomTopic}`;
}

/* ================= MAIN ================= */
export default async function handler(req, res) {
  try {

    const baseUrl = "https://koloonline.online";

    /* ================= 1. GENERATE KEYWORD ================= */
    const keyword = generateKeyword();

    console.log("🔥 Generated Keyword:", keyword);

    /* ================= 2. CALL BLOG GENERATOR ================= */
    const blogRes = await fetch(`${baseUrl}/api/generate-blog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword }),
    });

    const blogData = await blogRes.json();

    if (!blogData?.blogId) {
      return res.status(500).json({
        success: false,
        error: "Blog generation failed",
      });
    }

    /* ================= 3. FETCH BLOG ================= */
    const blogSnap = await getDocs(collection(db, "blog"));

    const blog = blogSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .find(b => b.id === blogData.blogId);

    /* ================= 4. AUTO CLUSTER DETECTION ================= */
    const clusters = {};

    blogSnap.docs.forEach(d => {
      const data = d.data();

      const words = (data.title || "").toLowerCase().split(" ");

      const main = words.find(w =>
        w.length > 4
      ) || "general";

      if (!clusters[main]) clusters[main] = [];
      clusters[main].push(d.id);
    });

    const blogWords = (blog?.title || "").toLowerCase().split(" ");

    const detectedCluster =
      blogWords.find(w => w.length > 4) || "general";

    /* ================= 5. RELATED CONTENT BOOST ================= */
    const related = Object.keys(clusters)
      .filter(c => c !== detectedCluster)
      .slice(0, 3);

    /* ================= 6. SAVE FLYWHEEL EVENT ================= */
    await addDoc(collection(db, "flywheel_logs"), {
      keyword,
      blogId: blogData.blogId,
      cluster: detectedCluster,
      relatedClusters: related,
      createdAt: serverTimestamp(),
    });

    /* ================= 7. AUTO SEO BOOST ================= */
    try {
      await fetch(`${baseUrl}/api/seo/v6-seo-brain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "blog" }),
      });
    } catch {}

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      keyword,
      blogId: blogData.blogId,
      cluster: detectedCluster,
      relatedClusters: related,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
