import mongoose from "mongoose";

// ================= CONNECT TO MONGODB =================
const MONGO_URI = process.env.MONGODB_URI;

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  if (!MONGO_URI) {
    throw new Error("❌ MONGODB_URI is not defined");
  }

  await mongoose.connect(MONGO_URI);
  isConnected = true;
  console.log("✅ MongoDB Connected");
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
  await connectDB();

  // ================= TRACK =================
  if (req.method === "POST") {
    try {
      const { asin, type, country } = req.body;

      if (!asin || !type) {
        return res.status(400).json({
          success: false,
          message: "Missing asin or type"
        });
      }

      let doc = await Analytics.findOne({ asin });

      if (!doc) {
        doc = new Analytics({ asin });
      }

      if (["click", "cart", "whatsapp"].includes(type)) {
        doc[type] += 1;
      }

      if (country) {
        doc.country[country] = (doc.country[country] || 0) + 1;
      }

      await doc.save();

      return res.json({ success: true });

    } catch (err) {
      console.error("❌ Track Error:", err);
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

  // ================= ANALYTICS =================
  if (req.method === "GET") {
    try {
      const data = await Analytics.find();

      const totals = {
        click: 0,
        cart: 0,
        whatsapp: 0,
        conversion: 0
      };

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

    } catch (err) {
      console.error("❌ Analytics Error:", err);
      return res.status(500).json({
        success: false,
        totals: {},
        countries: {},
        topProducts: []
      });
    }
  }

  // ================= DEFAULT =================
  return res.status(200).send("Koloonline API Running 🚀");
        }
