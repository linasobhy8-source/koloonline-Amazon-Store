<!DOCTYPE html>
<html lang="ar">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Koloonline Products</title>

<style>
body { font-family: Arial; margin:0; background:#f5f5f5; }

/* HEADER */
header {
  background:#232f3e;
  color:#fff;
  padding:15px;
  text-align:center;
  font-size:22px;
}

/* NAVBAR */
.navbar {
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
  gap:10px;
  background:#37475a;
  padding:10px;
}
.navbar a {
  color:#fff;
  text-decoration:none;
  padding:8px 12px;
  border-radius:6px;
  font-weight:bold;
}
.navbar a:hover { background:#e68a00; }
.navbar a.active { background:#ff9900; }

/* CONTAINER */
.container { padding:20px; }

/* PRODUCTS */
#product-container {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
  gap:20px;
}

.product {
  background:#fff;
  padding:15px;
  border-radius:10px;
  box-shadow:0 2px 10px rgba(0,0,0,0.1);
  text-align:center;
}
.product img { height:180px; object-fit:contain; }
.product a {
  display:block;
  margin-top:10px;
  background:#ff9900;
  padding:8px;
  color:#fff;
  border-radius:6px;
  text-decoration:none;
}
.product button {
  margin-top:8px;
  width:100%;
  padding:8px;
  background:#25D366;
  border:none;
  color:#fff;
  border-radius:6px;
}

/* FILTER */
.filters {
  text-align:center;
  margin-bottom:20px;
}
.filters button {
  margin:5px;
  padding:8px 12px;
  border:none;
  background:#232f3e;
  color:#fff;
  border-radius:6px;
}

/* FAQ */
.faq { margin-top:30px; }
.faq p {
  background:#fff;
  padding:10px;
  border-radius:6px;
  margin-bottom:10px;
}

/* WHATSAPP FLOAT */
.whatsapp-float {
  position:fixed;
  bottom:20px;
  right:20px;
  background:#25D366;
  color:#fff;
  padding:12px 15px;
  border-radius:50px;
  text-decoration:none;
  font-weight:bold;
}

/* MOBILE */
@media(max-width:600px){
  .navbar { flex-direction:column; align-items:center; }
}
</style>
</head>

<body>

<header>🔥 Koloonline Store</header>

<!-- NAVBAR -->
<nav class="navbar">
  <a href="/">🏠 الرئيسية</a>
  <a href="/products">📦 المنتجات</a>
  <a href="/cart">🛒 السلة</a>
  <a href="/blog">📰 المدونة</a>
  <a href="/contact">✉️ اتصل بنا</a>
  <a href="/dashboard">📊 لوحة التحكم</a>
</nav>

<script>
const currentPath = window.location.pathname.toLowerCase();
document.querySelectorAll('.navbar a').forEach(link=>{
  if(link.getAttribute('href') === currentPath){
    link.classList.add('active');
  }
});
</script>

<div class="container">

<!-- FILTER -->
<div class="filters">
  <button onclick="displayProducts(allProducts)">الكل</button>
  <button onclick="filterProductsByCategory('electronics')">الكترونيات</button>
  <button onclick="filterProductsByCategory('fitness')">لياقة</button>
</div>

<!-- PRODUCTS -->
<div id="product-container"></div>

<!-- FAQ -->
<div class="faq" id="faqSection"></div>

</div>

<!-- WHATSAPP -->
<a class="whatsapp-float" href="https://wa.me/201205271929" target="_blank">
📲 واتساب
</a>

<script>
// ================= COUNTRY =================
function getCountry() {
    const lang = navigator.language || "en-US";
    if (lang.includes("ar")) return "eg";
    if (lang.includes("pl")) return "pl";
    if (lang.includes("en-CA")) return "ca";
    return "us";
}

// ================= AFFILIATE =================
const affiliateTags = {
    us: "koloonlinesto-20",
    ca: "onlinesho0429-20",
    pl: "koloonline-21",
    eg: "onlinesh03f31-21"
};

function generateAffiliateLink(asin) {
    const country = getCountry();
    let domain = "amazon.com";

    if (country === "eg") domain = "amazon.eg";
    if (country === "ca") domain = "amazon.ca";
    if (country === "pl") domain = "amazon.pl";

    return `https://${domain}/dp/${asin}?tag=${affiliateTags[country]}`;
}

// ================= FETCH =================
let allProducts = [];

async function fetchProducts() {
    try {
        const country = getCountry();
        const response = await fetch(`/api/products?country=${country}`);
        const data = await response.json();

        allProducts = data.products || [];
        displayProducts(allProducts);

    } catch (error) {
        console.error("Error:", error);
    }
}

// ================= DISPLAY =================
function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = "<p>لا توجد منتجات</p>";
        return;
    }

    products.forEach(product => {
        const div = document.createElement('div');
        div.className = "product";

        div.innerHTML = `
            <img src="${product.image}">
            <h3>${product.title}</h3>
            <p>⭐ ${product.rating || "4.5"}</p>
            <a href="${generateAffiliateLink(product.asin)}" target="_blank">
                🛒 شراء الآن
            </a>
            <button onclick='addToCart(${JSON.stringify(product)})'>
                ➕ إضافة للسلة
            </button>
        `;

        container.appendChild(div);
    });
}

// ================= CART =================
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("تمت الإضافة 🛒");
}

// ================= FILTER =================
function filterProductsByCategory(category) {
    const filtered = allProducts.filter(p => p.category === category);
    displayProducts(filtered);
}

// ================= FAQ =================
const faqs = [
  {q:"هل المنتجات أصلية؟", a:"نعم، جميع المنتجات من أمازون."},
  {q:"هل الأسعار نفس أمازون؟", a:"نعم بدون زيادة."},
  {q:"كيف أطلب؟", a:"من زر الشراء أو واتساب."}
];

function renderFAQ(){
  const container=document.getElementById("faqSection");
  faqs.forEach(f=>{
    const p=document.createElement("p");
    p.innerHTML=`<strong>${f.q}</strong><br>${f.a}`;
    container.appendChild(p);
  });
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", ()=>{
  fetchProducts();
  renderFAQ();
});
</script>

</body>
</html>
