import Head from "next/head";
import Link from "next/link";
import { topPages } from "../../data/topPages";

/* ================= SAFE HELPERS ================= */
const safeText = (v) => {
  if (v === null || v === undefined) return "";

  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v);
  }

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  if (typeof v === "object") {
    return v?.text || v?.title || v?.value || v?.name || "";
  }

  return "";
};

export default function TopPage({ page }) {
  if (!page) return <div>Page Not Found</div>;

  const title = safeText(page.title);
  const description = safeText(page.description);
  const h1 = safeText(page.h1);
  const intro = safeText(page.intro);
  const buyingGuide = safeText(page.buyingGuide);

  const items = Array.isArray(page.items) ? page.items : [];
  const faq = Array.isArray(page.faq) ? page.faq : [];

  const pageUrl = `https://koloonline.online/top/${safeText(page.slug)}`;

  /* ================= FAQ SCHEMA ================= */
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: safeText(f?.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: safeText(f?.answer),
      },
    })),
  };

  /* ================= BREADCRUMB ================= */
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
        name: title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta name="description" content={description} />
        <meta
          name="keywords"
          content={`${title}, Amazon Deals, Best Products, Top Products`}
        />

        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href={pageUrl} />

        {/* OG */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />

        {/* Article Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: title,
              description: description,
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
        <h1>{h1}</h1>

        <p>{intro}</p>

        <h2>Top Recommendations</h2>

        <ul>
          {items.map((item, index) => (
            <li key={index}>{safeText(item)}</li>
          ))}
        </ul>

        <h2>Buying Guide</h2>
        <p>{buyingGuide}</p>

        <h2>Frequently Asked Questions</h2>

        {faq.map((f, index) => (
          <div key={index} style={{ marginBottom: 20 }}>
            <h3>{safeText(f.question)}</h3>
            <p>{safeText(f.answer)}</p>
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
            <Link href="/blog">Shopping Guides</Link>
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
      params: {
        slug: String(page.slug || ""),
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const page =
    topPages.find((item) => item.slug === params.slug) || null;

  if (!page) {
    return { notFound: true };
  }

  return {
    props: {
      page,
    },
  };
        }
