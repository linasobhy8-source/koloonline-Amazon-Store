// ================= COUNTRY =================
function getCountry() {
    const lang = navigator.language || "en-US";
    if (lang.includes("ar")) return "eg";
    if (lang.includes("pl")) return "pl";
    if (lang.includes("en-CA")) return "ca";
    return "us";
}

// ================= AFFILIATE =================
const affiliateTags = {
    us: "koloonlinesto-20",
    ca: "onlinesho0429-20",
    pl: "koloonline-21",
    eg: "onlinesh03f31-21"
};

function generateAffiliateLink(asin) {
    const country = getCountry();
    let domain = "amazon.com";

    if (country === "eg") domain = "amazon.eg";
    if (country === "ca") domain = "amazon.ca";
    if (country === "pl") domain = "amazon.pl";

    return `https://${domain}/dp/${asin}?tag=${affiliateTags[country]}`;
}

// ================= FETCH =================
let allProducts = [];

async function fetchProducts() {
    try {
        const country = getCountry();
        const response = await fetch(`/api/products?country=${country}`);
        const data = await response.json();

        allProducts = data.products || [];
        displayProducts(allProducts);

    } catch (error) {
        console.error("Error:", error);
    }
}

// ================= DISPLAY =================
function displayProducts(products) {
    const container = document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = "<p>لا توجد منتجات</p>";
        return;
    }

    products.forEach(product => {
        const div = document.createElement('div');
        div.className = "product";

        div.innerHTML = `
            <img src="${product.image}" style="width:100%">
            <h3>${product.title}</h3>
            <p>⭐ ${product.rating}</p>
            <a href="${generateAffiliateLink(product.asin)}" target="_blank">
                🛒 شراء الآن
            </a>
            <button onclick='addToCart(${JSON.stringify(product)})'>
                ➕ إضافة للسلة
            </button>
        `;

        container.appendChild(div);
    });
}

// ================= CART =================
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("تمت الإضافة 🛒");
}

// ================= FILTER =================
function filterProductsByCategory(category) {
    const filtered = allProducts.filter(p => p.category === category);
    displayProducts(filtered);
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", fetchProducts);
