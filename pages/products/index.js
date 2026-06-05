import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { fetchProducts } from "../../lib/fetchProducts";
import { optimizeAmazonImage } from "../../lib/amazonImage";

const fallbackImage = "https://via.placeholder.com/500x500";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const filtered = useMemo(() => {
    return products.slice(0, 40); // 🔥 تقليل الحمل
  }, [products]);

  if (!products.length) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, padding: 20 }}>
        {Array(8).fill(0).map((_, i) => (
          <div key={i} style={{ height: 250, background: "#eee", borderRadius: 10 }} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Products</title>
      </Head>

      <h1>Trending Products</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 20,
        }}
      >
        {filtered.map((p, index) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <div>
              <Image
                src={optimizeAmazonImage(p.image) || fallbackImage}
                width={300}
                height={300}
                alt={p.title}
                priority={index < 6}   // 🔥 أهم تحسين
                style={{ objectFit: "contain" }}
              />
              <h3>{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
