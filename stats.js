export default function handler(req, res) {
  try {
    // بيانات إحصائيات لكل منتج باستخدام ASIN
    const stats = {
      "B09V7Z4TJG": {
        clicks: 120,
        orders: 15,
        whatsapp: 30
      },
      "B08G9P7N2X": {
        clicks: 85,
        orders: 10,
        whatsapp: 20
      }
    };

    res.status(200).json({
      success: true,
      stats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
}
