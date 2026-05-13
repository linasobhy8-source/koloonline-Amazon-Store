import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setProducts(data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>

      <Head>
        <title>All Products | Koloonline</title>
        <meta name="description" content="Browse all Amazon products" />
        <link rel="canonical" href="https://koloonline.online/products" />
      </Head>

      <h1>📦 All Products</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 15,
          }}
        >
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`}>
              <div style={{
                background: "white",
                padding: 10,
                borderRadius: 10,
                cursor: "pointer"
              }}>
                <img src={p.image} style={{ width: "100%" }} />
                <h4>{p.title}</h4>
                <p style={{ color: "red" }}>${p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
