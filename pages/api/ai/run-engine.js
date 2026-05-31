import { autonomousRevenueEngine } from "@/lib/ai/autonomousRevenueEngine";

export default async function handler(req, res) {
  try {
    const result = await autonomousRevenueEngine();

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
