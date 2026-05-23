import autoGenerate from "./auto-create-page";
import syncProducts from "./sync-products";
import trending from "./trending";
import indexNow from "./indexnow";
import autoPublish from "./auto-publish";

export default async function handler(req, res) {
  try {
    await Promise.all([
      autoGenerate(req, res),
      syncProducts(req, res),
      trending(req, res),
      indexNow(req, res),
      autoPublish(req, res),
    ]);

    return res.status(200).json({
      success: true,
      message: "🔥 Master pipeline executed successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
