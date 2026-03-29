// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// تحديد مسار ملفات الموقع
const publicPath = path.join(__dirname, "public");

// عرض الملفات الثابتة
app.use(express.static(publicPath));

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// fallback لأي route
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
