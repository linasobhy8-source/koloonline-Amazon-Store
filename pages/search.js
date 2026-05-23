import Head from "next/head";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

const fallbackImage =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= PAGE ================= */
export default function SearchPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [suggestions, setSuggestions] = useState([]);

  /* ================= BLOGGER POSTS ================= */
  const [blogPosts, setBlogPosts] = useState([]);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(
          collection(db, "products")
        );

        const data = snap.docs.map((doc) => {
          const d = doc.data();

          /* ================= AI SCORE ================= */
          const aiScore =
            (d.views || 0) * 1 +
            (d.clicks || 0) * 3 +
            (d.orders || 0) * 8 +
            (d.viralBoost ? 40 : 0);

          return {
            id: doc.id,
            asin: d.asin || doc.id,
            aiScore,
            ...d,
          };
        });

        setProducts(data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= FETCH BLOGGER POSTS ================= */
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const res = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https://linasobhy.blogspot.com/feeds/posts/default?alt=rss"
        );

        const data = await res.json();

        if (data.items) {
          setBlogPosts(data.items.slice(0, 4));
        }

      } catch (e) {
        console.error(e);
      }
    };

    fetchBlogPosts();
  }, []);

  /* ================= SUGGESTIONS ================= */
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }

    const results = products
      .filter((p) =>
        p.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 6);

    setSuggestions(results);

  }, [search, products]);

  /* ================= CATEGORIES ================= */
  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(
        products
          .map((p) => p.category)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        const title =
          p.title?.toLowerCase() || "";

        const cat =
          p.category?.toLowerCase() || "";

        const searchMatch =
          title.includes(
            search.toLowerCase()
          );

        const categoryMatch =
          category === "all"
            ? true
            : cat ===
              category.toLowerCase();

        return (
          searchMatch &&
          categoryMatch
        );
      })

      /* ================= AI SORT ================= */
      .sort(
        (a, b) =>
          b.aiScore - a.aiScore
      );

  }, [products, search, category]);

  return (
    <div
      style={{
        background: "#f4f6f9",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >

      {/* ================= SEO ================= */}
      <Head>

        <title>
          Search Amazon Products |
          Koloonline
        </title>

        <meta
          name="description"
          content="Search trending Amazon products, viral gadgets, smart home products, and AI-ranked deals."
        />

        <meta
          name="robots"
          content="index,follow"
        />

        <meta
          property="og:title"
          content="Search Amazon Products"
        />

        <meta
          property="og:description"
          content="Find the best Amazon deals and trending products."
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:url"
          content="https://koloonline.online/search"
        />

        {/* ================= BLOGGER RSS ================= */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Lina Sobhy Blog"
          href="https://linasobhy.blogspot.com/feeds/posts/default"
        />

      </Head>

      {/* ================= HEADER ================= */}
      <header
        style={{
          background:
            "linear-gradient(45deg,#111827,#1f2937)",
          padding: 20,
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 999,
        }}
      >

        <div
          style={{
            maxWidth: 1400,
            margin: "auto",
            display: "flex",
            alignItems: "center",
            gap: 15,
            flexWrap: "wrap",
          }}
        >

          {/* LOGO */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "white",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: 30,
              }}
            >
              🟠 Koloonline
            </h1>
          </Link>

          {/* SEARCH */}
          <div
            style={{
              flex: 1,
              position: "relative",
              minWidth: 250,
            }}
          >

            <input
              type="text"
              placeholder="Search Amazon products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 12,
                border: "none",
                fontSize: 16,
                outline: "none",
              }}
            />

            {/* SUGGESTIONS */}
            {suggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 58,
                  left: 0,
                  right: 0,
                  background: "white",
                  borderRadius: 12,
                  overflow: "hidden",
                  zIndex: 999,
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.15)",
                }}
              >

                {suggestions.map((s) => (

                  <div
                    key={s.id}

                    onClick={() => {
                      setSearch("");

                      router.push(
                        `/product/${s.asin}`
                      );
                    }}

                    style={{
                      padding: 14,
                      borderBottom:
                        "1px solid #eee",
                      cursor: "pointer",
                      color: "#111",
                    }}
                  >
                    {s.title}
                  </div>

                ))}

              </div>
            )}

          </div>

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            style={{
              padding: 14,
              borderRadius: 12,
              border: "none",
              fontWeight: "bold",
            }}
          >

            {categories.map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>
            ))}

          </select>

          {/* AMAZON HAUL */}
          <Link href="/amazon-haul">

            <button
              style={{
                padding: "14px 20px",
                background:
                  "linear-gradient(45deg,#ff6600,#ff9900)",
                border: "none",
                borderRadius: 12,
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🔥 Amazon Haul
            </button>

          </Link>

          {/* BLOG BUTTON */}
          <a
            href="https://linasobhy.blogspot.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
            }}
          >
            <button
              style={{
                padding: "14px 20px",
                background:
                  "linear-gradient(45deg,#2563eb,#3b82f6)",
                border: "none",
                borderRadius: 12,
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              ✍️ Blogger
            </button>
          </a>

        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <div
        style={{
          maxWidth: 1400,
          margin: "auto",
          padding: 20,
        }}
      >

        {/* ================= TITLE ================= */}
        <div
          style={{
            marginBottom: 30,
          }}
        >

          <h2
            style={{
              fontSize: 38,
              marginBottom: 10,
            }}
          >
            🔍 Smart Product Search
          </h2>

          <p
            style={{
              color: "#666",
            }}
          >
            AI-powered Amazon product discovery engine.
          </p>

        </div>

        {/* ================= BLOGGER POSTS ================= */}
        {blogPosts.length > 0 && (
          <section
            style={{
              marginBottom: 40,
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2>
                ✍️ Latest From Blogger
              </h2>

              <a
                href="https://linasobhy.blogspot.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#2563eb",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                View All →
              </a>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(260px,1fr))",
                gap: 20,
              }}
            >

              {blogPosts.map((post, index) => (

                <a
                  key={index}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                >

                  <div
                    style={{
                      background: "white",
                      borderRadius: 20,
                      padding: 20,
                      boxShadow:
                        "0 8px 30px rgba(0,0,0,0.06)",
                      height: "100%",
                    }}
                  >

                    <h3
                      style={{
                        lineHeight: 1.6,
                        marginBottom: 15,
                      }}
                    >
                      {post.title}
                    </h3>

                    <p
                      style={{
                        color: "#666",
                        fontSize: 14,
                        lineHeight: 1.7,
                      }}
                    >
                      {post.description
                        ?.replace(/<[^>]+>/g, "")
                        .slice(0, 120)}
                      ...
                    </p>

                    <div
                      style={{
                        marginTop: 20,
                        color: "#2563eb",
                        fontWeight: "bold",
                      }}
                    >
                      Read Article →
                    </div>

                  </div>

                </a>

              ))}

            </div>

          </section>
        )}

        {/* ================= LOADING ================= */}
        {loading ? (
          <p>Loading products...</p>
        ) : filtered.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: 40,
              borderRadius: 20,
              textAlign: "center",
            }}
          >
            No products found.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(250px,1fr))",
              gap: 24,
            }}
          >

            {filtered.map((p) => (

              <Link
                key={p.id}
                href={`/product/${p.asin}`}
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
              >

                <div
                  style={{
                    background: "white",
                    borderRadius: 20,
                    overflow: "hidden",
                    boxShadow:
                      "0 8px 30px rgba(0,0,0,0.06)",
                    transition: "0.3s",
                    height: "100%",
                  }}
                >

                  {/* IMAGE */}
                  <div
                    style={{
                      background: "#fafafa",
                      padding: 20,
                    }}
                  >

                    <Image
                      src={
                        p.image ||
                        fallbackImage
                      }

                      alt={p.title}

                      width={300}
                      height={300}

                      style={{
                        width: "100%",
                        height: 220,
                        objectFit: "contain",
                      }}
                    />

                  </div>

                  {/* CONTENT */}
                  <div
                    style={{
                      padding: 18,
                    }}
                  >

                    {/* CATEGORY */}
                    <span
                      style={{
                        background:
                          "#eef3ff",
                        color: "#2563eb",
                        padding:
                          "5px 12px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {p.category ||
                        "Trending"}
                    </span>

                    {/* TITLE */}
                    <h3
                      style={{
                        marginTop: 14,
                        lineHeight: 1.6,
                        minHeight: 70,
                        fontSize: 16,
                      }}
                    >
                      {p.title}
                    </h3>

                    {/* PRICE */}
                    <div
                      style={{
                        marginTop: 15,
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                      }}
                    >

                      <div
                        style={{
                          color: "#B12704",
                          fontSize: 26,
                          fontWeight: "bold",
                        }}
                      >
                        $
                        {Number(
                          p.price || 0
                        )}
                      </div>

                      {p.viralBoost && (
                        <span
                          style={{
                            background:
                              "#dc2626",
                            color: "white",
                            padding:
                              "5px 10px",
                            borderRadius: 10,
                            fontSize: 11,
                            fontWeight:
                              "bold",
                          }}
                        >
                          🔥 Viral
                        </span>
                      )}

                    </div>

                    {/* BUTTON */}
                    <button
                      style={{
                        width: "100%",
                        marginTop: 20,
                        padding: 14,
                        border: "none",
                        borderRadius: 12,
                        background:
                          "linear-gradient(45deg,#ff9900,#ffb84d)",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: 15,
                      }}
                    >
                      View Product
                    </button>

                  </div>
                </div>

              </Link>

            ))}

          </div>
        )}

      </div>
    </div>
  );
            }
