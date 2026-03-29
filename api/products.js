// pages/api/products.js
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("koloonline"); // اسم قاعدة البيانات
    const collection = db.collection("products"); // اسم مجموعة المنتجات

    // اختياري: اختيار الدولة لتحديد رابط الأفلييت
    const country = req.query.country || "EG";

    // جلب كل المنتجات من MongoDB
    const products = await collection.find({}).toArray();

    // تعديل رابط الأفلييت حسب الدولة
    const mappedProducts = products.map(product => {
      product.link = `https://www.amazon.${country.toLowerCase()}/dp/${product.asin}?tag=${product.affiliate[country] || product.affiliate.EG}`;
      return product;
    });

    // تصنيف حسب ربحية العمولة + التقييم + الأولوية
    const sorted = mappedProducts.sort((a, b) => {
      const scoreA = (a.affiliateRate * 100) + (a.rating * 10) + a.priority;
      const scoreB = (b.affiliateRate * 100) + (b.rating * 10) + b.priority;
      return scoreB - scoreA;
    });

    res.status(200).json({
      success: true,
      total: sorted.length,
      products: sorted
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  } finally {
    await client.close();
  }
        }
