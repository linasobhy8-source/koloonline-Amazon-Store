const productGrid = document.getElementById('productGrid');
const countrySelect = document.getElementById('country-select');
const cartCount = document.getElementById('cart-count');

let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

// تحديث عداد السلة
function updateCartCount() {
    cartCount.textContent = shoppingCart.length;
}

// جلب المنتجات من API
async function fetchProducts(country="US") {
    try {
        const res = await fetch(`/api/products?country=${country}`);
        if(!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        displayProducts(data.products);
    } catch(err) {
        console.error(err);
        productGrid.innerHTML = "<p>حدث خطأ أثناء تحميل المنتجات</p>";
    }
}

// عرض المنتجات
function displayProducts(products) {
    productGrid.innerHTML = "";
    if(!products || products.length===0){
        productGrid.innerHTML = "<p>لا توجد منتجات حالياً</p>";
        return;
    }

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = "product-card";
        card.innerHTML = `
            <img src="${p.image}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p>⭐ ${p.rating} | 💰 ${p.affiliateRate*100}%</p>
            <a href="${p.link}" target="_blank">🛒 شراء الآن</a>
            <button onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
        `;
        productGrid.appendChild(card);
    });
}

// إضافة للسلة
function addToCart(product) {
    shoppingCart.push(product);
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
    updateCartCount();
}

// البحث عن المنتجات
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const country = countrySelect.value;
    fetch(`/api/products?country=${country}`)
        .then(res => res.json())
        .then(data => {
            const filtered = data.products.filter(p => p.title.toLowerCase().includes(query));
            displayProducts(filtered);
        });
});

// تغيير الدولة
countrySelect.addEventListener('change', (e)=>{
    fetchProducts(e.target.value);
});

// التحميل الأولي
document.addEventListener('DOMContentLoaded', ()=>{
    updateCartCount();
    fetchProducts(countrySelect.value);
});
