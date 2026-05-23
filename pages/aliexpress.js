import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

/* ================= ALIEXPRESS PAGE ================= */

const aliLink =
  "https://s.click.aliexpress.com/e/_c2zsFdx9";

const products = [
  {
    title: "Smart Gadgets",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Discover trending smart gadgets and viral TikTok products.",
  },

  {
    title: "Gaming Accessories",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Gaming keyboards, RGB lights, controllers and gaming setups.",
  },

  {
    title: "Smart Home",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Upgrade your home with affordable smart home devices.",
  },

  {
    title: "Phone Accessories",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Phone cases, chargers, wireless gadgets and accessories.",
  },

  {
    title: "Car Accessories",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Popular car gadgets, organizers and smart accessories.",
  },

  {
    title: "LED & Decor",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
    desc:
      "Modern LED lights and aesthetic room decoration products.",
  },
];

export default function AliExpressPage() {
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
          Best AliExpress Deals 2026 |
          Koloonline
        </title>

        <meta
          name="description"
          content="Explore trending AliExpress gadgets, smart home products, gaming accessories and viral online deals."
        />

        <meta
          name="robots"
          content="index,follow"
        />

        <meta
          property="og:title"
          content="Best AliExpress Deals"
        />

        <meta
          property="og:description"
          content="Trending AliExpress products and gadgets."
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:url"
          content="https://koloonline.online/aliexpress"
        />

        <link
          rel="canonical"
          href="https://koloonline.online/aliexpress"
        />
      </Head>

      {/* ================= HERO ================= */}
      <section
        style={{
          background:
            "linear-gradient(135deg,#ff4747,#ff6a00)",
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
          🛍️ Best AliExpress Deals
        </h1>

        <p
          style={{
            maxWidth: 850,
            margin: "auto",
            lineHeight: 1.8,
            fontSize: 20,
          }}
        >
          Discover trending gadgets,
          viral products, gaming
          accessories and smart home
          deals from AliExpress.
        </p>

        <a
          href={aliLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            display: "inline-block",
            marginTop: 35,
            background: "white",
            color: "#ff4747",
            padding: "18px 34px",
            borderRadius: 14,
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Shop AliExpress →
        </a>
      </section>

      {/* ================= PRODUCTS ================= */}
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
          🔥 Trending Categories
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(300px,1fr))",
            gap: 30,
          }}
        >
          {products.map((product, i) => (
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
                  src={product.image}
                  alt={product.title}
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
                  {product.title}
                </h3>

                <p
                  style={{
                    color: "#555",
                    lineHeight: 1.8,
                    minHeight: 90,
                  }}
                >
                  {product.desc}
                </p>

                <a
                  href={aliLink}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  style={{
                    display: "inline-block",
                    marginTop: 20,
                    background: "#ff4747",
                    color: "white",
                    padding:
                      "14px 24px",
                    borderRadius: 12,
                    textDecoration:
                      "none",
                    fontWeight: "bold",
                  }}
                >
                  View Deals →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= INTERNAL LINKS ================= */}
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
          📚 More Pages
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
            href="/fiverr"
            style={{
              background: "white",
              padding: 25,
              borderRadius: 20,
              textDecoration: "none",
              color: "black",
            }}
          >
            💼 Fiverr Services
          </Link>

          <Link
            href="/amazon-haul"
            style={{
              background: "white",
              padding: 25,
              borderRadius: 20,
              textDecoration: "none",
              color: "black",
            }}
          >
            🔥 Amazon Haul
          </Link>

          <Link
            href="/search"
            style={{
              background: "white",
              padding: 25,
              borderRadius: 20,
              textDecoration: "none",
              color: "black",
            }}
          >
            🔍 Smart Search
          </Link>
        </div>
      </section>
    </div>
  );
}
