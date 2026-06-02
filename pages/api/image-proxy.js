export default async function handler(req, res) {
  try {
    const { url } = req.query;

    /* ================= VALIDATION ================= */
    if (!url || typeof url !== "string") {
      return res.status(400).json({
        error: "Missing or invalid image url",
      });
    }

    /* ================= SECURITY (ALLOWLIST) ================= */
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

    /* ================= DETECT WEBP SUPPORT ================= */
    const accept = req.headers["accept"] || "";
    const supportsWebp = accept.includes("image/webp");

    /* ================= FETCH IMAGE ================= */
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(404).json({
        error: "Image not found",
      });
    }

    let buffer = await response.arrayBuffer();
    let contentType =
      response.headers.get("content-type") || "image/jpeg";

    /* ================= SMART HEADER OPTIMIZATION ================= */
    res.setHeader(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );

    res.setHeader("X-Content-Type-Options", "nosniff");

    /* ================= WEBP OPTIMIZATION ================= */
    if (supportsWebp && contentType.startsWith("image/")) {
      contentType = "image/webp";
      res.setHeader("Content-Type", "image/webp");

      // ملاحظة: هنا ممكن تضيف sharp لتحويل فعلي (upgrade لاحق)
    } else {
      res.setHeader("Content-Type", contentType);
    }

    /* ================= SPEED HEADERS ================= */
    res.setHeader("CDN-Cache-Control", "max-age=31536000");
    res.setHeader("Vary", "Accept");

    return res.send(Buffer.from(buffer));
  } catch (e) {
    return res.status(500).json({
      error: "Smart CDN error",
      message: e.message,
    });
  }
}
