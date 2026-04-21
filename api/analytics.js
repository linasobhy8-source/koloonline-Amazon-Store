import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  try {

    const snapshot = await getDocs(collection(db, "events"));

    const events = snapshot.docs.map(doc => doc.data());

    let totalClicks = 0;
    let totalOrders = 0;
    let totalWhatsApp = 0;

    const productMap = {};
    const countryMap = {};

    events.forEach(ev => {

      const country = ev.country || "UNKNOWN";
      countryMap[country] = (countryMap[country] || 0) + 1;

      if (ev.type === "product_click") totalClicks++;
      if (ev.type === "purchase") totalOrders++;
      if (ev.type === "whatsapp") totalWhatsApp++;

      if (ev.asin) {

        if (!productMap[ev.asin]) {
          productMap[ev.asin] = {
            asin: ev.asin,
            clicks: 0,
            orders: 0,
            whatsapp: 0
          };
        }

        if (ev.type === "product_click") productMap[ev.asin].clicks++;
        if (ev.type === "purchase") productMap[ev.asin].orders++;
        if (ev.type === "whatsapp") productMap[ev.asin].whatsapp++;
      }
    });

    const revenue = totalOrders * 12;

    return res.status(200).json({
      success: true,

      overview: {
        totalClicks,
        totalOrders,
        totalWhatsApp,
        revenue
      },

      topProducts: Object.values(productMap),

      countries: countryMap,

      funnel: {
        clickToOrderRate: totalClicks
          ? Number(((totalOrders / totalClicks) * 100).toFixed(2))
          : 0,

        clickToWhatsappRate: totalClicks
          ? Number(((totalWhatsApp / totalClicks) * 100).toFixed(2))
          : 0
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Server Error"
    });
  }
                                                                 }
