import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

import { getProductsFast } from "../../lib/firebaseQuery";
import { optimizeAmazonImage } from "../../lib/amazonImage";

export default function ProductsPage({ products }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const t = search.toLowerCase();

    return products
      .filter((p) => (p.title || "").toLowerCase().includes(t))
      .slice(0, 80);
  }, [search, products]);

  return (
    <>
      <Head>
        <title>Trending Products</title>
      </Head>

      <div style={{ padding: 20 }}>
        <input
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: 12 }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 15,
            marginTop: 20,
          }}
        >
          {filtered.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`}>
              <div style={{ background: "#fff", padding: 10 }}>
                <Image
                  src={optimizeAmazonImage(p.image)}
                  width={200}
                  height={200}
                  alt={p.title}
                />

                <h4>{p.title}</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const products = await getProductsFast();

  return {
    props: { products },
    revalidate: 120,
  };
}
