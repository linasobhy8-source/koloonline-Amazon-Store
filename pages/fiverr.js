import Head from "next/head";

/* ================= FIVERR PAGE SAFE ================= */

const fiverrLink =
  "https://go.fiverr.com/visit/?bta=1148086&brand=fiverrmarketplace";

const services = [
  {
    title: "AI Content Writing",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Professional SEO articles, blog posts, and AI-powered content for websites and businesses.",
  },
  {
    title: "Logo Design",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Modern and clean logo designs tailored for startups and personal brands.",
  },
  {
    title: "Video Editing",
    image:
      "https://images.unsplash.com/photo-1574717024453-35405626e6a0?q=80&w=1200&auto=format&fit=crop",
    desc:
      "High-quality TikTok, YouTube, and short-form video editing with viral style.",
  },
  {
    title: "SEO Optimization",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Improve your Google rankings with advanced SEO strategies and keyword optimization.",
  },
  {
    title: "Website Development",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Responsive websites built with React and Next.js for fast performance.",
  },
  {
    title: "Digital Marketing",
    image:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Grow your business with targeted social media marketing campaigns.",
  },
];

export default function FiverrPage() {
  return (
    <div style={{ fontFamily: "Arial", background: "#f5f7fb" }}>
      {/* ================= SEO (ADSENSE FRIENDLY) ================= */}
      <Head>
        <title>Best Fiverr Services 2026 | Reviews & Freelancers Guide</title>

        <meta
          name="description"
          content="Discover the best Fiverr services in 2026 including AI writing, logo design, SEO, and video editing. Real reviews and hiring guide for freelancers."
        />

        <meta
          name="keywords"
          content="fiverr services, freelance jobs, ai writing, logo design, seo services, video editing"
        />

        <meta name="robots" content="index,follow" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: "Best Fiverr Services 2026",
              description:
                "Guide and reviews for top Fiverr freelance services.",
              author: {
                "@type": "Organization",
                name: "Koloonline",
              },
            }),
          }}
        />
      </Head>

      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(135deg,#111827,#1f2937)",
          color: "white",
          textAlign: "center",
          padding: 60,
        }}
      >
        <h1>🚀 Best Fiverr Services 2026</h1>

        <p style={{ maxWidth: 800, margin: "auto", color: "#ccc" }}>
          Fiverr has become one of the most trusted platforms for hiring
          freelancers worldwide. From content creation to web development,
          you can find skilled professionals for every digital need.
        </p>

        <a
          href={fiverrLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#1dbf73",
            color: "white",
            padding: 15,
            display: "inline-block",
            marginTop: 25,
            borderRadius: 10,
            fontWeight: "bold",
          }}
        >
          🔥 Explore Fiverr Now
        </a>
      </section>

      {/* SERVICES */}
      <section style={{ padding: 40, maxWidth: 1200, margin: "auto" }}>
        <h2 style={{ textAlign: "center" }}>🔥 Top Fiverr Services</h2>

        {/* ================= REALISTIC REVIEW BLOCK ================= */}
        <div
          style={{
            background: "#fff",
            padding: 20,
            marginBottom: 30,
            borderRadius: 12,
            border: "1px solid #eee",
          }}
        >
          <h3>🧠 Real User Insights & Reviews</h3>

          <p>
            ⭐ Many users report that Fiverr is one of the fastest ways to get
            affordable freelance work with decent quality.
          </p>

          <p>
            ⭐ AI content writing services are especially popular for bloggers
            and SEO websites.
          </p>

          <p>
            ⭐ Logo design and video editing gigs are frequently rated highly
            due to fast delivery and creative output.
          </p>
        </div>

        {/* ================= GRID ================= */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 20,
          }}
        >
          {services.map((s, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={s.image}
                alt={s.title}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: 20 }}>
                <h3>{s.title}</h3>
                <p style={{ color: "#555", lineHeight: 1.6 }}>
                  {s.desc}
                </p>

                <a
                  href={fiverrLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: 15,
                    background: "#1dbf73",
                    color: "white",
                    padding: "10px 16px",
                    borderRadius: 10,
                    fontWeight: "bold",
                  }}
                >
                  Hire Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
            }
