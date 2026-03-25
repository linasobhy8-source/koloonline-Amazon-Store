let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ================= CART COUNT ================= */
function updateCartCount() {
  const count = document.getElementById("cart-count");
  if (count) count.innerText = cart.length;
}

/* ================= ADD TO CART ================= */
function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
  trackEvent(product.id, "cart");

  alert("Added to cart 🛒");
}

/* ================= LOAD PRODUCTS ================= */
async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();

    allProducts = data;
    renderProducts(data);
    updateCartCount();
  } catch (err) {
    console.log("Error loading products", err);
  }
}

/* ================= RENDER PRODUCTS ================= */
function renderProducts(list) {
  const container = document.querySelector(".products");
  if (!container) return;

  container.innerHTML = list.map(p => `
    <div class="card">

      <img src="${p.image}" />

      <h3>${p.title}</h3>
      <p>$${p.price}</p>

      <button onclick='addToCart(${JSON.stringify(p)})'>
        Add to Cart 🛒
      </button>

      <button onclick="buyNow('${p.asin}')">
        Buy Now ⚡
      </button>

      <a href="product.html?id=${p.id}">
        View Product
      </a>

    </div>
  `).join("");
}

/* ================= SEARCH ================= */
document.addEventListener("input", (e) => {
  if (e.target.id === "search") {
    const value = e.target.value.toLowerCase();

    const filtered = allProducts.filter(p =>
      p.title.toLowerCase().includes(value)
    );

    renderProducts(filtered);
  }
});

/* ================= BUY NOW ================= */
function buyNow(asin) {
  trackEvent(asin, "click");

  const tag = getAffiliateTag();

  window.open(
    `https://www.amazon.com/dp/${asin}?tag=${tag}`,
    "_blank"
  );
}

/* ================= TRACK EVENT ================= */
function trackEvent(item, type) {
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item,
        type,
        page: "store",
        time: new Date().toISOString()
      })
    });
  } catch (err) {
    console.log("Tracking error:", err);
  }
}

/* ================= WHATSAPP ORDER ================= */
function orderWhatsApp(product, asin) {
  trackEvent(asin, "whatsapp");

  let phone = "201XXXXXXXXX";
  let msg = `I want to order: ${product}`;

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

/* ================= AFFILIATE TAG SYSTEM ================= */
function getAffiliateTag() {
  let lang = navigator.language || "en-US";

  if (lang.includes("ar")) return "onlinesh03f31-21";
  if (lang.includes("ca")) return "linasobhy20d8-20";
  if (lang.includes("pl")) return "koloonline-21";

  return "koloonlinesto-20";
}

/* ================= INIT ================= */
loadProducts();
updateCartCount();
