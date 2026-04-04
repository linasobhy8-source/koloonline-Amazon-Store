<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Koloonline Products - كل شيء ديناميكي بالكامل</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Dynamic Amazon products with live updates, reviews, and affiliate links">

<!-- ================= Google Tag Manager ================= -->
<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-KNQM8BN"></script>

<!-- ================= Google Analytics GA4 ================= -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YS8L61XLPR"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YS8L61XLPR');
</script>

<style>
body { font-family: Arial, sans-serif; margin:0; background:#f5f5f5; }
header { background:#232f3e; color:#fff; padding:16px; text-align:center; font-size:26px; font-weight:bold; box-shadow:0 2px 6px rgba(0,0,0,0.2);}
.container { max-width:1200px; margin:20px auto; background:#fff; padding:25px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1);}
.grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:20px; margin-top:20px;}
.product-card { background:#fff; border-radius:10px; padding:15px; box-shadow:0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s;}
.product-card:hover { transform: translateY(-5px); }
.product-card img { width:100%; max-height:200px; object-fit:contain; border-radius:6px;}
.product-card h3 { font-size:18px; margin:10px 0 5px;}
.product-card .price { font-size:20px; font-weight:bold; color:#b12704;}
.product-card .stars { color:#f0c14b; font-weight:bold;}
.product-card button { width:100%; margin-top:8px; padding:10px; font-size:15px; border-radius:6px; cursor:pointer; border:none; transition:0.2s;}
.product-card button.buy-btn { background:#ff9900; color:#fff; font-weight:bold; display:flex; align-items:center; justify-content:center; gap:5px;}
.product-card button.buy-btn:hover { background:#e68a00;}
.product-card button.whatsapp { background:#25D366; color:#fff; font-weight:bold;}
@media(max-width:600px){ .container { padding:15px; margin:15px;} .product-card img { max-height:150px;} }
</style>
</head>
<body>
<header>🔥 Koloonline Products - كل شيء ديناميكي</header>
<div class="container">
  <section class="seo">
    <h2>Featured Products (Dynamic)</h2>
    <p>All products are automatically displayed with the latest offers, ratings, and reviews.</p>
    <div class="grid" id="productsGrid"></div>
  </section>
</div>

<script>
/* ================= بيانات المنتجات ديناميكية ================= */
const products = [
  {
    asin:"B09V7Z4TJG",
    title:"Smart Watch Pro",
    price:49.99,
    image:"https://m.media-amazon.com/images/I/61IMRs+o0iL._AC_SL1500_.jpg",
    rating:4.5,
    reviews:1200,
    video:"https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: { egypt:"onlinesh03f31-21", canada:"linasobhy20d8-20", usa:"koloonlinesto-20", poland:"koloonline-21" },
    logo:"https://i.postimg.cc/9fVfC1Y4/1000276862.png"
  },
  {
    asin:"B09B8Q3YHJ",
    title:"Echo Dot 5",
    price:39.99,
    image:"https://m.media-amazon.com/images/I/61u48FEs0rL._AC_SL1000_.jpg",
    rating:4.6,
    reviews:980,
    video:"",
    tags: { egypt:"onlinesh03f31-21", canada:"linasobhy20d8-20", usa:"koloonlinesto-20", poland:"koloonline-21" },
    logo:"https://i.postimg.cc/9fVfC1Y4/1000276862.png"
  }
];

/* ================= GEO + Affiliate ================= */
function getCountry(){
  const lang = navigator.language || "en-US";
  if(lang.includes("ar")) return "EG";
  if(lang.includes("pl")) return "PL";
  if(lang.includes("en-CA")) return "CA";
  return "US";
}

function getAffiliateLink(product){
  const country = getCountry();
  let domain="amazon.com", tag="koloonlinesto-20";
  if(country==="EG"){domain="amazon.eg"; tag=product.tags.egypt;}
  if(country==="CA"){domain="amazon.ca"; tag=product.tags.canada;}
  if(country==="PL"){domain="amazon.pl"; tag=product.tags.poland;}
  return `https://${domain}/dp/${product.asin}?tag=${tag}`;
}

/* ================= عرض المنتجات ================= */
function displayProducts(products){
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = '';
  products.forEach(product=>{
    const card = document.createElement("div");
    card.className = "product-card";
    const videoFrame = product.video ? `<iframe width="100%" height="150" src="${product.video}" frameborder="0" allowfullscreen></iframe>` : "";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p class="price">$${product.price}</p>
      <p class="stars">⭐ ${product.rating} (${product.reviews} reviews)</p>
      ${videoFrame}
      <button class="buy-btn" onclick="window.open('${getAffiliateLink(product)}','_blank')">
        <img src="${product.logo}" style="width:20px;vertical-align:middle;">🔥 Buy Now
      </button>
      <button class="whatsapp" onclick="orderWhatsApp('${product.title}')">📲 WhatsApp</button>
    `;
    grid.appendChild(card);
  });
}

/* ================= WhatsApp Order ================= */
function orderWhatsApp(title){
  const msg = "I want to order: " + title;
  window.open("https://wa.me/201XXXXXXXXX?text="+encodeURIComponent(msg));
}

/* ================= INIT ================= */
displayProducts(products);
</script>
</body>
</html>
