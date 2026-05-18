import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= STOP WORDS ================= */
const stopWords = new Set([
  "the","and","for","with","this","that","from","you","your","are","was","were",
  "best","new","review","guide","how","what","why","top","vs"
]);

/* ================= TOKENIZER ================= */
function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(" ")
    .filter(w => w.length > 3 && !stopWords.has(w));
}

/* ================= SMART SCORE ================= */
function scoreMatch(a, b) {
  const tokensA = tokenize(a.title + " " + a.content);
  const tokensB = tokenize(b.title + " " + b.content);

  let score = 0;

  const setB = new Set(tokensB);

  tokensA.forEach(word => {
    if (setB.has(word)) {
      score += 3; // match قوي
    }
  });

  // boost title match (SEO important)
  if (a.title && b.title) {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();

    tokensA.forEach(word => {
      if (titleB.includes(word)) score += 2;
    });
  }

  // content depth boost
  if ((a.content || "").length > 800 && (b.content || "").length > 800) {
    score += 1;
  }

  return score;
}

/* ================= MAIN HANDLER ================= */
export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online";

    const blogSnap = await getDocs(collection(db, "blog"));

    const posts = blogSnap.docs.map((d) => {
      const data = d.data();

      return {
        id: d.id,
        slug: data.slug || d.id,
        title: data.title || "",
        content: data.content || "",
      };
    });

    const boostMap = posts.map((post) => {
      const related = posts
        .filter((p) => p.id !== post.id)
        .map((p) => ({
          ...p,
          score: scoreMatch(post, p),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5) // 🔥 زودناها 5 بدل 4 (أفضل SEO)
        .filter(p => p.score > 0) // تجاهل الضعيف
        .map(p => ({
          title: p.title,
          url: `${baseUrl}/blog/${p.slug}`,
        }));

      return {
        page: `${baseUrl}/blog/${post.slug}`,
        internalLinks: related,
      };
    });

    return res.status(200).json({
      success: true,
      total: posts.length,
      boostMap,
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
    }
