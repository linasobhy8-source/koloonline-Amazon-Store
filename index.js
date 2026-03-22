let allProducts = [];

// 🛒 تحديث عداد السلة
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = document.getElementById("cart-count");
  if (count) count.innerText = cart.length;
}

// 🛒 إضافة للسلة
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart 🛒");
}

// 📦 تحميل المنتجات
async function loadProducts() {
  const res = await fetch("/api/products");
  const data = await res.json();

  allProducts = data;
  render(data);
  updateCartCount();
}

// 🎨 عرض المنتجات
function render(list) {
  const container = document.querySelector(".products");

  container.innerHTML = list.map(p => `
    <div class="card">
      <img src="${p.image}" />

      <h3>${p.title}</h3>
      <p>$${p.price}</p>

      <button onclick='addToCart(${JSON.stringify(p)})'>
        Add to Cart 🛒
      </button>

      <a href="product.html?id=${p.id}">
        عرض التفاصيل
      </a>
    </div>
  `).join("");
}

// 🔍 بحث مباشر (Amazon style)
document.addEventListener("input", (e) => {
  if (e.target.id === "search") {
    const value = e.target.value.toLowerCase();

    const filtered = allProducts.filter(p =>
      p.title.toLowerCase().includes(value)
    );

    render(filtered);
  }
});

// 🚀 تشغيل أولي
loadProducts();
