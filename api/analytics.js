export default async function handler(req, res) {
  try {

    const GA_MEASUREMENT_ID = "G-YS8L61XLPR";
    const GTM_ID = "GTM-KNQM8KBN";

    /* ================= MOCK LIVE DATA STRUCTURE =================
       (هنا لاحقاً هتتبدل بـ Firebase / DB real data)
    */

    const events = [
      { type: "click", asin: "B09V7Z4TJG", country: "EG" },
      { type: "click", asin: "B09V7Z4TJG", country: "US" },
      { type: "whatsapp", asin: "B08G9P7N2X", country: "EG" },
      { type: "purchase", asin: "B09V7Z4TJG", country: "CA" },
      { type: "click", asin: "B08G9P7N2X", country: "PL" },
    ];

    /* ================= ANALYTICS ENGINE ================= */

    let totalClicks = 0;
    let totalOrders = 0;
    let totalWhatsApp = 0;

    const productMap = {};

    const countryMap = {
      EG: 0,
      US: 0,
      CA: 0,
      PL: 0
    };

    events.forEach(ev => {

      // country tracking
      countryMap[ev.country] = (countryMap[ev.country] || 0) + 1;

      // funnel tracking
      if (ev.type === "click") totalClicks++;
      if (ev.type === "purchase") totalOrders++;
      if (ev.type === "whatsapp") totalWhatsApp++;

      // per product tracking
      if (!productMap[ev.asin]) {
        productMap[ev.asin] = {
          asin: ev.asin,
          clicks: 0,
          orders: 0,
          whatsapp: 0,
        };
      }

      if (ev.type === "click") productMap[ev.asin].clicks++;
      if (ev.type === "purchase") productMap[ev.asin].orders++;
      if (ev.type === "whatsapp") productMap[ev.asin].whatsapp++;
    });

    /* ================= REVENUE ESTIMATION ================= */
    const revenue = totalOrders * 12; // متوسط commission Amazon (تقريبي)

    /* ================= RESPONSE ================= */

    const stats = {
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
        clickToOrderRate: totalClicks ? (totalOrders / totalClicks * 100).toFixed(2) : 0,
        clickToWhatsappRate: totalClicks ? (totalWhatsApp / totalClicks * 100).toFixed(2) : 0
      },

      meta: {
        ga4: GA_MEASUREMENT_ID,
        gtm: GTM_ID,
        generatedAt: new Date().toISOString(),
        mode: "live-ready-structure"
      },

      note:
        "This API is now structured for live tracking. Replace 'events' with Firebase/DB for real-time analytics."
    };

    return res.status(200).json(stats);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Analytics API Error",
      error: error.message,
    });
  }
      }
