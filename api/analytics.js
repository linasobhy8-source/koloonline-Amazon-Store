export default function handler(req, res) {
  res.status(200).json({
    success: true,
    totalClicks: 205,
    totalOrders: 25,
    totalWhatsApp: 40,
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
  });
}
