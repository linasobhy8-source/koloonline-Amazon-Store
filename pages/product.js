import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/* 🔥 Firebase Config */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "onlinekoloonlineonline-a9979.firebaseapp.com",
  projectId: "onlinekoloonlineonline-a9979",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let products = [];
let currentProduct = null;

/* ================= GET ASIN ================= */
const urlParams = new URLSearchParams(window.location.search);
const asin = urlParams.get("asin");

/* ================= LOAD PRODUCTS ================= */
async function loadProducts() {
  const snap = await getDocs(collection(db, "products"));
  products = snap.docs.map(doc => doc.data());

  currentProduct = products.find(p => p.asin === asin);

  renderProduct();
  renderRelated();
}

/* ================= RENDER PRODUCT ================= */
function renderProduct() {
  const container = document.getElementById("product");

  if (!currentProduct) {
    container.innerHTML = "<h2>Product not found ❌</h2>";
    return;
  }

  const p = currentProduct;

  container.innerHTML = `
    <div class="card">
      <img src="${p.image}">
      <h2>${p.title}</h2>
      <p class="price">$${p.price}</p>

      <button onclick="window.open('${p.link}','_blank')">
        🔥 Buy Now
      </button>
    </div>
  `;
}

/* ================= RELATED ================= */
function renderRelated() {
  const container = document.getElementById("related");

  container.innerHTML = products
    .filter(p => p.asin !== asin)
    .map(p => `
      <div style="margin:10px;text-align:center;">
        <img src="${p.image}" width="100"><br>
        <b>${p.title}</b><br>
        <button onclick="location.href='product.html?asin=${p.asin}'">
          View
        </button>
      </div>
    `).join("");
}

/* ================= START ================= */
loadProducts();
