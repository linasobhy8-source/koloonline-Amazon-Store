import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { safeText, safeNumber, safeImage } from "../lib/safeProduct";

export default function Home({ products = [] }) {
const safeProducts = Array.isArray(products) ? products : [];

const websiteSchema = {
"@context": "https://schema.org",
"@type": "WebSite",
name: "Koloonline",
url: "https://koloonline.online/",
potentialAction: {
"@type": "SearchAction",
target: "https://koloonline.online/search?q={search_term_string}",
"query-input": "required name=search_term_string",
},
};

return (
<>
<Head>
<title>Koloonline | Trending Amazon Products</title>

<meta  
      name="description"  
      content="Discover trending Amazon products, AI-powered recommendations, best deals, buying guides and viral gadgets updated automatically."  
    />  

    <meta  
      name="keywords"  
      content="Amazon Deals, Trending Products, AI Shopping, Best Amazon Products, Gadgets"  
    />  

    <meta  
      name="robots"  
      content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"  
    />  

    <meta name="viewport" content="width=device-width,initial-scale=1" />  

    <meta name="theme-color" content="#ff9900" />  

    <link rel="canonical" href="https://koloonline.online/" />  

    <link rel="preconnect" href="https://m.media-amazon.com" />  
    <link rel="dns-prefetch" href="//m.media-amazon.com" />  

    <meta property="og:title" content="Koloonline Store" />  

    <meta  
      property="og:description"  
      content="Trending Amazon products powered by AI."  
    />  

    <meta property="og:type" content="website" />  

    <meta  
      property="og:image"  
      content="https://koloonline.online/logo.png"  
    />  

    <meta property="og:url" content="https://koloonline.online/" />  

    <meta name="twitter:card" content="summary_large_image" />  

    <script  
      type="application/ld+json"  
      dangerouslySetInnerHTML={{  
        __html: JSON.stringify(websiteSchema),  
      }}  
    />  
  </Head>  

  <main  
    style={{  
      maxWidth: 1400,  
      margin: "0 auto",  
      padding: 20,  
    }}  
  >  
    <h1>🔥 Trending Products</h1>  

    <p style={{ color: "#666", maxWidth: 700 }}>  
      Discover the most trending Amazon products updated automatically  
      based on AI ranking, popularity, engagement and customer demand.  
    </p>  

    <div  
      style={{  
        display: "grid",  
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",  
        gap: 20,  
      }}  
    >  
      {safeProducts.map((p, index) => {  
        if (!p || typeof p !== "object") return null;  

        const id = safeText(p.id);  
        const title = safeText(p.title);  
        const price = safeNumber(p.price);  
        const image = safeImage(p.image);  

        if (!id) return null;  

        return (  
          <Link key={id} href={`/product/${id}`} prefetch={false}>  
            <div  
              style={{  
                border: "1px solid #ddd",  
                padding: 10,  
                borderRadius: 10,  
                background: "#fff",  
              }}  
            >  
              <Image  
                src={image}  
                width={220}  
                height={220}  
                alt={title || "product"}  
                priority={index < 2}  
                loading={index < 2 ? "eager" : "lazy"}  
                sizes="(max-width:768px) 50vw,(max-width:1200px) 33vw,220px"  
                quality={75}  
                style={{  
                  width: "100%",  
                  height: "auto",  
                  objectFit: "cover",  
                  borderRadius: 8,  
                }}  
              />  

              <h3>  
                {title && title.length > 0  
                  ? title  
                  : "Untitled Product"}  
              </h3>  

              <p style={{ fontWeight: "bold" }}>  
                ${typeof price === "number" ? price : 0}  
              </p>  
            </div>  
          </Link>  
        );  
      })}  
    </div>  
  </main>  
</>

);
}

/* ================= SSR SAFE ================= */
export async function getStaticProps() {  try {
const { getProductsFast } = await import("../lib/firebaseQuery");

const raw = await getProductsFast();  

const products = JSON.parse(JSON.stringify(raw || []));  

return {  
  props: {  
    products: Array.isArray(products) ? products : [],  
  },  
  revalidate: 300,  
};

} catch (e) {
console.error("Home build error:", e);

return {  
  props: {  
    products: [],  
  },  
  revalidate: 300,  
};

}
        }
