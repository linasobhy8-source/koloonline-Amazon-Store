export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const { url } = req.body || {};

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT;

    if (!serviceAccount) {
      return res.status(500).json({
        success: false,
        message: "Missing GOOGLE_SERVICE_ACCOUNT",
      });
    }

    let credentials;
    try {
      credentials = JSON.parse(serviceAccount);
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Invalid GOOGLE_SERVICE_ACCOUNT JSON",
      });
    }

    // 🔥 Dynamic import بطريقة آمنة 100%
    const googleapis = await import("googleapis");
    const google = googleapis.google;

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        "https://www.googleapis.com/auth/indexing",
      ],
    });

    const client = await auth.getClient();

    const indexing = google.indexing({
      version: "v3",
      auth: client,
    });

    const result = await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type: "URL_UPDATED",
      },
    });

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Indexing Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Indexing failed",
    });
  }
}
