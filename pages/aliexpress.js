import Head from "next/head";
import Link from "next/link";

const aliLink = "https://s.click.aliexpress.com/e/_c2zsFdx9";

const products = [
  {
    title: "Smart Gadgets",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    desc: "Discover trending smart gadgets and viral TikTok products.",
  },
  {
    title: "Gaming Accessories",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    desc: "Gaming keyboards, RGB lights, controllers and gaming setups.",
  },
  {
    title: "Smart Home",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200&auto=format&fit=crop",
    desc: "Upgrade your home with affordable smart home devices.",
  },
  {
    title: "Phone Accessories",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
    desc: "Phone cases, chargers, wireless gadgets and accessories.",
  },
  {
    title: "Car Accessories",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    desc: "Popular car gadgets, organizers and smart accessories.",
  },
  {
    title: "LED & Decor",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
    desc: "Modern LED lights and aesthetic room decoration products.",
  },
];

export default function AliExpressPage() {
  return (
    <div style={{ fontFamily: "Arial", background: "#f5f7fb", minHeight: "100vh" }}>
      
      <Head>
        <title>Best AliExpress Deals 2026 | Koloonline</title>
        <meta name="description" content="Explore trending AliExpress gadgets and deals." />
      </Head>

      {/* HERO */}
      <section style={{
        background: "linear-gradient(135deg,#ff4747,#ff6a00)",
        color: "white",
        padding: "80px 20px",
        textAlign: "center",
      }}>
        <h1 style={{ fontSize: 52 }}>🛍️ Best AliExpress Deals</h1>
        <p style={{ fontSize: 20, maxWidth: 800, margin: "auto" }}>
          Trending gadgets, gaming accessories and smart home deals.
        </p>

        <a href={aliLink} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-block",
          marginTop: 30,
          background: "white",
          color: "#ff4747",
          padding: "14px 28px",
          borderRadius: 12,
          fontWeight: "bold",
          textDecoration: "none",
        }}>
          Shop AliExpress →
        </a>
      </section>

      {/* PRODUCTS */}
      <section style={{ maxWidth: 1200, margin: "auto", padding: 40 }}>
        <h2 style={{ textAlign: "center", fontSize: 34 }}>🔥 Trending Categories</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 25,
          marginTop: 30,
        }}>
          {products.map((product, i) => (
            <div key={i} style={{
              background: "white",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            }}>
              
              {/* SAFE IMAGE */}
              <img
                src={product.image}
                alt={product.title}
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: 22 }}>{product.title}</h3>
                <p style={{ color: "#555" }}>{product.desc}</p>

                <a href={aliLink} target="_blank" rel="noopener noreferrer" style={{
                  display: "inline-block",
                  marginTop: 15,
                  background: "#ff4747",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: "bold",
                }}>
                  View Deals →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LINKS */}
      <section style={{ maxWidth: 1000, margin: "auto", padding: 40 }}>
        <h2>📚 More Pages</h2>

        <div style={{ display: "grid", gap: 15 }}>
          <Link href="/fiverr">💼 Fiverr Services</Link>
          <Link href="/amazon-haul">🔥 Amazon Haul</Link>
          <Link href="/search">🔍 Smart Search</Link>
        </div>
      </section>
    </div>
  );
            }
