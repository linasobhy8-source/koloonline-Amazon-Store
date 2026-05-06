import Head from "next/head";
import Link from "next/link";
import { db } from "../../config/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function Blog({ posts }) {
  return (
    <div style={{ padding: 20 }}>

      <Head>
        <title>Blog | Koloonline</title>
        <meta name="description" content="Best Amazon guides and deals" />
      </Head>

      <h1>🔥 Blog</h1>

      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: 20 }}>
          <h2>{post.title}</h2>

          <Link href={`/blog/${post.id}`}>
            <button>📖 Read Article</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const snap = await getDocs(
    query(collection(db, "blog"), orderBy("createdAt", "desc"))
  );

  const posts = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  return {
    props: { posts },
  };
}
