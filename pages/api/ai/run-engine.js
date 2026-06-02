import { autonomousRevenueEngine } from "../../../lib/ai/autonomousRevenueEngine";

export default async function handler(req, res) {
  // ================= METHOD GUARD =================
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    // ================= ENGINE RUN =================
    const result = await autonomousRevenueEngine();

    return res.status(200).json({
      success: true,
      result,
      meta: {
        level: 20,
        architecture: "stable-import-system",
        timestamp: Date.now(),
      },
    });

  } catch (e) {
    console.error("AI ENGINE ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e?.message || "Unknown error",
    });
  }
}
