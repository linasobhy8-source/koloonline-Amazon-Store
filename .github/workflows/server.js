// server.js
const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ملفات الـ static (HTML, CSS, JS, assets)
app.use(express.static(path.join(__dirname, "public")));

// جميع الطلبات الأخرى ترجع index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// بدء السيرفر
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
