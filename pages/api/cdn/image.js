import sharp from "sharp";

/* ================= GLOBAL CACHE ================= */
const cache = global.__IMG_CACHE__ || new Map();
global.__IMG_CACHE__ = cache;

/* ================= AI SCORING ================= */
function getImagePriority(url = "") {
  let score = 1;

  // Amazon images أهم
  if (url.includes("m.media-amazon.com")) score += 3;

  // product images
  if (url.includes("images")) score += 1;

  // fallback images أقل أهمية
  if (url.includes("placeholder")) score -= 1;

  return score;
}

export default async function handler(req, res) {
  try {
    const { url, w = 500, q = 75, priority = "normal" } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Missing image url" });
    }

    /* ================= CACHE KEY ================= */
    const key = `${url}-${w}-${q}`;

    if (cache.has(key)) {
      const cached = cache.get(key);

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

    const buffer = Buffer.from(await response.arrayBuffer());

    /* ================= AI PRIORITY BOOST ================= */
    const aiScore = getImagePriority(url);

    const finalWidth =
      priority === "high"
        ? Math.min(Number(w) * 1.5, 1200)
        : Number(w);

    const quality = aiScore > 3 ? 85 : Number(q);

    /* ================= IMAGE OPTIMIZATION ================= */
    const output = await sharp(buffer)
      .resize(finalWidth)
      .toFormat("webp", {
        quality,
      })
      .toBuffer();

    /* ================= CACHE STORE ================= */
    cache.set(key, {
      buffer: output,
      type: "image/webp",
    });

    /* ================= HEADERS ================= */
    res.setHeader("Content-Type", "image/webp");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Vary", "Accept");
    res.setHeader("X-AI-CDN", "Koloonline-v4");

    return res.send(output);
  } catch (e) {
    return res.status(500).json({
      error: "AI CDN error",
      message: e.message,
    });
  }
      }
