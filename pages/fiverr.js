import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

/* ================= FIVERR PAGE ================= */

const fiverrLink =
  "https://go.fiverr.com/visit/?bta=1148086&brand=fiverrmarketplace";

const services = [
  {
    title: "AI Content Writing",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Hire professional AI writers for blogs, SEO articles, product descriptions and social media content.",
  },

  {
    title: "Logo Design",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Get modern logo design services for brands, startups and online stores.",
  },

  {
    title: "Video Editing",
    image:
      "https://images.unsplash.com/photo-1574717024453-35405626e6a0?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Professional TikTok, YouTube and Instagram video editing services.",
  },

  {
    title: "SEO Optimization",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Boost your Google rankings with expert SEO services and backlinks.",
  },

  {
    title: "Website Development",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Hire developers for Next.js, React, Shopify and WordPress websites.",
  },

  {
    title: "Social Media Marketing",
    image:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Grow your audience with social media marketing experts and ad specialists.",
  },
];

export default function FiverrPage() {
  return (
    <div
      style={{
        fontFamily: "Arial",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* ================= SEO ================= */}
      <Head>
        <title>
          Best Fiverr Services 2026 |
          Koloonline
        </title>

        <meta
          name="description"
          content="Discover the best Fiverr freelance services for AI, SEO, logo design, video editing, web development and digital marketing."
        />

        <meta
          name="robots"
          content="index,follow"
        />

        <meta
          property="og:title"
          content="Best Fiverr Services"
        />

        <meta
          property="og:description"
          content="Top Fiverr freelance services and digital experts."
        />

        <meta
          property="og:image"
          content="https://koloonline.online/logo.png"
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:url"
          content="https://koloonline.online/fiverr"
        />

        <link
          rel="canonical"
          href="https://koloonline.online/fiverr"
        />
      </Head>

      {/* ================= HERO ================= */}
      <section
        style={{
          background:
            "linear-gradient(135deg,#111827,#1f2937)",
          color: "white",
          padding: "80px 20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 52,
            marginBottom: 20,
          }}
        >
          🚀 Best Fiverr Services
        </h1>

        <p
          style={{
            maxWidth: 850,
            margin: "auto",
            lineHeight: 1.8,
            fontSize: 20,
            color: "#d1d5db",
          }}
        >
          Discover top-rated freelancers
          for AI tools, SEO, logo design,
          website development, video
          editing and digital marketing.
        </p>

        <a
          href={fiverrLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            display: "inline-block",
            marginTop: 35,
            background: "#1dbf73",
            color: "white",
            padding: "18px 34px",
            borderRadius: 14,
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Explore Fiverr →
        </a>
      </section>

      {/* ================= SERVICES ================= */}
      <section
        style={{
          maxWidth: 1400,
          margin: "auto",
          padding: "60px 20px",
        }}
      >
        <h2
          style={{
            fontSize: 38,
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          🔥 Popular Fiverr Categories
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(300px,1fr))",
            gap: 30,
          }}
        >
          {services.map((service, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: 24,
                overflow: "hidden",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 220,
                }}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>

              <div
                style={{
                  padding: 24,
                }}
              >
                <h3
                  style={{
                    fontSize: 24,
                    marginBottom: 14,
                  }}
                >
                  {service.title}
                </h3>

                <p
                  style={{
                    color: "#555",
                    lineHeight: 1.8,
                    minHeight: 90,
                  }}
                >
                  {service.desc}
                </p>

                <a
                  href={fiverrLink}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  style={{
                    display: "inline-block",
                    marginTop: 20,
                    background: "#1dbf73",
                    color: "white",
                    padding:
                      "14px 24px",
                    borderRadius: 12,
                    textDecoration:
                      "none",
                    fontWeight: "bold",
                  }}
                >
                  Hire Freelancer →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section
        style={{
          background: "white",
          padding: "70px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "auto",
          }}
        >
          <h2
            style={{
              fontSize: 38,
              textAlign: "center",
              marginBottom: 50,
            }}
          >
            💡 Why Fiverr?
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(250px,1fr))",
              gap: 25,
            }}
          >
            {[
              "Affordable freelance services",
              "Professional global talent",
              "Fast delivery options",
              "Secure payments",
              "SEO and AI experts",
              "Perfect for online business owners",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background:
                    "#f5f7fb",
                  padding: 30,
                  borderRadius: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 18,
                }}
              >
                ✅ {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BLOG LINKS ================= */}
      <section
        style={{
          maxWidth: 1200,
          margin: "auto",
          padding: "60px 20px",
        }}
      >
        <h2
          style={{
            fontSize: 36,
            marginBottom: 30,
          }}
        >
          📚 Explore More
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: 20,
          }}
        >
          <Link
            href="/amazon-haul"
            style={{
              background: "white",
              padding: 25,
              borderRadius: 20,
              textDecoration: "none",
              color: "black",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            🔥 Amazon Haul Deals
          </Link>

          <Link
            href="/search"
            style={{
              background: "white",
              padding: 25,
              borderRadius: 20,
              textDecoration: "none",
              color: "black",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            🔍 Smart Product Search
          </Link>

          <a
            href="https://linasobhy.blogspot.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "white",
              padding: 25,
              borderRadius: 20,
              textDecoration: "none",
              color: "black",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            ✍️ Lina Sobhy Blog
          </a>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section
        style={{
          background:
            "linear-gradient(135deg,#1dbf73,#0f9d58)",
          padding: "80px 20px",
          textAlign: "center",
          color: "white",
        }}
      >
        <h2
          style={{
            fontSize: 44,
            marginBottom: 20,
          }}
        >
          Start Hiring Today
        </h2>

        <p
          style={{
            maxWidth: 700,
            margin: "auto",
            lineHeight: 1.8,
            fontSize: 20,
          }}
        >
          Access thousands of skilled
          freelancers and grow your
          business faster.
        </p>

        <a
          href={fiverrLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            display: "inline-block",
            marginTop: 35,
            background: "white",
            color: "#111827",
            padding: "18px 34px",
            borderRadius: 14,
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Go To Fiverr →
        </a>
      </section>
    </div>
  );
}
