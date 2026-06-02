import sharp from "sharp";

/* ================= SIMPLE MEMORY CACHE ================= */
const cache = new Map();

export default async function handler(req, res) {
  try {
    const { url, w = 500, q = 75 } = req.query;

    /* ================= VALIDATION ================= */
    if (!url) {
      return res.status(400).json({ error: "Missing image url" });
    }

    /* ================= CACHE KEY ================= */
    const cacheKey = `${url}-${w}-${q}`;

    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);

      res.setHeader("Content-Type", cached.type);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

      return res.send(cached.buffer);
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
      return res.status(403).json({ error: "Domain not allowed" });
    }

    /* ================= FETCH IMAGE ================= */
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(404).json({ error: "Image not found" });
    }

    const inputBuffer = Buffer.from(await response.arrayBuffer());

    /* ================= DEVICE OPTIMIZATION ================= */
    const accept = req.headers["accept"] || "";
    const useWebp = accept.includes("image/webp");

    const width = parseInt(w);

    /* ================= IMAGE PROCESSING ================= */
    const outputBuffer = await sharp(inputBuffer)
      .resize(width) // responsive resize
      .toFormat(useWebp ? "webp" : "jpeg", {
        quality: parseInt(q),
      })
      .toBuffer();

    const contentType = useWebp ? "image/webp" : "image/jpeg";

    /* ================= STORE IN CACHE ================= */
    cache.set(cacheKey, {
      buffer: outputBuffer,
      type: contentType,
    });

    /* ================= RESPONSE HEADERS ================= */
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
    res.setHeader("Vary", "Accept");
    res.setHeader("X-CDN-Engine", "Koloonline-Pro-v3");

    return res.send(outputBuffer);
  } catch (e) {
    return res.status(500).json({
      error: "CDN Engine Error",
      message: e.message,
    });
  }
}
