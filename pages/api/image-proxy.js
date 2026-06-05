import sharp from "sharp";

/* ================= EDGE IMAGE CDN PROXY ================= */
export default async function handler(req, res) {
  try {
    const { url, w = 500, q = 75 } = req.query;

    /* ================= VALIDATION ================= */
    if (!url || typeof url !== "string") {
      return res.status(400).json({
        error: "Missing image url",
      });
    }

    /* ================= SECURITY WHITELIST ================= */
    const allowedDomains = [
      "m.media-amazon.com",
      "images-na.ssl-images-amazon.com",
      "amazon",
      "googleusercontent.com",
      "firebaseapp.com",
      "via.placeholder.com",
    ];

    const isAllowed = allowedDomains.some((domain) =>
      url.includes(domain)
    );

    if (!isAllowed) {
      return res.status(403).json({
        error: "Domain not allowed",
      });
    }

    /* ================= FETCH IMAGE ================= */
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Koloonline-CDN-Bot",
      },
    });

    if (!response.ok) {
      return res.status(404).json({
        error: "Image not found",
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    /* ================= FORMAT DETECTION ================= */
    const accept = req.headers["accept"] || "";
    const useWebp = accept.includes("image/webp");

    /* ================= IMAGE OPTIMIZATION ================= */
    const optimizedBuffer = await sharp(buffer)
      .resize({
        width: Number(w),
        fit: "inside",
        withoutEnlargement: true,
      })
      .toFormat(useWebp ? "webp" : "jpeg", {
        quality: Number(q),
        progressive: true,
      })
      .toBuffer();

    /* ================= HEADERS (CRITICAL FOR SPEED) ================= */
    res.setHeader(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );

    res.setHeader(
      "Content-Type",
      useWebp ? "image/webp" : "image/jpeg"
    );

    res.setHeader("Vary", "Accept");

    res.setHeader("X-Content-Type-Options", "nosniff");

    res.setHeader("X-Optimized-By", "Koloonline-CDN-Pro");

    /* ================= RESPONSE ================= */
    return res.status(200).send(optimizedBuffer);
  } catch (error) {
    console.error("CDN ERROR:", error);

    return res.status(500).json({
      error: "CDN PRO error",
      message: error.message,
    });
  }
          }
