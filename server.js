import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= CONNECT DB ================= */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch(err => console.log(err));

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

/* ================= TRACK ================= */
app.post("/track", async (req, res) => {
  try {
    const { asin, type, country } = req.body;

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

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

/* ================= DASHBOARD ================= */
app.get("/analytics", async (req, res) => {
  const data = await Analytics.find();
  res.json(data);
});

/* ================= START ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));
