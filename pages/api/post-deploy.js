export default async function handler(req, res) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://koloonline.online";

  /* ================= ADSENSE-FRIENDLY DESCRIPTION ================= */
  const seoDescription =
    "Simple SEO ping system to notify search engines about updated content for faster indexing and improved organic visibility.";

  try {
    console.log("🚀 SEO Ping Started");

    /* ================= GOOGLE PING ================= */
    await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(
        `${baseUrl}/sitemap.xml`
      )}`
    );

    /* ================= INDEXNOW PING ================= */
    await fetch(`${baseUrl}/api/indexnow`, {
      method: "GET",
    });

    console.log("✅ SEO Ping Completed");

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "SEO ping completed successfully",

      seoDescription,
      sitemap: `${baseUrl}/sitemap.xml`,
      intent:
        "Notify search engines about updated content for faster indexing.",
    });
  } catch (err) {
    console.error("❌ SEO Ping Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message || "Unknown error",
    });
  }
}
