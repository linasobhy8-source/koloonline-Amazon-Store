import { db } from "../../config/firebase";

import {
  collection,
  getDocs,
  writeBatch,
  doc,
} from "firebase/firestore";

import { getMoneyProducts } from "../../lib/revenue-machine";

/* ================= CACHE ================= */
let cache = null;
let lastRun = 0;

const CACHE_TTL = 1000 * 60 * 10;

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    /* ================= METHOD CHECK ================= */
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        error: "Method Not Allowed",
      });
    }

    const now = Date.now();

    /* ================= MEMORY CACHE ================= */
    if (cache && now - lastRun < CACHE_TTL) {
      return res.status(200).json(cache);
    }

    /* ================= FETCH PRODUCTS ================= */
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= MONEY ENGINE ================= */
    products = getMoneyProducts(products);

    /* ================= SORT ================= */
    products.sort(
      (a, b) =>
        (b.profitScore || 0) -
        (a.profitScore || 0)
    );

    const top = products.slice(0, 20);

    /* ================= BATCH UPDATE ================= */
    const batch = writeBatch(db);

    top.forEach((p) => {
      batch.update(
        doc(db, "products", p.id),
        {
          profitScore: Number(p.profitScore || 0),
          brainScore: Number(p.brainScore || 0),
          ctrMultiplier: Number(
            p.ctrMultiplier || 1
          ),
          lastOptimized: now,
        }
      );
    });

    await batch.commit();

    /* ================= CACHE HEADERS ================= */
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=3600"
    );

    const response = {
      success: true,
      totalProducts: products.length,
      optimizedProducts: top.length,
      runtime: Date.now() - now,
      top,
      message: "Revenue Machine ACTIVE",
    };

    cache = response;
    lastRun = Date.now();

    return res.status(200).json(response);

  } catch (e) {
    console.error(
      "Revenue Machine Error:",
      e
    );

    return res.status(500).json({
      success: false,
      error:
        e?.message ||
        "Internal Server Error",
    });
  }
      }
