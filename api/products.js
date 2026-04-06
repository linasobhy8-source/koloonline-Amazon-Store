export default function handler(req, res) {
  // تحديد الدولة (افتراضي US)
  const country = (req.query.country || "us").toLowerCase();

  // Affiliate Tags لكل دولة
  const affiliateTags = {
    us: "koloonlinesto-20",
    ca: "onlinesho0429-20",
    pl: "koloonline-21",
    eg: "onlinesh03f31-21"
  };

  // تحديد الدومين حسب الدولة
  const domain = country === "eg" ? "eg" :
                 country === "pl" ? "pl" :
                 country === "ca" ? "ca" : "com";

  // قائمة المنتجات
  const products = [
    {
      id: 1,
      title: "سماعة Anker مكبر الصوت",
      image: "https://m.media-amazon.com/images/I/71tV4O0rO0L._AC_SL1500_.jpg",
      asin: "B07ZNT7PRL",
      rating: 4.5,
      priority: 5,
      affiliateRate: 0.08
    },
    {
      id: 2,
      title: "سكين HOSHANHO",
      image: "https://m.media-amazon.com/images/I/81pZ9n52llL._AC_SL1500_.jpg",
      asin: "B0CKMF6GPZ",
      rating: 4.2,
      priority: 4,
      affiliateRate: 0.07
    }
  ];

  // إنشاء روابط الأفلييت لكل منتج
  const mapped = products.map(p => ({
    ...p,
    link: `https://www.amazon.${domain}/dp/${p.asin}?tag=${affiliateTags[country] || affiliateTags.us}`
  }));

  // ترتيب المنتجات حسب: affiliateRate * 100 + rating * 10 + priority
  const sorted = mapped.sort((a, b) =>
    (b.affiliateRate * 100 + b.rating * 10 + b.priority) -
    (a.affiliateRate * 100 + a.rating * 10 + a.priority)
  );

  // إرجاع JSON جاهز للواجهة
  res.status(200).json({
    success: true,
    country,
    total: sorted.length,
    products: sorted
  });
}
