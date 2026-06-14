const baseUrl = "https://koloonline.online";

export default async function handler(req, res) {
  try {
    const googlePing = await fetch(
      `https://www.google.com/ping?sitemap=${baseUrl}/sitemap.xml`
    );

    const bingPing = await fetch(
      `https://www.bing.com/ping?sitemap=${baseUrl}/sitemap.xml`
    );

    res.status(200).json({
      google: googlePing.status,
      bing: bingPing.status,
    });
  } catch (e) {
    res.status(500).json({ error: "ping failed" });
  }
}
