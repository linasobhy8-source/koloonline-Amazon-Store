/* ===============================
   KoloOnline SaaS Tracking Script
   CONNECTS TO BACKEND API
================================= */

const API_URL = "http://localhost:5000";

/* ================= CART STORAGE (optional local fallback) ================= */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ================= UPDATE CART UI ================= */
function updateCartUI(){
let el = document.getElementById("cartCount");
if(el) el.innerText = cart.length;
}

/* ================= TRACK EVENT (SAAS MODE) ================= */
async function trackEvent(asin, type){

if(!asin || !type) return;

try{

await fetch(`${API_URL}/track`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
asin: asin,
type: type,
country: navigator.language || "unknown"
})
});

}catch(err){
console.log("Tracking error:",err);
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