import { db } from "../../config/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const { category, max = 50 } = req.query;

    let q;

    /* ================= QUERY BUILD ================= */
    if (category) {
      q = query(
        collection(db, "products"),
        orderBy("createdAt", "desc"),
        limit(Number(max))
      );
    } else {
      q = query(
        collection(db, "products"),
        orderBy("createdAt", "desc"),
        limit(Number(max))
      );
    }

    const snapshot = await getDocs(q);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
