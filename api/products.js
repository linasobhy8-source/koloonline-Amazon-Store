// api/products.js

export default function handler(req, res) {
  try {
    // ================= COUNTRY =================
    const country = (req.query.country || "us").toLowerCase();

    // ================= AFFILIATE TAGS =================
    const affiliateTags = {
      us: "koloonlinesto-20",
      ca: "onlinesho0429-20",
      pl: "koloonline-21",
      eg: "onlinesh03f31-21"
    };

    // ================= DOMAIN =================
    let domain = "com";
    if (country === "eg") domain = "eg";
    else if (country === "ca") domain = "ca";
    else if (country === "pl") domain = "pl";

    // ================= PRODUCTS =================
    const products = [
      {
        id: 1,
        title: "سماعة Anker مكبر الصوت",
        name: "سماعة Anker مكبر الصوت",
        image: "https://m.media-amazon.com/images/I/71tV4O0rO0L._AC_SL1500_.jpg",
        asin: "B07ZNT7PRL",
        rating: 4.5,
        priority: 5,
        affiliateRate: 0.08
      },
      {
        id: 2,
        title: "سكين HOSHANHO",
        name: "سكين HOSHANHO",
        image: "https://m.media-amazon.com/images/I/81pZ9n52llL._AC_SL1500_.jpg",
        asin: "B0CKMF6GPZ",
        rating: 4.2,
        priority: 4,
        affiliateRate: 0.07
      }
    ];

    // ================= MAP LINK =================
    const mapped = products.map(p => ({
      ...p,
      link: `https://www.amazon.${domain}/dp/${p.asin}?tag=${affiliateTags[country] || affiliateTags.us}`
    }));

    // ================= SORT =================
    const sorted = mapped.sort((a, b) => {
      const scoreA = a.affiliateRate * 100 + a.rating * 10 + a.priority;
      const scoreB = b.affiliateRate * 100 + b.rating * 10 + b.priority;
      return scoreB - scoreA;
    });

    // ================= RESPONSE =================
    res.status(200).json({
      success: true,
      country,
      total: sorted.length,
      products: sorted
    });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
