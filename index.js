<input id="search" placeholder="Search products..." />

<div class="products"></div>async function loadProducts() {
  const res = await fetch("/api/products");
  const data = await res.json();

  const container = document.querySelector(".products");

  container.innerHTML = "";

  data.forEach(p => {
    container.innerHTML += `
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
    `;
  });
}

loadProducts();
