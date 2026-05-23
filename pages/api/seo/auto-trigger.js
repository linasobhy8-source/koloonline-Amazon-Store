export default async function handler(req, res) {
  try {
    const baseUrl = "https://koloonline.online/api/seo/os-core";

    /* ================= AUTO RUN ================= */
    await fetch(`${baseUrl}?mode=full`);

    return res.status(200).json({
      success: true,
      message: "Auto SEO triggered",
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
