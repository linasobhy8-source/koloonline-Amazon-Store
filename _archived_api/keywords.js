export default function handler(req, res) {
  const keywords = [
    "best amazon products 2026",
    "viral gadgets tiktok",
    "cheap tech under 50",
    "best headphones budget",
    "amazon must have items",
    "smart home devices alexa",
    "iphone accessories usb c",
    "gaming setup accessories",
  ];

  const shuffled = keywords.sort(() => 0.5 - Math.random());

  res.status(200).json({
    success: true,
    keywords: shuffled.slice(0, 5),
  });
}
