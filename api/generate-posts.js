<!DOCTYPE <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Koloonline Store - الديناميكي بالكامل</title>
<meta name="description" content="Best Amazon deals, dynamic products, reviews, FAQ and blog posts">

<!-- ================= GTM ================= -->
<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-KNQM8BN"></script>

<!-- ================= GA4 ================= -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YS8L61XLPR"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config','G-YS8L61XLPR');
</script>

<style>
body{margin:0;font-family:Arial,sans-serif;background:#f5f5f5}
header{background:#232f3e;color:#fff;text-align:center;padding:16px;font-size:26px;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.2);}
.navbar{display:flex;justify-content:space-between;padding:10px;background:#37475a;color:#fff;flex-wrap:wrap;}
.navbar button{background:#ff9900;border:none;padding:8px 12px;border-radius:6px;font-weight:bold;cursor:pointer;margin-left:5px;transition:0.2s;}
.navbar button:hover{background:#e68a00;}
.container{max-width:1200px;margin:20px auto;padding:20px;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px;margin-top:20px;}
.product-card,.post-card,.faq-card,.cart-card{background:#fff;border-radius:10px;padding:15px;box-shadow:0 2px 10px rgba(0,0,0,0.1);}
.product-card img,.cart-card img{width:100%;height:180px;object-fit:contain;border-radius:6px;}
.product-card h3,.post-card h3{font-size:18px;margin:10px 0 5px;}
.product-card .price{font-size:20px;font-weight:bold;color:#b12704;}
.product-card .stars{color:#f0c14b;font-weight:bold;}
button.buy-btn{width:100%;padding:10px;margin-top:8px;border-radius:6px;cursor:pointer;border:none;font-weight:bold;transition:0.2s;}
button.buy-btn.buy-now{background:#ff9900;}
button.buy-btn.buy-now:hover{background:#e68a00;}
button.buy-btn.whatsapp{background:#25d366;color:#fff;}
button.buy-btn.danger{background:#d9534f;color:#fff;}
button.buy-btn.success{background:#28a745;color:#fff;}
.trust{background:#e8f5e9;padding:10px;margin-top:10px;border-radius:6px;font-size:14px;}
.faq-card p{margin:8px 0;}
@media(max-width:600px){.grid{grid-template-columns:1fr;}}
</style>
</head>

<body>
<header>🔥 Koloonline Store</header>
<div class="navbar">
  <div>
    <button onclick="location.href='index.html'">🏠 Home</button>
    <button onclick="location.href='cart.html'">🛒 Cart</button>
    <button onclick="location.href='blog.html'">📰 Blog</button>
  </div>
</div>

<div class="container">

<!-- ================= PRODUCTS ================= -->
<section id="productsSection">
<h2>Featured Products (Dynamic)</h2>
<div class="grid" id="productsGrid"></div>
</section>

<!-- ================= FAQ ================= -->
<section class="seo" id="faqSection">
<h2>Frequently Asked Questions (FAQ)</h2>
<div class="grid" id="faqGrid"></div>
</section>

<!-- ================= BLOG ================= -->
<section id="blogSection">
<h2>Latest Articles (Dynamic)</h2>
<div class="grid" id="postsGrid"></div>
</section>

</div>

<script>
/* ================= PRODUCTS ديناميكي بالكامل ================= */
const products = [
  {asin:"B09V7Z4TJG",title:"Smart Watch Pro",price:49.99,image:"https://m.media-amazon.com/images/I/61IMRs+o0iL._AC_SL1500_.jpg",rating:4.5,reviews:1200,tags:{EG:"onlinesh03f31-21",CA:"linasobhy20d8-20",US:"koloonlinesto-20",PL:"koloonline-21"},logo:"https://yourcdn.com/logo.png"},
  {asin:"B09B8Q3YHJ",title:"Echo Dot 5",price:39.99,image:"https://m.media-amazon.com/images/I/61u48FEs0rL._AC_SL1000_.jpg",rating:4.6,reviews:980,tags:{EG:"onlinesh03f31-21",CA:"linasobhy20d8-20",US:"koloonlinesto-20",PL:"koloonline-21"},logo:"https://yourcdn.com/logo.png"}
];

function getCountry(){
  let lang=navigator.language||"en-US";
  if(lang.includes("ar")) return "EG";
  if(lang.includes("pl")) return "PL";
  if(lang.includes("en-CA")) return "CA";
  return "US";
}
function getAffiliateLink(product){
  const country = getCountry();
  let domain="amazon.com", tag=product.tags.US;
  if(country==="EG") domain="amazon.eg", tag=product.tags.EG;
  if(country==="CA") domain="amazon.ca", tag=product.tags.CA;
  if(country==="PL") domain="amazon.pl", tag=product.tags.PL;
  return `https://${domain}/dp/${product.asin}?tag=${tag}`;
}
function displayProducts(){
  const grid=document.getElementById("productsGrid"); grid.innerHTML="";
  products.forEach(p=>{
    const card=document.createElement("div"); card.className="product-card";
    card.innerHTML=`
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="price">$${p.price}</p>
      <p class="stars">⭐ ${p.rating} (${p.reviews} reviews)</p>
      <button class="buy-btn buy-now" onclick="window.open('${getAffiliateLink(p)}','_blank')">
        <img src="${p.logo}" style="width:20px;vertical-align:middle;margin-right:5px;">🔥 Buy Now
      </button>
      <button class="buy-btn whatsapp" onclick="orderWhatsApp('${p.title}')">📲 WhatsApp</button>
    `;
    grid.appendChild(card);
  });
}
function orderWhatsApp(title){
  const msg="I want to order: "+title;
  window.open("https://wa.me/201XXXXXXXXX?text="+encodeURIComponent(msg));
}

/* ================= FAQ ديناميكي بالكامل ================= */
const faqs = [
  {q:"Are these products original?",a:"Yes, all products listed are sourced directly from Amazon and trusted suppliers ensuring authenticity."},
  {q:"How does shipping work?",a:"All orders are processed through Amazon’s official delivery system for fast and secure shipping."},
  {q:"Can I return or refund the product?",a:"Yes, returns and refunds are handled according to Amazon’s official return policy."},
  {q:"Are prices the same as Amazon?",a:"Yes, prices are based on Amazon listings and include affiliate tracking links without affecting your purchase price."},
  {q:"Is my order secure?",a:"Absolutely. All transactions are processed through Amazon secure checkout systems."}
];
function displayFAQ(){
  const grid=document.getElementById("faqGrid"); grid.innerHTML="";
  faqs.forEach(f=>{
    const div=document.createElement("div"); div.className="faq-card";
    div.innerHTML=`<p><strong>Q: ${f.q}</strong><br>${f.a}</p>`;
    grid.appendChild(div);
  });
}

/* ================= BLOG ديناميكي بالكامل ================= */
const posts = []; const topics=["Smart Watches","Amazon Gadgets","Wireless Earbuds","Home Tech","Cheap Deals","Fitness Trackers","Smart Home"];
for(let i=0;i<20;i++){
  const t=topics[i%topics.length];
  posts.push({id:i,title:`${t} #${i+1}`,slug:t.toLowerCase().replaceAll(" ","-")+"-"+i,description:`SEO article about ${t}`,content:`<h1>${t}</h1><p>High quality article about ${t}.</p>`});
}
function displayPosts(){
  const grid=document.getElementById("postsGrid"); grid.innerHTML="";
  posts.forEach(p=>{
    const div=document.createElement("div"); div.className="post-card";
    div.innerHTML=`<h3>${p.title}</h3><p>${p.description}</p><button onclick="alert('Read post: ${p.title}')">Read More</button>`;
    grid.appendChild(div);
  });
}

/* ================= INIT ================= */
displayProducts();
displayFAQ();
displayPosts();
</script>
</body>
</html>>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Koloonline Store | Full Dynamic</title>
<meta name="description" content="Koloonline store unified: products, cart, checkout, FAQ, blog, affiliate links">

<!-- Favicon -->
<link rel="icon" href="favicon.ico">

<!-- GTM -->
<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-KNQM8BN"></script>

<!-- GA4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YS8L61XLPR"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config','G-YS8L61XLPR');
</script>

<style>
body{font-family:Arial;margin:0;background:#f5f5f5;}
header{background:#232f3e;color:#fff;padding:16px;text-align:center;font-size:26px;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.2);}
.container{max-width:1200px;margin:20px auto;background:#fff;padding:25px;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.1);}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px;margin-top:20px;}
.card, .article-card{background:#fff;border-radius:10px;padding:15px;box-shadow:0 2px 8px rgba(0,0,0,0.1);}
.card img, .article-card img{width:100%;max-height:200px;object-fit:contain;border-radius:6px;}
.card h3, .article-card h3{font-size:18px;margin:10px 0 5px;}
.price{font-size:20px;font-weight:bold;color:#b12704;}
.stars{color:#f0c14b;font-weight:bold;}
button{width:100%;margin-top:8px;padding:10px;font-size:15px;border-radius:6px;cursor:pointer;border:none;transition:0.2s;}
.buy-btn{background:#ff9900;}
.buy-btn:hover{background:#e68a00;}
.whatsapp{background:#25D366;color:#fff;}
.summary, .faq-section, .blog-section, .checkout-section{margin-top:30px;}
.faq p{margin-bottom:15px;line-height:1.6;}
.trust{background:#e8f5e9;padding:10px;border-radius:6px;margin-top:10px;font-size:14px;}
.upsell{margin-top:20px;padding:15px;background:#fff3cd;border-radius:8px;}
@media(max-width:600px){.container{padding:15px;margin:15px;}.card img{max-height:150px;}}
</style>
</head>
<body>

<header>🔥 Koloonline Store Unified</header>

<!-- ================= PRODUCTS ================= -->
<div class="container" id="productsSection">
<h2>Featured Products</h2>
<div class="grid" id="productsGrid"></div>
</div>

<!-- ================= CART ================= -->
<div class="container summary" id="cartSummary"></div>

<!-- ================= CHECKOUT ================= -->
<div class="container checkout-section" id="checkoutSection" style="display:none;">
<h2>🚀 Checkout</h2>
<div id="checkoutItems"></div>
<p id="checkoutTotal" style="font-weight:bold;"></p>
<button class="buy-btn" onclick="placeOrder()">✅ Place Order</button>
</div>

<!-- ================= FAQ ================= -->
<div class="container faq-section" id="faqSection">
<h2>FAQ</h2>
<div class="faq">
<p><strong>Q: Are products original?</strong><br>All sourced from Amazon & trusted suppliers.</p>
<p><strong>Q: How does shipping work?</strong><br>Processed through Amazon official delivery.</p>
<p><strong>Q: Can I return or refund?</strong><br>Handled according to Amazon return policy.</p>
<p><strong>Q: Are prices same as Amazon?</strong><br>Yes, prices reflect Amazon listings via affiliate links.</p>
<p><strong>Q: Is my order secure?</strong><br>All transactions use Amazon secure checkout.</p>
</div>
</div>

<!-- ================= BLOG ================= -->
<div class="container blog-section" id="blogSection">
<h2>Latest Articles</h2>
<div id="articlesContainer"></div>
</div>

<script>
/* ================= GEO + AFFILIATE ================= */
function getCountry(){
  let lang=navigator.language||"en-US";
  if(lang.includes("ar")) return "EG";
  if(lang.includes("pl")) return "PL";
  if(lang.includes("en-CA")) return "CA";
  return "US";
}
function getAffiliateTag(product){
  const country=getCountry();
  if(country==="EG") return product.tags.egypt;
  if(country==="CA") return product.tags.canada;
  if(country==="PL") return product.tags.poland;
  return product.tags.usa;
}
function getAffiliateLink(product){
  const country=getCountry();
  let domain="amazon.com";
  if(country==="EG") domain="amazon.eg";
  if(country==="CA") domain="amazon.ca";
  if(country==="PL") domain="amazon.pl";
  return `https://${domain}/dp/${product.asin}?tag=${getAffiliateTag(product)}`;
}

/* ================= PRODUCTS ================= */
const products=[
{asin:"B09V7Z4TJG",title:"Smart Watch Pro",price:49.99,image:"https://m.media-amazon.com/images/I/61IMRs+o0iL._AC_SL1500_.jpg",rating:4.5,reviews:1200,tags:{egypt:"onlinesh03f31-21",canada:"linasobhy20d8-20",usa:"koloonlinesto-20",poland:"koloonline-21"},logo:"https://yourcdn.com/logo.png"},
{asin:"B09B8Q3YHJ",title:"Echo Dot 5",price:39.99,image:"https://m.media-amazon.com/images/I/61u48FEs0rL._AC_SL1000_.jpg",rating:4.6,reviews:980,tags:{egypt:"onlinesh03f31-21",canada:"linasobhy20d8-20",usa:"koloonlinesto-20",poland:"koloonline-21"},logo:"https://yourcdn.com/logo.png"}
];
function displayProducts(){
  const grid=document.getElementById("productsGrid");
  grid.innerHTML="";
  products.forEach(product=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p class="price">$${product.price}</p>
      <p class="stars">⭐ ${product.rating} (${product.reviews} reviews)</p>
      <button class="buy-btn" onclick="window.open('${getAffiliateLink(product)}','_blank')">
        <img src="${product.logo}" style="width:20px;vertical-align:middle;margin-right:5px;">🔥 Buy Now
      </button>
      <button class="whatsapp" onclick="orderWhatsApp('${product.title}')">📲 WhatsApp</button>
    `;
    grid.appendChild(card);
  });
}

/* ================= CART ================= */
let cart=JSON.parse(localStorage.getItem("cart")||"[]");
function saveCart(){localStorage.setItem("cart",JSON.stringify(cart));renderCart();}
function renderCart(){
  const container=document.getElementById("cartSummary");
  if(cart.length===0){container.innerHTML="<p>🛒 Cart is empty</p>";return;}
  let total=0;cart.forEach(item=>total+=item.price*item.qty||1);
  container.innerHTML=`<h3>🛒 Cart Summary</h3><p>Total Items: ${cart.length}</p><p>Total Price: $${total.toFixed(2)}</p>
  <button class="buy-btn" onclick="showCheckout()">Proceed to Checkout</button>`;
}

/* ================= CHECKOUT ================= */
function showCheckout(){
  document.getElementById("checkoutSection").style.display="block";
  const itemsDiv=document.getElementById("checkoutItems");
  itemsDiv.innerHTML="";
  cart.forEach(item=>{
    const div=document.createElement("div");
    div.innerHTML=`${item.title} - $${item.price} x ${item.qty||1}`;
    itemsDiv.appendChild(div);
  });
  const total=cart.reduce((s,i)=>s+(i.price*i.qty||i.price),0);
  document.getElementById("checkoutTotal").innerText="Total: $"+total.toFixed(2);
}
function placeOrder(){
  if(cart.length===0){alert("Cart is empty");return;}
  let orders=JSON.parse(localStorage.getItem("orders")||"[]");
  const order={id:Date.now(),items:cart,totalPrice:cart.reduce((s,i)=>s+(i.price*i.qty||i.price),0)};
  orders.push(order);
  localStorage.setItem("orders",JSON.stringify(orders));
  localStorage.removeItem("cart");
  alert("🎉 Order placed!");
  window.location.reload();
}

/* ================= WHATSAPP ================= */
function orderWhatsApp(title){
  window.open("https://wa.me/201XXXXXXXXX?text="+encodeURIComponent("I want to order: "+title));
}

/* ================= BLOG ================= */
async function fetchArticles(){
  try{
    const res=await fetch("/api/posts");
    const posts=await res.json();
    const container=document.getElementById("articlesContainer");
    container.innerHTML="";
    posts.forEach(post=>{
      const card=document.createElement("div");
      card.className="article-card";
      const link=`https://www.amazon.com/dp/${post.id}?tag=koloonlinesto-20`;
      card.innerHTML=`
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        <div>${post.content}</div>
        <button onclick="window.open('${link}','_blank')">🔥 Buy Related Product</button>
        <button onclick="orderWhatsApp('${post.title}')">📲 WhatsApp</button>
      `;
      container.appendChild(card);
    });
  }catch(e){console.log(e);}
}

/* ================= INIT ================= */
displayProducts();
renderCart();
fetchArticles();
</script>

</body>
</html>
