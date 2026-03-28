import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

linasobhy8-source-patch-1
/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= CONNECT MONGO ================= */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch(err => console.log("MongoDB Error:", err));

/* ================= SCHEMA ================= */
const AnalyticsSchema = new mongoose.Schema({
  asin: String,

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= CONNECT TO MONGODB =================
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI is not defined");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected 🚀"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ================= SCHEMA =================
const AnalyticsSchema = new mongoose.Schema({
  asin: { type: String, required: true, index: true },
main
  click: { type: Number, default: 0 },
  cart: { type: Number, default: 0 },
  whatsapp: { type: Number, default: 0 },
  country: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

const Analytics = mongoose.model("Analytics", AnalyticsSchema);

linasobhy8-source-patch-1
/* ================= TRACK EVENT ================= */
app.post("/track", async (req, res) => {
  try {
    const { asin, type, country } = req.body;
    if (!asin || !type) return res.json({ success: false, message: "Missing data" });

    let doc = await Analytics.findOne({ asin });
    if (!doc) doc = new Analytics({ asin });

    if (["click", "cart", "whatsapp"].includes(type)) doc[type] += 1;
    if (country) doc.country[country] = (doc.country[country] || 0) + 1;

    await doc.save();
    res.json({ success: true });
  } catch (err) {
    console.log("Track Error:", err);
    res.json({ success: false });
  }
});

/* ================= DASHBOARD API ================= */
app.get("/stats", async (req, res) => {
  try {
    const all = await Analytics.find();

    const totals = { clicks: 0, cart: 0, whatsapp: 0 };
    const countries = {};
    const topProducts = [];

    all.forEach(doc => {
      totals.clicks += doc.click;
      totals.cart += doc.cart;
      totals.whatsapp += doc.whatsapp
// ================= TRACK EVENT =================
app.post("/track", async (req, res) => {
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

    // زيادة القيم
    if (["click", "cart", "whatsapp"].includes(type)) {
      doc[type] += 1;
    }

    // الدول
    if (country) {
      doc.country[country] = (doc.country[country] || 0) + 1;
    }

    await doc.save();

    res.json({ success: true });

  } catch (err) {
    console.error("❌ Track Error:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ================= ANALYTICS =================
app.get("/analytics", async (req, res) => {
  try {
    const data = await Analytics.find();

    const totals = {
      click: 0,
      cart: 0,
      whatsapp: 0,
      buy: 0,
      conversion: 0
    };

    const countries = {};
    const topProducts = [];

    data.forEach(doc => {
      totals.click += doc.click;
      totals.cart += doc.cart;
      totals.whatsapp += doc.whatsapp;

      // تجميع الدول
main
      for (let c in doc.country) {
        countries[c] = (countries[c] || 0) + doc.country[c];
      }

      topProducts.push({
        asin: doc.asin,
        clicks: doc.click,
 linasobhy8-source-patch-1
        cart: doc.cart,
=======
        orders: doc.cart main
        whatsapp: doc.whatsapp
      });
    });

 linasobhy8-source-patch-1
    topProducts.forEach(p => {
      p.conversionRate = p.clicks ? ((p.whatsapp / p.clicks) * 100).toFixed(2) : 0;
    });

    res.json({ success: true, totals, countries, topProducts });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

/* ============= HEALTH CHECK ================= */
app.get("/", (req, res) => res.send("Koloonline SaaS API Running 🚀"));

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT} 🔥`));
=======
    // Conversion Rate
    totals.conversion = totals.click
      ? ((totals.whatsapp / totals.click) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      totals,
      countries,
      topProducts
    });

  } catch (err) {
    console.error("❌ Analytics Error:", err);
    res.status(500).json({
      success: false,
      totals: {},
      countries: {},
      topProducts: []
    });
  }
});

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("Koloonline SaaS API Running 🚀");
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
main
