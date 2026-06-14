import { db } from "../../lib/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { productBrain } from "../../lib/ai/productBrain";
import { detectVirals } from "../../lib/ai/viralDetector";

export default async function handler(req, res) {
  try {
    const { action } = req.query;

    if (action === "feed") {
      const snap = await getDocs(
        query(collection(db, "products"), limit(120))
      );

      let products = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      products = productBrain(products);
      const virals = detectVirals(products);

      products.sort((a, b) => (b.score || 0) - (a.score || 0));

      return res.status(200).json({
        success: true,
        data: products.slice(0, 20),
        viral: virals.slice(0, 5),
      });
    }

    if (action === "trending") {
      const snap = await getDocs(
        query(collection(db, "products"), limit(50))
      );

      let products = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      const trending = productBrain(products)
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 10);

      return res.status(200).json({
        success: true,
        trending,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid action",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
        }
