export default function handler(req, res) {

  // تحديد الدولة (افتراضي us)
  const country = (req.query.country || "us").toLowerCase();

  // Affiliate tags لكل دولة
  const affiliateTags = {
    us: "koloonlinesto-20",
    ca: "onlinesho0429-20",
    pl: "koloonline-21",
    eg: "onlinesh03f31-21"
  };

  // تحديد الدومين الصحيح لأمازون
  const domain =
    country === "eg" ? "eg" :
    country === "pl" ? "pl" :
    country === "ca" ? "ca" :
    "com";

  // المنتجات (مؤقتة - بدل MongoDB)
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

  // إضافة رابط الأفلييت
  const mappedProducts = products.map(product => ({
    ...product,
    link: `https://www.amazon.${domain}/dp/${product.asin}?tag=${affiliateTags[country] || affiliateTags.us}`
  }));

  // ترتيب المنتجات حسب الربحية + التقييم + الأولوية
  const sortedProducts = mappedProducts.sort((a, b) => {
    const scoreA = (a.affiliateRate * 100) + (a.rating * 10) + a.priority;
    const scoreB = (b.affiliateRate * 100) + (b.rating * 10) + b.priority;
    return scoreB - scoreA;
  });

  // الرد النهائي
  res.status(200).json({
    success: true,
    country: country,
    total: sortedProducts.length,
    products: sortedProducts
  });
}
