let allProducts = [];

// 🛒 Update cart count
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = document.getElementById("cart-count");
  if (count) {
    count.innerText = cart.length;
  }
}

// 🛒 Add to cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart 🛒");
}

// 📦 Load products from API
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

// 🎨 Render products
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

      <a href="product.html?id=${p.id}">
        View Product
      </a>

    </div>
  `).join("");
}

// 🔍 Live search
document.addEventListener("input", (e) => {
  if (e.target.id === "search") {
    const value = e.target.value.toLowerCase();

    const filtered = allProducts.filter(p =>
      p.title.toLowerCase().includes(value)
    );

    renderProducts(filtered);
  }
});

// 🚀 Init
loadProducts();
updateCartCount();console.log("Tracking error:",err);
}

}

/* ================= BUY NOW ================= */
function buyNow(asin){

trackEvent(asin,"click");

const tag = getAffiliateTag();

window.open(
`https://www.amazon.com/dp/${asin}?tag=${tag}`,
"_blank"
);

}

/* ================= ADD TO CART ================= */
function addToCart(asin){

cart.push(asin);
localStorage.setItem("cart",JSON.stringify(cart));

updateCartUI();
trackEvent(asin,"cart");

}

/* ================= WHATSAPP ORDER ================= */
function orderWhatsApp(product, asin){

trackEvent(asin,"whatsapp");

let phone = "201XXXXXXXXX";

let msg = `I want to order: ${product}`;

window.open(
`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
"_blank"
);

}

/* ================= AFFILIATE TAG SYSTEM ================= */
function getAffiliateTag(){

let lang = navigator.language || "en-US";

if(lang.includes("ar-EG")) return "onlinesh03f31-21";
if(lang.includes("en-CA")) return "linasobhy20d8-20";
if(lang.includes("pl")) return "koloonline-21";

return "koloonlinesto-20";
}

/* ================= INIT ================= */
updateCartUI();
