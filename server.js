import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= CONNECT TO MONGO ================= */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch(err => console.log("MongoDB Error:", err));

/* ================= SCHEMA ================= */
const AnalyticsSchema = new mongoose.Schema({
  asin: String,
  click: { type: Number, default: 0 },
  cart: { type: Number, default: 0 },
  whatsapp: { type: Number, default: 0 },
  country: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

const Analytics = mongoose.model("Analytics", AnalyticsSchema);

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
app.get("/analytics", async (req, res) => {
  try {
    const data = await Analytics.find();

    // حساب التوتال لكل نوع حدث
    const totals = { click: 0, cart: 0, whatsapp: 0, conversionRate: 0 };
    const countries = {};
    const topProducts = [];

    data.forEach(doc => {
      totals.click += doc.click;
      totals.cart += doc.cart;
      totals.whatsapp += doc.whatsapp;

      // دمج بيانات الدول
      for (let c in doc.country) {
        countries[c] = (countries[c] || 0) + doc.country[c];
      }

      topProducts.push({
        asin: doc.asin,
        clicks: doc.click,
        cart: doc.cart,
        whatsapp: doc.whatsapp
      });
    });

    // حساب Conversion Rate
    totals.conversionRate = totals.click ? ((totals.whatsapp / totals.click) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      totals,
      countries,
      topProducts
    });

  } catch (err) {
    console.log("Analytics Error:", err);
    res.json({ success: false, totals: {}, countries: {}, topProducts: [] });
  }
});

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("Koloonline SaaS API Running 🚀");
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3000; // Render بيحدد PORT تلقائيًا

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔥`);
});
