import { setDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= VIRAL CONTENT ENGINE ================= */
export async function viralGenerator(products) {
  for (const p of products) {
    const content = `
🔥 TREND ALERT: ${p.title}

💰 Price: $${p.optimizedPrice}

📈 Why it's viral:
- High demand spike
- Social media trending
- Limited availability

⚡ Buy before price changes
`;

    await setDoc(doc(db, "viral_content", p.title), {
      product: p.title,
      content,
      createdAt: Date.now()
    });
  }
}
