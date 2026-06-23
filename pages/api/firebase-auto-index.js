export default async function handler(req, res) {
  try {
    // 🔥 منع أي method غير GET (Firewall بسيط)
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Method Not Allowed",
      });
    }

    // 🔥 هنا ممكن تضيف أي Firebase logic لاحقًا بأمان
    // (لكن حالياً بدون أي عمليات ثقيلة عشان ما تكسرش build)

    return res.status(200).json({
      success: true,
      service: "firebase-auto-index",
      status: "active",
      timestamp: Date.now(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
