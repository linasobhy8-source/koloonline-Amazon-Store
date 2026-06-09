import sharp from "sharp";

/* ================= CONFIG ================= */
const ALLOWED_HOSTS = [
  "m.media-amazon.com",
  "images-na.ssl-images-amazon.com",
  "lh3.googleusercontent.com",
  "firebasestorage.googleapis.com",
  "via.placeholder.com",
];

/* ================= IMAGE CDN PROXY ================= */
export default async function handler(req, res) {
  try {
    const {
      url,
      w = "500",
      q = "75",
    } = req.query;

    /* ================= VALIDATION ================= */
    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        error: "Missing image url",
      });
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        error: "Invalid image url",
      });
    }

    /* ================= HOST WHITELIST ================= */
    const allowed = ALLOWED_HOSTS.some(
      (host) =>
        parsedUrl.hostname === host ||
        parsedUrl.hostname.endsWith(`.${host}`)
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        error: "Domain not allowed",
      });
    }

    /* ================= SIZE LIMIT ================= */
    const width = Math.min(
      Math.max(parseInt(w, 10) || 500, 100),
      1200
    );

    const quality = Math.min(
      Math.max(parseInt(q, 10) || 75, 40),
      90
    );

    /* ================= CACHE ================= */
    res.setHeader(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );

    /* ================= FETCH IMAGE ================= */
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Koloonline-CDN",
        Accept: "image/*",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(404).json({
        success: false,
        error: "Image not found",
      });
    }

    const buffer = Buffer.from(
      await response.arrayBuffer()
    );

    /* ================= FORMAT ================= */
    const accept = req.headers.accept || "";

    const supportsAvif = accept.includes("image/avif");
    const supportsWebp = accept.includes("image/webp");

    let outputBuffer;
    let contentType;

    const pipeline = sharp(buffer)
      .rotate()
      .resize({
        width,
        fit: "inside",
        withoutEnlargement: true,
      });

    if (supportsAvif) {
      outputBuffer = await pipeline
        .avif({ quality })
        .toBuffer();

      contentType = "image/avif";
    } else if (supportsWebp) {
      outputBuffer = await pipeline
        .webp({ quality })
        .toBuffer();

      contentType = "image/webp";
    } else {
      outputBuffer = await pipeline
        .jpeg({ quality })
        .toBuffer();

      contentType = "image/jpeg";
    }

    /* ================= HEADERS ================= */
    res.setHeader("Content-Type", contentType);
    res.setHeader("Vary", "Accept");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Optimized-By", "Koloonline-CDN");

    return res.status(200).send(outputBuffer);

  } catch (error) {
    console.error("CDN ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Image optimization failed",
    });
  }
                  }
