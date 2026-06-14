// pages/amazon-haul/[slug].js

import Head from "next/head";

export default function HaulPage({ page }) {
  if (!page) {
    return (
      <>
        <Head>
          <title>Page Not Found | Koloonline</title>
          <meta
            name="robots"
            content="noindex,nofollow"
          />
        </Head>

        <main
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          <h1>Page Not Found</h1>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{page.title || "Amazon Haul"}</title>

        <meta
          name="description"
          content={page.description || ""}
        />

        <meta
          name="robots"
          content="index,follow"
        />

        <link
          rel="canonical"
          href={`https://koloonline.online/amazon-haul/${page.slug || ""}`}
        />
      </Head>

      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <h1>{page.title || "Amazon Haul"}</h1>

        <p>{page.content || ""}</p>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps() {
  return {
    notFound: true,
  };
}
