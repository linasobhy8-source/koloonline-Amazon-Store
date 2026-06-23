import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const fallback = "https://via.placeholder.com/300x300?text=Koloonline";

const safeText = (v) => {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "object" && v !== null) {
    return v.title || v.text || v.name || "";
  }
  return "";
};

const safeImage = (v) => {
  if (typeof v === "string") return v;
  if (typeof v === "object" && v !== null) {
    return v.url || v.image || v.src || fallback;
  }
  return fallback;
};

export default function Home({ products = [] }) {
  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>Koloonline</title>
      </Head>

      <h1>🔥 Trending Products</h1>

      <div style={{ display: "grid", gap: 20 }}>
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <div>
              <Image
                src={safeImage(p.image)}
                width={300}
                height={300}
                alt={safeText(p.title)}
                unoptimized
              />

              <h3>{safeText(p.title)}</h3>
              <p>${Number(p.price || 0)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      props: { products },
      revalidate: 300,
    };
  } catch {
    return { props: { products: [] } };
  }
          }
