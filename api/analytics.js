import mongoose from "mongoose";

// ================= CONNECT =================
const MONGO_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!MONGO_URI) {
    throw new Error("❌ MONGODB_URI not found");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false
    }).then(m => m);
  }

  cached.conn = await cached.promise;
  console.log("✅ Mongo Connected");
  return cached.conn;
}

// ================= SCHEMA =================
const AnalyticsSchema = new mongoose.Schema({
  asin: { type: String, required: true, index: true },
  click: { type: Number, default: 0 },
  cart: { type: Number, default: 0 },
  whatsapp: { type: Number, default: 0 },
  country: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

const Analytics =
  mongoose.models.Analytics ||
  mongoose.model("Analytics", AnalyticsSchema);

// ================= HANDLER =================
export default async function handler(req, res) {
  try {
    await connectDB();

    // ================= POST =================
    if (req.method === "POST") {
      const { asin, type, country } = req.body;

      if (!asin || !type) {
        return res.status(400).json({
          success: false,
          message: "Missing asin or type"
        });
      }

      // العثور على المنتج أو إنشاء جديد
      const doc = await Analytics.findOneAndUpdate(
        { asin },
        {
          $inc: {
            [type]: 1,
            [`country.${country}`]: country ? 1 : 0
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return res.json({ success: true, doc });
    }

    // ================= GET =================
    if (req.method === "GET") {
      const data = await Analytics.find();

      const totals = { click: 0, cart: 0, whatsapp: 0, conversion: 0 };
      const countries = {};
      const topProducts = [];

      data.forEach(doc => {
        totals.click += doc.click;
        totals.cart += doc.cart;
        totals.whatsapp += doc.whatsapp;

        for (let c in doc.country) {
          countries[c] = (countries[c] || 0) + doc.country[c];
        }

        topProducts.push({
          asin: doc.asin,
          clicks: doc.click,
          orders: doc.cart,
          whatsapp: doc.whatsapp
        });
      });

      totals.conversion = totals.click
        ? ((totals.whatsapp / totals.click) * 100).toFixed(2)
        : 0;

      return res.json({
        success: true,
        totals,
        countries,
        topProducts
      });
    }

    // ================= DEFAULT =================
    return res.status(200).send("Koloonline Analytics API Running 🚀");

  } catch (err) {
    console.error("❌ API Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
  }
