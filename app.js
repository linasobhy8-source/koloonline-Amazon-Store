async function fetchProducts(country="eg") {
    try {
        const response = await fetch(`/api/products?country=${country}`);
        if (!response.ok) throw new Error("خطأ في جلب المنتجات");
        const data = await response.json();
        displayProducts(data.products);
    } catch (error) {
        console.error(error);
        document.getElementById('product-container').innerHTML = "<p>حدث خطأ أثناء تحميل المنتجات</p>";
    }
}

function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = "";
    if (!products || products.length === 0) {
        container.innerHTML = "<p>لا توجد منتجات حالياً</p>";
        return;
    }

    products.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${p.image}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p>⭐ ${p.rating} | 💰 ${p.affiliateRate*100}%</p>
            <a href="${p.link}" target="_blank">🛒 شراء الآن</a>
        `;
        container.appendChild(card);
    });
}

// تغيير الدولة
document.getElementById('country-select').addEventListener('change', (e) => {
    fetchProducts(e.target.value);
});

// جلب المنتجات عند التحميل
document.addEventListener('DOMContentLoaded', () => fetchProducts());
