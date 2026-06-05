import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { getProductsFast } from "../../lib/firebaseQuery";
import { optimizeAmazonImage } from "../../lib/amazonImage";

export default function ProductPage({ product, related }) {
  if (!product) return <div>Not Found</div>;

  return (
    <>
      <Head>
        <title>{product.title}</title>
      </Head>

      <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
        <h1>{product.title}</h1>

        <Image
          src={optimizeAmazonImage(product.image)}
          width={500}
          height={500}
          alt={product.title}
          priority
        />

        <h2>${product.price}</h2>

        {/* Affiliate Button */}
        <button
          onClick={() => {
            window.open(
              product.affiliateLink || product.link,
              "_blank"
            );
          }}
          style={{
            padding: 15,
            background: "#ff9900",
            border: 0,
            width: "100%",
            marginTop: 10,
          }}
        >
          🛒 Buy Now
        </button>

        <h3>Related</h3>

        <div style={{ display: "flex", gap: 10 }}>
          {related.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`}>
              <div>
                <Image
                  src={optimizeAmazonImage(p.image)}
                  width={150}
                  height={150}
                  alt={p.title}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const products = await getProductsFast();

  const product = products.find((p) => p.id === params.id);

  if (!product) return { notFound: true };

  return {
    props: {
      product,
      related: products.slice(0, 4),
    },
    revalidate: 3600,
  };
            }
