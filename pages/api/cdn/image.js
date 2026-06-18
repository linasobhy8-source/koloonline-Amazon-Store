import sharp from "sharp";

/* ================= AI SCORING ================= */
function getImagePriority(url = "") {
  let score = 1;

  if (url.includes("m.media-amazon.com")) score += 3;
  if (url.includes("images")) score += 1;
  if (url.includes("placeholder")) score -= 1;

  return score;
}

/* ================= IMAGE CDN ================= */
export default async function handler(req, res) {
  try {
    const { url, w = 500, q = 75, priority = "normal" } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing image url" });
    }

    /* ================= URL VALIDATION ================= */
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL" });
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return res.status(400).json({ error: "Invalid protocol" });
    }

    const allowed = [
      "m.media-amazon.com",
      "images-na.ssl-images-amazon.com",
      "amazon",
      "googleusercontent.com",
      "firebaseapp.com",
      "via.placeholder.com",
    ];

    if (!allowed.some((d) => parsed.hostname.includes(d))) {
      return res.status(403).json({ error: "Domain not allowed" });
    }

    /* ================= FETCH IMAGE ================= */
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(404).json({ error: "Image not found" });
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    /* ================= AI PRIORITY ================= */
    const aiScore = getImagePriority(url);

    const finalWidth =
      priority === "high"
        ? Math.min(Number(w) * 1.5, 1200)
        : Number(w);

    const quality = aiScore > 3 ? 85 : Number(q);

    /* ================= PROCESS ================= */
    const output = await sharp(buffer)
      .resize({
        width: finalWidth,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();

    /* ================= HEADERS ================= */
    res.setHeader("Content-Type", "image/webp");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Vary", "Accept");
    res.setHeader("X-AI-CDN", "Koloonline-v4");

    return res.status(200).send(output);
  } catch (e) {
    console.error("CDN ERROR:", e);

    return res.status(500).json({
      error: "AI CDN error",
      message: e.message,
    });
  }
}
