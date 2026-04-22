export default function handler(req, res) {
  // ================= METHOD CHECK =================
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
    // ================= DATA =================
    const stats = {
      success: true,
      timestamp: new Date().toISOString(),

      totals: {
        clicks: 205,
        orders: 25,
        whatsapp: 40
      },

      topProducts: [
        {
          asin: "B09V7Z4TJG",
          clicks: 120,
          orders: 15,
          whatsapp: 30
        },
        {
          asin: "B08G9P7N2X",
          clicks: 85,
          orders: 10,
          whatsapp: 20
        }
      ]
    };

    // ================= HEADERS =================
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.setHeader("Content-Type", "application/json");

    return res.status(200).json(stats);

  } catch (error) {
    console.error("Analytics API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
}
