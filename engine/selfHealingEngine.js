import { getDocs, collection, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { enhancePost } from "./contentEnhancer";

/* ================= SELF HEALING ENGINE ================= */
export async function selfHealingEngine() {
  try {
    /* ================= LOAD CONTENT ================= */
    const snap = await getDocs(collection(db, "blog"));

    let posts = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= ANALYZE HEALTH ================= */
    const brokenPages = [];
    const weakPages = [];
    const deadPages = [];

    for (let post of posts) {
      const score = calculateHealthScore(post);

      if (!post.title || !post.content) {
        brokenPages.push(post);
      } else if (score < 30) {
        weakPages.push(post);
      } else if ((post.views || 0) < 10) {
        deadPages.push(post);
      }
    }

    /* ================= FIX BROKEN PAGES ================= */
    for (let post of brokenPages) {
      try {
        await updateDoc(doc(db, "blog", post.id), {
          title: post.title || "Untitled Article",
          content: post.content || "<p>Auto repaired content</p>",
          repaired: true,
        });
      } catch (e) {
        console.error("Broken fix error:", post.id);
      }
    }

    /* ================= ENHANCE WEAK PAGES ================= */
    for (let post of weakPages) {
      try {
        const improved = await enhancePost(post.title);

        await updateDoc(doc(db, "blog", post.id), {
          content: improved.content,
          seoScoreImproved: true,
        });
      } catch (e) {
        console.error("Weak page improve error:", post.id);
      }
    }

    /* ================= HANDLE DEAD PAGES ================= */
    for (let post of deadPages) {
      try {
        // خيار 1: حذف
        await deleteDoc(doc(db, "blog", post.id));

        // أو خيار بديل (لو عايزة تحافظي عليهم):
        // await updateDoc(doc(db, "blog", post.id), {
        //   archived: true,
        //   hidden: true
        // });

      } catch (e) {
        console.error("Dead page delete error:", post.id);
      }
    }

    /* ================= RESULT ================= */
    return {
      success: true,
      brokenFixed: brokenPages.length,
      improved: weakPages.length,
      removed: deadPages.length,
    };

  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
}

/* ================= HEALTH SCORING ================= */
function calculateHealthScore(post) {
  const titleScore = post.title ? 40 : 0;
  const contentScore = post.content ? 40 : 0;

  const engagement =
    (post.views || 0) * 0.5 +
    (post.clicks || 0) * 2;

  return titleScore + contentScore + Math.min(20, engagement / 10);
}
