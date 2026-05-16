import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= SIMPLE SEO SCORING ================= */
function scoreMatch(a, b) {
  let score = 0;

  const textA = (a.title + " " + a.content).toLowerCase();
  const textB = (b.title + " " + b.content).toLowerCase();

  const keywordsA = textA.split(" ").slice(0, 20);
  const keywordsB = textB.split(" ").slice(0, 20);

  keywordsA.forEach((word) => {
    if (word.length > 4 && textB.includes(word)) {
      score += 1;
    }
  });

  keywordsB.forEach((word) => {
    if (word.length > 4 && textA.includes(word)) {
      score += 1;
    }
  });

  return score;
}

export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online";

    const blogSnap = await getDocs(collection(db, "blog"));

    const posts = blogSnap.docs.map((d) => ({
      id: d.id,
      title: d.data().title || "",
      content: d.data().content || "",
    }));

    const boostMap = posts.map((post) => {
      const scored = posts
        .filter((p) => p.id !== post.id)
        .map((p) => ({
          ...p,
          score: scoreMatch(post, p),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4) // أهم 4 روابط فقط (SEO optimal)
        .map((p) => ({
          title: p.title,
          url: `${baseUrl}/blog/${p.id}`,
        }));

      return {
        page: `${baseUrl}/blog/${post.id}`,
        internalLinks: scored,
      };
    });

    return res.status(200).json({
      success: true,
      boostMap,
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
             }
