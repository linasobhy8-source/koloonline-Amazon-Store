export default async function handler(req, res) {
  /* ================= METHOD SAFETY ================= */
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  /* ================= DISABLED FEATURE RESPONSE ================= */
  return res.status(200).json({
    success: false,
    disabled: true,
    message: "generate-blog is temporarily disabled",
    timestamp: Date.now(),
  });
}
