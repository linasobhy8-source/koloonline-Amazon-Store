import { setDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= AUTO CONTENT CREATOR ================= */
export async function generateContent(product) {
  const title = product.title;

  const content = `
🔥 ${title}

✔ Why it's trending:
- High demand product
- Limited availability
- Strong conversion rate

💰 Price advantage:
Best value compared to competitors

🚀 Recommendation:
Buy now before price increases
`;

  await setDoc(doc(db, "content", product.id), {
    productId: product.id,
    content,
    createdAt: Date.now()
  });

  return content;
}
