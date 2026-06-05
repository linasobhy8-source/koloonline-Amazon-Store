import Link from "next/link";
import Image from "next/image";
import { getProductsFast } from "../../lib/firebaseQuery";
import { optimizeAmazonImage } from "../../lib/imageCDN";

export default function Products({ products }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 Products</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <div>
              <Image
                src={optimizeAmazonImage(p.image)}
                width={200}
                height={200}
                alt={p.title}
              />
              <h3>{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const products = await getProductsFast();

  return {
    props: { products },
    revalidate: 300,
  };
                  }
