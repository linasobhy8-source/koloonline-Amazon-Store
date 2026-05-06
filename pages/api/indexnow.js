export default async function handler(req, res) {
  try {
    const key = process.env.INDEXNOW_KEY;

    const urls = [
      "https://koloonline.online",
      "https://koloonline.online/categories",
      "https://koloonline.online/search",
    ];

    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "koloonline.online",
        key,
        urlList: urls,
      }),
    });

    console.log("⚡ IndexNow Ping Sent");

    return res.status(200).json({ success: true });
  } catch (e) {
    console.log("IndexNow Error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
