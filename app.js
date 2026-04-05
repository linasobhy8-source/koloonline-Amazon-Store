// app.js

// تحديد الدولة (ممكن تطوريه بعد كده)
function detectUserCountry() {
    return 'eg'; // مصر افتراضي
}

// إنشاء رابط أفلييت
function generateAffiliateLink(productId) {
    return `https://www.koloonline.online/products/${productId}`;
}

// جلب المنتجات من API الصحيح (Vercel)
async function fetchProducts() {
    try {
        const response = await fetch('/api/products'); // ✅ تم التعديل هنا
        if (!response.ok) throw new Error('Network response was not ok');

        const products = await response.json();
        displayProducts(products);

        return products; // ✅ مهم للفلترة
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// عرض المنتجات
function displayProducts(products) {
    const productContainer = document.getElementById('product-container');

    if (!productContainer) {
        console.error("product-container مش موجود في HTML");
        return;
    }

    productContainer.innerHTML = '';

    if (!products || products.length === 0) {
        productContainer.innerHTML = "<p>لا توجد منتجات حالياً</p>";
        return;
    }

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        productElement.innerHTML = `
            <div class="product-card">
                <h3>${product.name || 'منتج'}</h3>
                <p>${product.description || ''}</p>
                <p><strong>${product.price || ''}</strong></p>
                <a href="${generateAffiliateLink(product.id)}" target="_blank">
                    🛒 شراء الآن
                </a>
            </div>
        `;

        productContainer.appendChild(productElement);
    });
}

// تتبع الأحداث
function trackEvent(event) {
    console.log('Tracking event:', event);
}

// إدارة السلة
const shoppingCart = {
    addItem(product) {
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        cart.push(product);
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        trackEvent('Item added to cart');
    },
    getCart() {
        return JSON.parse(localStorage.getItem('shoppingCart')) || [];
    },
    clearCart() {
        localStorage.removeItem('shoppingCart');
    }
};

// فلترة المنتجات
function filterProductsByCategory(category) {
    fetchProducts().then(products => {
        if (!products) return;
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
    });
}

// FAQ
function toggleFAQ(faqElement) {
    faqElement.classList.toggle('active');
    const answer = faqElement.nextElementSibling;

    if (answer.style.display === "block") {
        answer.style.display = "none";
    } else {
        answer.style.display = "block";
    }
}

// مراجعات العملاء
function loadCustomerReviews() {
    console.log('Loading customer reviews...');
}

// تشغيل الموقع
function init() {
    fetchProducts();
    loadCustomerReviews();
}

// بدء التنفيذ
document.addEventListener('DOMContentLoaded', init);
