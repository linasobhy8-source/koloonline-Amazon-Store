import Head from "next/head";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Article({ post }) {
  if (!post) return <p>Not found</p>;

  return (
    <div style={{ padding: 20 }}>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.title} />
      </Head>

      <h1>{post.title}</h1>

      <div style={{ whiteSpace: "pre-line" }}>
        {post.content}
      </div>

      {/* 🔥 Affiliate CTA */}
      <div style={{ marginTop: 30 }}>
        <a href="https://www.amazon.com?tag=koloonlinesto-20" target="_blank">
          <button style={{ padding: 15, background: "orange" }}>
            🛒 Shop Related Products
          </button>
        </a>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const docRef = doc(db, "blog", params.id);
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    return { notFound: true };
  }

  return {
    props: {
      post: {
        id: snap.id,
        ...snap.data(),
      },
    },
  };
}
