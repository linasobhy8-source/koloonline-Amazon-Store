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

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount(){
  document.getElementById("cartCount").innerText = cart.length;
}

function addToCart(id){
  const product = allProducts.find(p => p.id === id);
  cart.push(product);
  saveCart();
  alert("Added to cart 🛒");
}

function displayProducts(products){
  let html = "";

  products.forEach(item=>{
    html += `
    <div class="card">

      <a href="${item.link}" target="_blank">
        <img src="${item.image}">
      </a>

      <div class="card-content">
        <h3>${item.title}</h3>
        <p>$${item.price}</p>
      </div>

      <button class="buy-btn" onclick="addToCart(${item.id})">
        Add to Cart 🛒
      </button>

    </div>
    `;
  });

  document.getElementById("products").innerHTML = html;
}

function liveSearch(){
  const q = document.getElementById("searchInput").value.toLowerCase();

  const filtered = allProducts.filter(p =>
    p.title.toLowerCase().includes(q)
  );

  displayProducts(filtered);
}

function goCart(){
  window.location.href = "cart.html";
}

displayProducts(allProducts);
updateCartCount();
