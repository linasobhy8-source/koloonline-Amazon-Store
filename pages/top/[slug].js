// pages/top/[slug].js

import Head from "next/head";
import Link from "next/link";
import { topPages } from "../../data/topPages";

export default function TopPage({ page }) {
  if (!page) return <div>Page Not Found</div>;

  const pageUrl = `https://koloonline.online/top/${page.slug}`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity:
      page.faq?.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })) || [],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://koloonline.online",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Top Products",
        item: "https://koloonline.online/top",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{page.title}</title>

        <meta
          name="description"
          content={page.description}
        />

        <meta
          name="keywords"
          content={`${page.title}, Amazon Deals, Amazon Finds, Best Products, Top Products`}
        />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <link
          rel="canonical"
          href={pageUrl}
        />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:url" content={pageUrl} />
        <meta
          property="og:image"
          content="https://koloonline.online/og-image.jpg"
        />

        {/* Twitter */}
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          name="twitter:title"
          content={page.title}
        />
        <meta
          name="twitter:description"
          content={page.description}
        />
        <meta
          name="twitter:image"
          content="https://koloonline.online/og-image.jpg"
        />

        {/* Article Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: page.title,
              description: page.description,
              url: pageUrl,
              publisher: {
                "@type": "Organization",
                name: "Koloonline",
              },
            }),
          }}
        />

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      </Head>

      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <h1>{page.h1}</h1>

        <p>{page.intro}</p>

        <h2>Top Recommendations</h2>

        <ul>
          {page.items?.map((item, index) => (
            <li key={index}>
              <strong>{item}</strong>
            </li>
          ))}
        </ul>

        <h2>Buying Guide</h2>

        <p>{page.buyingGuide}</p>

        <h2>Frequently Asked Questions</h2>

        {page.faq?.map((faq, index) => (
          <div
            key={index}
            style={{ marginBottom: "20px" }}
          >
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}

        <hr />

        <h2>Explore More Amazon Deals</h2>

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

          <li>
            <Link href="/top/top-best-sellers">
              Amazon Best Sellers
            </Link>
          </li>

          <li>
            <Link href="/top/top-amazon-finds">
              Amazon Finds
            </Link>
          </li>
        </ul>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: topPages.map((page) => ({
      params: { slug: page.slug },
    })),
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
