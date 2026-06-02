export default async function handler(req, res) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      return res.status(500).json({
        success: false,
        error: "Missing NEXT_PUBLIC_BASE_URL",
      });
    }

    /* ================= FETCH WITH SAFE URL ================= */
    const url = `${baseUrl}/api/system?action=trending`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: "Upstream API error",
      });
    }

    const data = await response.json();

    return res.status(200).json({
      ...data,
      description:
        "This endpoint acts as a safe proxy to retrieve trending data from the internal system and deliver it in a structured format for frontend use.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
