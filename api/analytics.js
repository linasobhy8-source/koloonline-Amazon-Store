import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const snapshot = await getDocs(collection(db, "events"));

    if (!snapshot || snapshot.empty) {
      return res.status(200).json({
        success: true,
        overview: {
          totalClicks: 0,
          totalOrders: 0,
          totalWhatsApp: 0,
          revenue: 0,
        },
        topProducts: [],
        countries: {},
        funnel: {
          clickToOrderRate: 0,
          clickToWhatsappRate: 0,
        },
      });
    }

    const events = snapshot.docs.map((doc) => doc.data());

    let totalClicks = 0;
    let totalOrders = 0;
    let totalWhatsApp = 0;

    const productMap = {};
    const countryMap = {
      EG: 0,
      US: 0,
      CA: 0,
      PL: 0,
      UNKNOWN: 0,
    };

    for (const ev of events) {
      const country = ev.country || "UNKNOWN";

      if (countryMap[country] === undefined) {
        countryMap[country] = 1;
      } else {
        countryMap[country]++;
      }

      switch (ev.type) {
        case "product_click":
          totalClicks++;
          break;
        case "purchase":
          totalOrders++;
          break;
        case "whatsapp":
          totalWhatsApp++;
          break;
      }

      if (ev.asin) {
        if (!productMap[ev.asin]) {
          productMap[ev.asin] = {
            asin: ev.asin,
            clicks: 0,
            orders: 0,
            whatsapp: 0,
          };
        }

        if (ev.type === "product_click") productMap[ev.asin].clicks++;
        if (ev.type === "purchase") productMap[ev.asin].orders++;
        if (ev.type === "whatsapp") productMap[ev.asin].whatsapp++;
      }
    }

    const revenue = totalOrders * 12;

    return res.status(200).json({
      success: true,

      overview: {
        totalClicks,
        totalOrders,
        totalWhatsApp,
        revenue,
      },

      topProducts: Object.values(productMap),

      countries: countryMap,

      funnel: {
        clickToOrderRate: totalClicks
          ? Number(((totalOrders / totalClicks) * 100).toFixed(2))
          : 0,

        clickToWhatsappRate: totalClicks
          ? Number(((totalWhatsApp / totalClicks) * 100).toFixed(2))
          : 0,
      },
    });

  } catch (error) {
    console.error("Analytics API Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
}
