export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online";

    // Ping Google
    await fetch(
      `https://www.google.com/ping?sitemap=${baseUrl}/sitemap.xml`
    );

    // Ping IndexNow
    await fetch(`${baseUrl}/api/indexnow`);

    return res.status(200).json({
      success: true,
      message: "SEO ping completed",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
