import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function Product({ product }) {
  if (!product) return <p>Not found</p>;

  return (
    <div>
      <Head>
        <title>{product.title}</title>
        <meta name="description" content={product.title} />
      </Head>

      <h1>{product.title}</h1>
      <img src={product.image} width="300" />
      <p>${product.price}</p>
      <a href={product.link}>Buy</a>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const snap = await getDoc(doc(db, "products", ctx.params.id));

  return {
    props: {
      product: snap.exists() ? snap.data() : null,
    },
  };
}
