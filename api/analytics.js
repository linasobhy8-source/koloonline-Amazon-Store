export default async function handler(req, res) {
  try {
    const GA_MEASUREMENT_ID = "G-YS8L61XLPR";
    const GTM_ID = "GTM-KNQM8KBN";

    const stats = {
      success: true,

      overview: {
        totalClicks: 205,
        totalOrders: 25,
        totalWhatsApp: 40,
      },

      topProducts: [
        {
          asin: "B09V7Z4TJG",
          clicks: 120,
          orders: 15,
          whatsapp: 30,
        },
        {
          asin: "B08G9P7N2X",
          clicks: 85,
          orders: 10,
          whatsapp: 20,
        },
      ],

      meta: {
        ga4: GA_MEASUREMENT_ID,
        gtm: GTM_ID,
        generatedAt: new Date().toISOString(),
      },

      note:
        "This endpoint is a mock analytics layer and should be connected to real tracking (GA4 / GTM / DB).",
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
