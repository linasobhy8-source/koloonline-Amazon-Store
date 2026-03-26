import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

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
app.get("/stats", async (req, res) => {
  try {
    const all = await Analytics.find();

    const totals = { clicks: 0, cart: 0, whatsapp: 0 };
    const countries = {};
    const topProducts = [];

    all.forEach(doc => {
      totals.clicks += doc.click;
      totals.cart += doc.cart;
      totals.whatsapp += doc.whatsapp;

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

    // احسبي Conversion Rate لكل منتج
    topProducts.forEach(p => {
      p.conversionRate = p.clicks ? ((p.whatsapp / p.clicks) * 100).toFixed(2) : 0;
    });

    res.json({ success: true, totals, countries, topProducts });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => res.send("Koloonline SaaS API Running 🚀"));

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT} 🔥`));
