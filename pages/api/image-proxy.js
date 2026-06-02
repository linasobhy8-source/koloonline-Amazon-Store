export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Missing image url" });
    }

    // Fetch image from Amazon or any source
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(404).json({ error: "Image not found" });
    }

    const contentType = response.headers.get("content-type");

    res.setHeader("Content-Type", contentType || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");

    const buffer = await response.arrayBuffer();

    res.send(Buffer.from(buffer));

  } catch (e) {
    res.status(500).json({ error: "Proxy error" });
  }
}
