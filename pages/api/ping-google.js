export default async function handler(req, res) {
  const url = "https://koloonline.online/sitemap.xml";

  await fetch(
    `https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`
  );

  res.json({ success: true });
}
