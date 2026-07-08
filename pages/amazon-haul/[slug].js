// pages/amazon-haul/[slug].js

import Head from "next/head";

const haulPages = [
  {
    slug: "viral-amazon-products",
    title: "Viral Amazon Products",
    description: "Discover the most viral Amazon products trending online.",
    content:
      "Explore the latest viral Amazon finds, gadgets, home products and best sellers.",
  },
  {
    slug: "amazon-finds-under-25",
    title: "Amazon Finds Under $25",
    description: "Best Amazon products under $25.",
    content:
      "Affordable Amazon finds with excellent ratings and great value.",
  },
  {
    slug: "tiktok-amazon-gadgets",
    title: "TikTok Amazon Gadgets",
    description: "Trending TikTok gadgets available on Amazon.",
    content:
      "Popular gadgets that went viral on TikTok and are available on Amazon.",
  },
  {
    slug: "best-amazon-deals",
    title: "Best Amazon Deals",
    description: "Today's best Amazon deals.",
    content:
      "Hand-picked Amazon deals updated regularly.",
  },
];

export default function HaulPage({ page }) {
  return (
    <>
      <Head>
        <title>{page.title}</title>

        <meta
          name="description"
          content={page.description}
        />

        <meta
          name="robots"
          content="index,follow"
        />

        <link
          rel="canonical"
          href={`https://koloonline.online/amazon-haul/${page.slug}`}
        />
      </Head>

      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: 20,
        }}
      >
        <h1>{page.title}</h1>

        <p>{page.content}</p>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: haulPages.map((page) => ({
      params: {
        slug: page.slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const page = haulPages.find(
    (p) => p.slug === params.slug
  );

  if (!page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
    },
  };
}
