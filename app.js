const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// صفحة رئيسية
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// صفحات المنتجات ديناميك
app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  res.sendFile(path.join(__dirname, `public/products/${productId}.html`));
});

// صفحة اتصل بنا
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public/contact.html"));
});

// صفحة من نحن
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public/about.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
