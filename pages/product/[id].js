import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";

/* ================= SAFE ================= */
const safe = (v) => {
if (v == null) return "";

if (typeof v === "string") return v;
if (typeof v === "number" || typeof v === "boolean") return String(v);

if (Array.isArray(v)) {
return v.map((x) => safe(x)).join(" ");
}

if (typeof v === "object") {
return String(
v?.text ||
v?.title ||
v?.name ||
v?.value ||
""
);
}

return "";
};

const safeImage = (v) => {
const fallback =
"https://via.placeholder.com/500x500?text=Koloonline";

if (typeof v === "string" && v.startsWith("http")) {
return v;
}

if (v && typeof v === "object") {
const img = v.url || v.image || v.src;

if (typeof img === "string" && img.startsWith("http")) {
  return img;
}

}

return fallback;
};

const safeNumber = (v) => {
const n = Number(v);
return Number.isFinite(n) ? n : 0;
};

/* ================= PAGE ================= */
export default function ProductPage({ product, related }) {
if (!product) {
return <div style={{ padding: 20 }}>Not found</div>;
}

const title = safe(product?.title);
const description = safe(product?.description);
const image = safeImage(product?.image);
const price = safeNumber(product?.price);

return (
<>
<Head>
<title>{title || "Product"}</title>
<meta
name="description"
content={description || "Product"}
/>
</Head>

  <div style={{ padding: 20 }}>
    <h1>{title}</h1>

    <Image
      src={image}
      width={500}
      height={500}
      alt={title || "Product"}
      unoptimized
    />

    {price > 0 && <h2>${price}</h2>}

    <p>{description}</p>

    <Link href="/">Home</Link>

    <hr />

    <h3>Related Products</h3>

    {Array.isArray(related) &&
      related.map((p, index) => (
        <div key={p?.id || index}>
          {safe(p?.title)}
        </div>
      ))}
  </div>
</>

);
}

/* ================= DATA ================= */
export async function getStaticProps({ params }) {
try {
const products = await getProductsFast();

const product = (products || []).find(
  (p) => String(p?.id) === String(params?.id)
);

if (!product) {
  console.log(
    "PRODUCT NOT FOUND:",
    params?.id
  );

  return {
    notFound: true,
  };
}

console.log(
  "PRODUCT DEBUG:",
  JSON.stringify(product, null, 2)
);

return {
  props: {
    product: JSON.parse(
      JSON.stringify(product)
    ),

    related: JSON.parse(
      JSON.stringify(
        (products || []).slice(0, 6)
      )
    ),
  },

  revalidate: 3600,
};

} catch (error) {
console.error(
"PRODUCT PAGE ERROR:",
error
);

return {
  notFound: true,
};

}
}

/* ================= PATHS ================= */
export async function getStaticPaths() {
try {
const products = await getProductsFast();

return {
  paths: (products || [])
    .filter((p) => p?.id)
    .slice(0, 20)
    .map((p) => ({
      params: {
        id: String(p.id),
      },
    })),

  fallback: "blocking",
};

} catch (error) {
console.error(
"PATHS ERROR:",
error
);

return {
  paths: [],
  fallback: "blocking",
};

}
  }
