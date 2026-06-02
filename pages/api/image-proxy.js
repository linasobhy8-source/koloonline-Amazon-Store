import sharp from "sharp";

export default async function handler(req, res) {
  try {
    const { url, w = 500, q = 75 } = req.query;

    /* ================= VALIDATION ================= */
    if (!url) {
      return res.status(400).json({
        error: "Missing image url",
      });
    }

    /* ================= SECURITY ================= */
    const allowed = [
      "m.media-amazon.com",
      "images-na.ssl-images-amazon.com",
      "amazon",
      "googleusercontent.com",
      "firebaseapp.com",
      "via.placeholder.com",
    ];

    if (!allowed.some((d) => url.includes(d))) {
      return res.status(403).json({
        error: "Domain not allowed",
      });
    }

    /* ================= FETCH IMAGE ================= */
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(404).json({
        error: "Image not found",
      });
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    /* ================= DETECT FORMAT ================= */
    const accept = req.headers["accept"] || "";
    const useWebp = accept.includes("image/webp");

    /* ================= IMAGE PROCESSING (SHARP) ================= */
    let image = sharp(buffer)
      .resize(Number(w)) // resize حسب الطلب
      .toFormat(useWebp ? "webp" : "jpeg", {
        quality: Number(q),
      });

    const outputBuffer = await image.toBuffer();

    /* ================= HEADERS ================= */
    res.setHeader(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );

    res.setHeader("Content-Type", useWebp ? "image/webp" : "image/jpeg");

    res.setHeader("Vary", "Accept");

    res.setHeader("X-Optimized-By", "Koloonline-CDN-Pro");

    return res.send(outputBuffer);
  } catch (e) {
    return res.status(500).json({
      error: "CDN PRO error",
      message: e.message,
    });
  }
}
