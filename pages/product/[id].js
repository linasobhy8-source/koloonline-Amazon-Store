import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { getProductsFast } from "../../lib/firebaseQuery";
import { safeText, safeImage, safeNumber } from "../../lib/normalizeProduct";

export default function ProductPage({ product, related }) {
  if (!product) return <div>Not found</div>;

  const title = String(safeText(product.title));
  const description = String(safeText(product.description));
  const image = String(safeImage(product.image));
  const price = Number(safeNumber(product.price));

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <div style={{ padding: 20 }}>
        <h1>{title}</h1>

        <Image
          src={
            image.startsWith("http")
              ? image
              : "https://via.placeholder.com/500"
          }
          width={500}
          height={500}
          alt={title}
        />

        <h2>{price > 0 ? `$${price}` : ""}</h2>

        <p>{description}</p>

        <Link href="/">Home</Link>

        {Array.isArray(related) &&
          related.map((p) => (
            <div key={p.id}>
              {String(p.title)}
            </div>
          ))}
      </div>
    </>
  );
}

export async function getStaticProps({ params }) {
  const products = await getProductsFast();

  const product = products.find(
    (p) => p.id === params.id
  );

  if (!product) return { notFound: true };

  return {
    props: {
      product,
      related: products.slice(0, 6),
    },
    revalidate: 3600,
  };
}

export async function getStaticPaths() {
  const products = await getProductsFast();

  return {
    paths: products.slice(0, 20).map((p) => ({
      params: { id: p.id },
    })),
    fallback: "blocking",
  };
      }
