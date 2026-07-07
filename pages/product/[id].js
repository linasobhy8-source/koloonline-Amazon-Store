import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import {
collection,
getDocs,
query,
limit,
} from "firebase/firestore";

import { db } from "../../config/firebase";

const SITE_URL = "https://koloonline.online";

/* ================= SAFE HELPERS ================= */

const safeText = (v) => {
if (v == null) return "";

if (typeof v === "string") return v.trim();

if (
typeof v === "number" ||
typeof v === "boolean"
) {
return String(v);
}

if (Array.isArray(v)) {
return v.map(safeText).join(" ");
}

if (typeof v === "object") {
return (
safeText(v.title) ||
safeText(v.name) ||
safeText(v.value) ||
""
);
}

return "";
};

const safeNumber = (v) => {
const n = Number(v);
return Number.isFinite(n) ? n : 0;
};

const safeImage = (img) => {

if (
typeof img === "string" &&
img.startsWith("http")
) {
return img;
}

if (Array.isArray(img) && img.length) {
return safeImage(img[0]);
}

if (typeof img === "object" && img) {

return (  
  img.url ||  
  img.src ||  
  img.image ||  
  `${SITE_URL}/logo.png`  
);

}

return ${SITE_URL}/logo.png;

};

/* ================= AI SCORE ================= */

const calcScore = (p = {}) => {

const views = safeNumber(p.views);
const clicks = safeNumber(p.clicks);
const orders = safeNumber(p.orders);
const rating = safeNumber(p.rating);

return (
views * 0.2 +
clicks * 0.7 +
orders * 5 +
rating * 12 +
(p.viralBoost ? 80 : 0)
);

};

const getLevel = (score) => {

if (score >= 350)
return "elite";

if (score >= 220)
return "strong";

if (score >= 120)
return "good";

return "normal";

};

const getRobots = () =>
"index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

/* ================= PRODUCT PAGE ================= */

export default function ProductPage({
product,
relatedProducts,
}) {

const title =
safeText(product.title) ||
"Amazon Product";

const desc =
safeText(product.description) ||
Discover ${title} with detailed information and Amazon offers.;

const image =
safeImage(
product.image ||
product.images
);

const url =
${SITE_URL}/product/${product.slug || product.id};

const score =
calcScore(product);

const level =
getLevel(score);

const seoTitle =
${title} Review & Best Price;

const seoDesc =
desc.substring(0,160);

const schema = {

"@context":"https://schema.org",  

"@type":"Product",  

"name":title,  

"image":[image],  

"description":seoDesc,  

"brand":{  
  "@type":"Brand",  
  "name":"Amazon"  
},  


"offers":{  

  "@type":"Offer",  

  "url":url,  

  "priceCurrency":"USD",  

  "price":safeNumber(product.price),  

  "availability":  
  "https://schema.org/InStock"  

}

};

return (

<>

<Head>  <title>  
{seoTitle} | Koloonline  
</title>  <meta  
name="description"  
content={seoDesc}  
/>

<meta  
name="robots"  
content={getRobots()}  
/>

<link  
rel="canonical"  
href={url}  
/>  <link  
rel="preconnect"  
href="https://m.media-amazon.com"  
/>  <link  
rel="dns-prefetch"  
href="//m.media-amazon.com"  
/>  <meta  
property="og:type"  
content="product"  
/>

<meta  
property="og:site_name"  
content="Koloonline"  
/>

<meta  
property="og:title"  
content={seoTitle}  
/>

<meta  
property="og:description"  
content={seoDesc}  
/>

<meta  
property="og:url"  
content={url}  
/>

<meta  
property="og:image"  
content={image}  
/>

<meta  
name="twitter:card"  
content="summary_large_image"  
/>

<meta  
name="twitter:title"  
content={seoTitle}  
/>

<meta  
name="twitter:description"  
content={seoDesc}  
/>

<meta  
name="twitter:image"  
content={image}  
/>

<script  
type="application/ld+json"  
dangerouslySetInnerHTML={{  
__html:JSON.stringify(schema)  
}}  
/>  
  
  
</Head>  
  
  
  
<main  
style={{  
maxWidth:900,  
margin:"0 auto",  
padding:20  
}}  
>  
  
  
<header>  
  
<h1>  
{title}  
</h1>  
  
  
<p  
style={{  
color:"#666",  
lineHeight:1.7  
}}  
>  
{seoDesc}  
</p>  
  
  
</header>  
  
  
  
  
<div  
style={{  
marginTop:25  
}}  
>  
  
  
<Image  
  
src={image}  
  
alt={title}  
  
width={900}  
  
height={650}  
  
priority  
  
quality={80}  
  
sizes="(max-width:768px)100vw,900px"  
  
style={{  
width:"100%",  
height:"auto",  
borderRadius:12,  
objectFit:"contain"  
}}  
  
/>  
  
  
</div>  
  
  
  
  
  
<section  
style={{  
marginTop:30  
}}  
>  
  
  
<h2>  
Product Details  
</h2>  
  
  
  
<p>  
{desc}  
</p>  
  
  
  
<p>  
<strong>  
Price:  
</strong>{" "}  
${safeNumber(product.price)}  
</p>  
  
  
  
<p>  
<strong>  
Category:  
</strong>{" "}  
{safeText(product.category)}  
</p>  
  
  
  
<p>  
<strong>  
Rating:  
</strong>{" "}  
{safeNumber(product.rating)}  
</p>  
  
  
  
<p>  
<strong>  
AI Score:  
</strong>{" "}  
{score.toFixed(0)}  
</p>  
  
  
  
<p>  
<strong>  
Level:  
</strong>{" "}  
{level}  
</p>  
  
  
  
  
{  
product.link && (  
  
<a  
  
href={product.link}  
  
target="_blank"  
  
rel="nofollow sponsored noopener"  
  
style={{  
  
display:"inline-block",  
  
marginTop:20,  
  
padding:"14px 26px",  
  
background:"#ff9900",  
  
color:"#fff",  
  
borderRadius:8,  
  
textDecoration:"none",  
  
fontWeight:700  
  
}}  
  
>  
  
Buy on Amazon  
  
</a>  
  
)  
  
}  
  
  
  
</section>  
{/* ================= RELATED PRODUCTS ================= */}  
  
  
{  
relatedProducts &&  
relatedProducts.length > 0 && (  
  
<section  
style={{  
marginTop:50  
}}  
>  
  
  
<h2>  
🔥 Trending Products  
</h2>  
  
  
  
<div  
  
style={{  
  
display:"grid",  
  
gridTemplateColumns:  
"repeat(auto-fit,minmax(220px,1fr))",  
  
gap:18,  
  
marginTop:20  
  
}}  
  
>  
  
  
{  
relatedProducts.map((item)=>{  
  
  
const itemTitle =  
safeText(item.title) ||  
"Amazon Product";  
  
  
const itemSlug =  
item.slug ||  
item.asin ||  
item.id;  
  
  
  
return (  
  
<Link  
  
key={item.id}  
  
href={`/product/${itemSlug}`}  
  
style={{  
  
textDecoration:"none",  
  
color:"inherit"  
  
}}  
  
>  
  
  
  
<article  
  
style={{  
  
border:"1px solid #eee",  
  
borderRadius:10,  
  
padding:14,  
  
background:"#fff"  
  
}}  
  
>  
  
  
  
<h3  
  
style={{  
  
fontSize:15,  
  
lineHeight:1.5,  
  
margin:0  
  
}}  
  
>  
  
{itemTitle}  
  
</h3>  
  
  
  
<p  
  
style={{  
  
color:"#ff9900",  
  
fontWeight:700  
  
}}  
  
>  
  
AI Score:  
{" "}  
{  
Math.round(  
calcScore(item)  
)  
}  
  
</p>  
  
  
  
</article>  
  
  
</Link>  
  
);  
  
  
})  
  
}  
  
  
</div>  
  
  
</section>  
  
)  
  
}  
  
  
  
</main>  
  
</>  
  
);  
  
}  
  
  
  
  
/* ================= STATIC DATA ================= */  
  
  
export async function getStaticProps({params}){  
  
  
try{  
  
  
const snap =  
await getDocs(  
  
query(  
  
collection(db,"products"),  
  
limit(300)  
  
)  
  
);  
  
  
  
const products =  
snap.docs.map(doc=>({  
  
id:doc.id,  
  
...doc.data()  
  
}));  
  
  
  
  
  
const id =  
String(params.id);  
  
  
  
  
  
const product =  
  
products.find(  
  
(p)=>  
  
String(p.slug || "") === id ||  
  
String(p.asin || "") === id ||  
  
String(p.id) === id  
  
)  
  
|| null;  
  
  
  
  
  
  
if(!product){  
  
  
return {  
  
notFound:true,  
  
revalidate:300  
  
};  
  
  
}  
  
  
  
  
  
const relatedProducts =  
  
products  
  
.filter(  
  
(p)=>  
  
p.id !== product.id  
  
)  
  
.sort(  
  
(a,b)=>  
  
calcScore(b)-calcScore(a)  
  
)  
  
.slice(0,12);  
  
  
  
  
  
  
return {  
  
  
props:{  
  
  
product,  
  
relatedProducts  
  
  
},  
  
  
  
revalidate:300  
  
  
};  
  
  
  
  
}  
  
catch(error){  
  
  
console.error(  
"Product page error:",  
error  
);  
  
  
  
return {  
  
notFound:true,  
  
revalidate:300  
  
};  
  
  
}  
  
  
  
}  
  
  
  
  
  
  
/* ================= STATIC PATHS ================= */  
  
  
export async function getStaticPaths(){  
  
  
try{  
  
  
const snap =  
  
await getDocs(  
  
query(  
  
collection(db,"products"),  
  
limit(300)  
  
)  
  
);  
  
  
  
  
  
const paths =  
  
snap.docs  
  
.map((doc)=>{  
  
  
const data =  
doc.data() || {};  
  
  
  
const slug =  
  
data.slug ||  
  
data.asin ||  
  
doc.id;  
  
  
  
if(!slug)  
return null;  
  
  
  
return {  
  
  
params:{  
  
id:String(slug)  
  
}  
  
  
};  
  
  
})  
  
  
.filter(Boolean);  
  
  
  
  
  
  
return {  
  
  
paths,  
  
fallback:"blocking"  
  
  
};  
  
  
  
  
  
}  
  
catch(error){  
  
  
console.error(  
  
"getStaticPaths error:",  
  
error  
  
);  
  
  
  
  
return {  
  
  
paths:[],  
  
fallback:"blocking"  
  
  
};  
  
  
  
}  
  
  
  
  }
