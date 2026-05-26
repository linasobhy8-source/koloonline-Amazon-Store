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
      "Hire professional AI writers for blogs, SEO articles and content.",
  },
  {
    title: "Logo Design",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop",
    desc: "Get modern logo design for brands and startups.",
  },
  {
    title: "Video Editing",
    image:
      "https://images.unsplash.com/photo-1574717024453-35405626e6a0?q=80&w=1200&auto=format&fit=crop",
    desc: "Professional TikTok and YouTube editing services.",
  },
  {
    title: "SEO Optimization",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    desc: "Boost your Google rankings with SEO experts.",
  },
  {
    title: "Website Development",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    desc: "Hire developers for React and Next.js websites.",
  },
  {
    title: "Marketing",
    image:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1200&auto=format&fit=crop",
    desc: "Grow your business with social media marketing.",
  },
];

export default function FiverrPage() {
  return (
    <div style={{ fontFamily: "Arial", background: "#f5f7fb" }}>
      <Head>
        <title>Best Fiverr Services 2026 | Koloonline</title>
        <meta name="description" content="Top Fiverr freelance services." />
        <meta name="robots" content="index,follow" />
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
        <h1>🚀 Best Fiverr Services</h1>

        <p style={{ maxWidth: 800, margin: "auto", color: "#ccc" }}>
          Find top freelancers for AI, SEO, design and development.
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
          }}
        >
          Explore Fiverr
        </a>
      </section>

      {/* SERVICES */}
      <section style={{ padding: 40, maxWidth: 1200, margin: "auto" }}>
        <h2 style={{ textAlign: "center" }}>🔥 Services</h2>

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
                <p style={{ color: "#555" }}>{s.desc}</p>

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
