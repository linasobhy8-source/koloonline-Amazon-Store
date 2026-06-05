import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProductsFast } from "../../lib/firebaseQuery";
import { optimizeAmazonImage } from "../../lib/amazonImage";

const fallbackImage = "https://via.placeholder.com/500x500";

export default function ProductPage({ product, related }) {
  if (!product) return <div>Not found</div>;

  const url = `https://koloonline.online/product/${product.id}`;
  const imageSrc = optimizeAmazonImage(product.image) || fallbackImage;

  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>{product.title}</title>
      </Head>

      <h1>{product.title}</h1>

      <Image
        src={imageSrc}
        width={500}
        height={500}
        alt={product.title}
        priority
      />

      <h2>${product.price}</h2>

      <p>{product.description}</p>

      <Link href="/products">Back</Link>

      <h2>Related</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
        {related.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <div>
              <Image
                src={optimizeAmazonImage(p.image) || fallbackImage}
                width={200}
                height={200}
                alt={p.title}
                loading="lazy"
              />
              <p>{p.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const products = await getProductsFast();

  const product = products.find((p) => p.id === params.id);

  if (!product) return { notFound: true };

  const related = products.filter((p) => p.id !== params.id).slice(0, 4);

  return {
    props: { product, related },
    revalidate: 3600,
  };
}

export async function getStaticPaths() {
  const products = await getProductsFast();

  return {
    paths: products.slice(0, 50).map((p) => ({
      params: { id: p.id },
    })),
    fallback: "blocking",
  };
                  }
