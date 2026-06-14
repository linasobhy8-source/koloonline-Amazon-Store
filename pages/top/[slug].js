// pages/top/[slug].js

import Head from "next/head";
import Link from "next/link";
import { topPages } from "../../data/topPages";

export default function TopPage({ page }) {
  if (!page) {
    return <div>Page Not Found</div>;
  }

  const pageUrl = `https://koloonline.online/top/${page.slug}`;

  return (
    <>
      <Head>
        <title>{page.title}</title>

        <meta
          name="description"
          content={page.description}
        />

        <link
          rel="canonical"
          href={pageUrl}
        />

        <meta
          property="og:title"
          content={page.title}
        />

        <meta
          property="og:description"
          content={page.description}
        />

        <meta
          property="og:url"
          content={pageUrl}
        />

        <meta
          property="og:type"
          content="article"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: page.title,
              description: page.description,
              url: pageUrl,
            }),
          }}
        />
      </Head>

      <main className="container">
        <h1>{page.h1}</h1>

        <p>{page.intro}</p>

        <h2>Top Recommendations</h2>

        <ul>
          {page.items?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2>Buying Guide</h2>

        <p>{page.buyingGuide}</p>

        <h2>Frequently Asked Questions</h2>

        {page.faq?.map((faq, index) => (
          <div key={index}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}

        <hr />

        <h2>Explore More</h2>

        <ul>
          <li>
            <Link href="/amazon-haul/trending-now">
              Amazon Haul Deals
            </Link>
          </li>

          <li>
            <Link href="/blog">
              Shopping Guides
            </Link>
          </li>
        </ul>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const paths = topPages.map((page) => ({
    params: {
      slug: page.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const page =
    topPages.find(
      (item) => item.slug === params.slug
    ) || null;

  return {
    props: {
      page,
    },
  };
}
