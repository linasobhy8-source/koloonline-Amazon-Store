import Image from "next/image";
import { getProductsFast } from "../../lib/firebaseQuery";
import { optimizeImage } from "../../lib/image";

export default function Product({ product }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>{product.title}</h1>

      <Image
        src={optimizeImage(product.image)}
        width={400}
        height={400}
        alt={product.title}
      />

      <p>{product.description}</p>
    </div>
  );
}

export async function getStaticPaths() {
  const products = await getProductsFast();

  return {
    paths: products.slice(0, 80).map((p) => ({
      params: { id: p.id },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const products = await getProductsFast();

  const product = products.find((p) => p.id === params.id);

  return {
    props: { product },
    revalidate: 3600,
  };
}
