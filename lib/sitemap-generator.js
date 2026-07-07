import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/* ================= FIREBASE ================= */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

const db = getFirestore(app);


/* ================= SITE ================= */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://koloonline.online";


/* ================= CLEAN URL ================= */

const normalizeUrl = (url = "") =>
  url
    .replace("http://", "https://")
    .replace("www.", "");


/* ================= EXCLUDED PATHS ================= */

const EXCLUDED_PATHS = [
  "/contact",
  "/cart",
  "/dashboard",
  "/success",
  "/thankyou",
  "/search",
  "/admin",
  "/api",
];



/* ================= AI SCORE ================= */

function productScore(p = {}) {

  const rating = Number(p.rating) || 0;
  const orders = Number(p.orders) || 0;
  const views = Number(p.views) || 0;
  const clicks = Number(p.clicks) || 0;

  const ctr =
    views > 0
      ? clicks / views
      : 0;


  return (
    rating * 12 +
    orders * 6 +
    views * 0.4 +
    ctr * 60 +
    (p.viralBoost ? 70 : 0)
  );

}



/* ================= AI LEVEL ================= */

function getAILevel(score){

  if(score >= 90)
    return "elite";

  if(score >=70)
    return "strong";

  if(score >=40)
    return "normal";

  return "low";

}



/* ================= INDEX CONTROL ================= */

function shouldIndexProduct(p={}){


 const title =
   (p.title || "").trim();


 if(!title || title.length < 3)
    return false;


 if(!p.image)
    return false;



 const score = productScore(p);


 const level =
   getAILevel(score);



 if(level==="low")
    return false;



 const views =
   Number(p.views)||0;


 const clicks =
   Number(p.clicks)||0;


 const orders =
   Number(p.orders)||0;



 if(
   views===0 &&
   clicks===0 &&
   orders===0 &&
   !p.featured &&
   !p.viralBoost
 ){
    return false;
 }


 return true;

}



/* ================= PRIORITY ================= */


function getPriorityFromProduct(p={}){


 const level =
   getAILevel(productScore(p));


 if(level==="elite")
    return 1;


 if(level==="strong")
    return 0.9;


 if(level==="normal")
    return 0.8;


 return 0.6;

}



/* ================= CHANGE ================= */


function getChangeFreq(p={}){


 const level =
   getAILevel(productScore(p));


 if(level==="elite")
    return "hourly";


 if(level==="strong")
    return "daily";


 return "weekly";

}



/* ================= URL VALIDATION ================= */

function shouldInclude(url=""){


 const lower =
   url.toLowerCase();



 if(!url)
    return false;


 if(
  EXCLUDED_PATHS.some(
    p=>lower.includes(p)
  )
 )
    return false;


 if(lower.includes("?"))
    return false;


 if(
  lower.includes("/product/undefined")
 )
    return false;


 if(
  lower.endsWith("/product/")
 )
    return false;



 return true;

}



/* ================= DATE ================= */

function safeDate(date,fallback){

 try{

  return date
    ? new Date(date).toISOString()
    : fallback;

 }catch{

  return fallback;

 }

}



/* ================= MAIN ================= */


export async function generateSitemap(){


 const now =
   new Date().toISOString();


 const urls=[];



/* ================= PRODUCTS ================= */


try{


 const snap =
   await getDocs(
    collection(db,"products")
   );



 snap.forEach(doc=>{


  const p =
    doc.data();



  if(!shouldIndexProduct(p))
     return;



  const loc =
    normalizeUrl(
      `${SITE_URL}/product/${p.slug || doc.id}`
    );



  if(!shouldInclude(loc))
      return;



  urls.push({

    loc,

    lastmod:
      safeDate(
       p.updatedAt,
       now
      ),

    changefreq:
      getChangeFreq(p),

    priority:
      getPriorityFromProduct(p)

  });



 });



}catch(err){

 console.error(
  "Products sitemap error:",
  err
 );

}



/* ================= BLOG ================= */


try{


 const snap =
  await getDocs(
    collection(db,"blog")
  );



 snap.forEach(doc=>{


 const post =
   doc.data();



 if(!post.title)
    return;



 const loc =
  normalizeUrl(
   `${SITE_URL}/blog/${post.slug || doc.id}`
  );



 if(!shouldInclude(loc))
    return;



 urls.push({

  loc,

  lastmod:
   safeDate(
    post.updatedAt,
    now
   ),

  changefreq:"weekly",

  priority:0.85

 });



 });


}catch(err){

 console.error(
  "Blog sitemap error:",
  err
 );

}



/* ================= TOP PAGES ================= */


const topPages=[

"top-smart-watches",
"top-earbuds",
"top-smart-watches-under-100",
"top-power-banks",
"top-wireless-headphones",
"top-bluetooth-speakers",
"top-gaming-accessories",
"top-smart-home-devices"

];


topPages.forEach(slug=>{


 const loc =
 normalizeUrl(
  `${SITE_URL}/top/${slug}`
 );


 urls.push({

  loc,

  lastmod:now,

  changefreq:"weekly",

  priority:0.85

 });


});



/* ================= AMAZON HAUL ================= */


const haulPages=[

"viral-amazon-products",
"amazon-finds-under-25",
"tiktok-amazon-gadgets",
"best-amazon-deals"

];


haulPages.forEach(slug=>{


 urls.push({

  loc:
   `${SITE_URL}/amazon-haul/${slug}`,

  lastmod:now,

  changefreq:"daily",

  priority:0.85

 });


});



/* ================= CATEGORY ================= */


const categories=[

"electronics",
"smart-home",
"wearables",
"headphones",
"accessories",
"gaming"

];


categories.forEach(cat=>{


 urls.push({

  loc:
   `${SITE_URL}/category/${cat}`,

  lastmod:now,

  changefreq:"weekly",

  priority:0.8

 });


});



/* ================= COMPARE ================= */


const comparePages=[

"smart-watch-vs-fitness-band",
"airpods-vs-earbuds"

];


comparePages.forEach(slug=>{


 urls.push({

  loc:
   `${SITE_URL}/compare/${slug}`,

  lastmod:now,

  changefreq:"monthly",

  priority:0.7

 });


});



/* ================= STATIC ================= */


const staticPages=[

"",
"/products",
"/categories",
"/blog",
"/amazon-haul",
"/top",
"/compare"

];


staticPages.forEach(path=>{


 urls.push({

  loc:
   normalizeUrl(
    `${SITE_URL}${path}`
   ),

  lastmod:now,

  changefreq:"daily",

  priority:0.9

 });


});



/* ================= XML ================= */


const xmlUrls =
 urls
 .map(u=>`

<url>

<loc>${u.loc}</loc>

<lastmod>${u.lastmod}</lastmod>

<changefreq>${u.changefreq}</changefreq>

<priority>${u.priority}</priority>

</url>

`)
.join("");



return `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${xmlUrls}

</urlset>`;

    }
