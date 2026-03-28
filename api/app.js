const allProducts = [
  {
    id: 1,
    title: "Anker Speakerphone",
    image: "https://m.media-amazon.com/images/I/71tV4O0rO0L._AC_SL1500_.jpg",
    price: 49.99,
    link: "https://www.amazon.com/dp/B07ZNT7PRL?tag=koloonlinesto-20"
  },
  {
    id: 2,
    title: "Smart Watch",
    image: "https://m.media-amazon.com/images/I/61IMRs+o0iL._AC_SL1500_.jpg",
    price: 39.99,
    link: "https://www.amazon.com/dp/B09V7Z4TJG?tag=koloonlinesto-20"
  }
];

// ================= CART INIT =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= SAVE CART =================
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// ================= UPDATE CART COUNT =================
function updateCartCount(){
  const el = document.getElementById("cartCount");
  if(!el) return;
  el.innerText = cart.reduce((sum,item)=> sum + (item.qty || 1), 0);
}

// ================= TRACK CLICK (FUTURE ANALYTICS) =================
function trackEvent(type, product){
  const events = JSON.parse(localStorage.getItem("events") || "[]");

  events.push({
    type: type,
    productId: product?.id,
    title: product?.title,
    price: product?.price,
    time: new Date().toISOString()
  });

  localStorage.setItem("events", JSON.stringify(events));
}

// ================= ADD TO CART =================
function addToCart(id){
  const product = allProducts.find(p => p.id === id);
  if(!product) return;

  const existing = cart.find(item => item.id === id);

  if(existing){
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({...product, qty: 1});
  }

  saveCart();
  trackEvent("add_to_cart", product);

  alert("🛒 Added to cart successfully!");
}

// ================= DISPLAY PRODUCTS =================
function displayProducts(products){
  let html = "";

  products.forEach(item=>{
    html += `
      <div class="card">

        <a href="${item.link}" target="_blank" onclick="trackEvent('click_product', ${JSON.stringify(item).replace(/"/g, '&quot;')})">
          <img src="${item.image}" alt="${item.title}">
        </a>

        <div class="card-content">
          <h3>${item.title}</h3>
          <p>💲 ${item.price}</p>
        </div>

        <button class="buy-btn" onclick="addToCart(${item.id})">
          Add to Cart 🛒
        </button>

      </div>
    `;
  });

  const container = document.getElementById("products");
  if(container) container.innerHTML = html;
}

// ================= LIVE SEARCH =================
function liveSearch(){
  const input = document.getElementById("searchInput");
  if(!input) return;

  const q = input.value.toLowerCase();

  const filtered = allProducts.filter(p =>
    p.title.toLowerCase().includes(q)
  );

  displayProducts(filtered);
}

// ================= GO TO CART =================
function goCart(){
  window.location.href = "cart.html";
}

// ================= INIT =================
displayProducts(allProducts);
updateCartCount();
