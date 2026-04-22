export default function handler(req, res) {
  // السماح فقط بـ GET
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  const products = [
    {
      asin: "B09V7Z4TJG",
      title: "Smart Watch Pro",
      price: 49.99,
      image: "https://m.media-amazon.com/images/I/61IMRs+o0iL._AC_SL1500_.jpg",
      tag: {
        US: "koloonlinesto-20",
        CA: "linasobhy20d8-20",
        EG: "onlinesho0429-20",
        PL: "koloonline-21"
      }
    },
    {
      asin: "B0C4GPPD1H",
      title: "Fitness Tracker",
      price: 39.99,
      image: "https://m.media-amazon.com/images/I/61u48FEs0rL._AC_SL1000_.jpg",
      tag: {
        US: "koloonlinesto-20",
        CA: "linasobhy20d8-20",
        EG: "onlinesho0429-20",
        PL: "koloonline-21"
      }
    }
  ];

  // ✅ جلب asin من الرابط
  const { asin } = req.query;

  // ✅ لو فيه asin → رجّع منتج واحد
  if (asin) {
    const product = products.find(p => p.asin === asin);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      product
    });
  }

  // ✅ لو مفيش asin → رجّع كل المنتجات
  return res.status(200).json({
    success: true,
    count: products.length,
    products
  });
}
