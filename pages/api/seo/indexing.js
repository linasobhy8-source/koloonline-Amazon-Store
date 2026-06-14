import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const url = req.body.url;

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
      scopes: ["https://www.googleapis.com/auth/indexing"],
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

    res.status(200).json(result.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
