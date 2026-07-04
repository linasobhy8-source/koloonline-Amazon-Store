import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { getProductsFast } from "../../lib/firebaseQuery";
import {
safeText,
safeImage,
safeNumber,
} from "../../lib/safeProduct";

export default function Products({ products = [] }) {
const safeProducts = Array.isArray(products) ? products : [];

const schema = {
"@context": "https://schema.org",
"@type": "CollectionPage",
name: "Koloonline Products",
url: "https://koloonline.online/products",
description:
"Browse trending Amazon products selected by the Koloonline AI engine.",
};

return (
<>
<Head>
<title>Products | Koloonline</title>

<meta  
      name="description"  
      content="Browse trending Amazon products selected by the Koloonline AI engine."  
    />  

    <meta  
      name="robots"  
      content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"  
    />  

    <meta  
      name="viewport"  
      content="width=device-width,initial-scale=1"  
    />  

    <meta name="theme-color" content="#ff9900" />  

    <link  
      rel="canonical"  
      href="https://koloonline.online/products"  
    />  

    <meta property="og:type" content="website" />  
    <meta property="og:title" content="Koloonline Products" />  
    <meta  
      property="og:description"  
      content="Browse trending Amazon products selected by AI."  
    />  
    <meta  
      property="og:url"  
      content="https://koloonline.online/products"  
    />  
    <meta  
      property="og:image"  
      content="https://koloonline.online/logo.png"  
    />  

    <meta  
      name="twitter:card"  
      content="summary_large_image"  
    />  

    <script  
      type="application/ld+json"  
      dangerouslySetInnerHTML={{  
        __html: JSON.stringify(schema),  
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
    <h1>🔥 Products</h1>  

    <div  
      style={{  
        display: "grid",  
        gridTemplateColumns:  
          "repeat(auto-fit,minmax(220px,1fr))",  
        gap: 20,  
      }}  
    >  
      {safeProducts.map((p, index) => {  
        if (!p) return null;  

        const id = safeText(p.id);  
        const title = safeText(p.title);  
        const image = safeImage(p.image);  
        const price = safeNumber(p.price);  

        if (!id) return null;  

        return (  
          <Link  
            key={id}  
            href={`/product/${id}`}  
            style={{  
              textDecoration: "none",  
              color: "inherit",  
            }}  
          >  
            <article  
              style={{  
                border: "1px solid #ddd",  
                borderRadius: 10,  
                background: "#fff",  
                overflow: "hidden",  
                transition: "0.2s",  
              }}  
            >  
              <Image  
                src={image}  
                alt={title || "Product"}  
                width={220}  
                height={220}  
                quality={75}  
                priority={index < 2}  
                loading={index < 6 ? "eager" : "lazy"}  
                sizes="(max-width:768px) 50vw,220px"  
                style={{  
                  width: "100%",  
                  height: "220px",  
                  objectFit: "contain",  
                }}  
              />  

              <div style={{ padding: 12 }}>  
                <h2  
                  style={{  
                    fontSize: 16,  
                    marginBottom: 8,  
                  }}  
                >  
                  {title || "Untitled Product"}  
                </h2>  

                <p  
                  style={{  
                    fontWeight: 700,  
                    color: "#ff9900",  
                  }}  
                >  
                  ${price}  
                </p>  
              </div>  
            </article>  
          </Link>  
        );  
      })}  
    </div>  
  </main>  
</>

);
}

/* ================= DATA ================= */

export async function getStaticProps() {  try {
const raw = await getProductsFast();

const products = Array.isArray(raw)  
  ? raw  
      .filter((p) => p && typeof p === "object")  
      .map((p) => ({  
        id: String(p?.id || ""),  
        title:  
          typeof p?.title === "string"  
            ? p.title  
            : String(p?.title || ""),  
        image:  
          typeof p?.image === "string"  
            ? p.image  
            : "https://koloonline.online/logo.png",  
        price: Number(p?.price || 0),  
      }))  
  : [];  

return {  
  props: {  
    products,  
  },  
  revalidate: 300,  
};

} catch (error) {
console.error("Products page error:", error);

return {  
  props: {  
    products: [],  
  },  
  revalidate: 300,  
};

}
        }
