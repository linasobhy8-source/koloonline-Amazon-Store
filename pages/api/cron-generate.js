export default async function handler(req, res) {
  try {
    const keywords = [
      "best amazon gadgets",
      "viral tiktok products",
      "cheap amazon finds",
      "gaming accessories",
      "smart home devices",
    ];

    const random =
      keywords[Math.floor(Math.random() * keywords.length)];

    await fetch("https://koloonline.online/api/generate-blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keyword: random,
      }),
    });

    return res.status(200).json({
      success: true,
      generated: random,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
