import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online";

    const blogSnap = await getDocs(collection(db, "blog"));

    const posts = blogSnap.docs.map((d) => ({
      id: d.id,
      title: d.data().title || "",
      content: d.data().content || "",
    }));

    // نحدد أقوى المقالات (seed pages)
    const topPosts = posts.slice(0, 5);

    const boostMap = posts.map((post) => {
      const links = topPosts
        .filter((p) => p.id !== post.id)
        .map((p) => ({
          title: p.title,
          url: `${baseUrl}/blog/${p.id}`,
        }));

      return {
        page: `${baseUrl}/blog/${post.id}`,
        internalLinks: links,
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
