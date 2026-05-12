import Head from "next/head";

const products = [
  {
    id: 1,
    title: "Mini Portable Blender",
    image:
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=1200&auto=format&fit=crop",
    price: "$8.99",
    category: "Kitchen",
    link:
      "https://www.amazon.com/?tag=koloonlinesto-20",
  },
  {
    id: 2,
    title: "LED Strip Lights",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    price: "$5.49",
    category: "Home",
    link:
      "https://www.amazon.com/?tag=koloonlinesto-20",
  },
  {
    id: 3,
    title: "Wireless Earbuds",
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200&auto=format&fit=crop",
    price: "$14.99",
    category: "Electronics",
    link:
      "https://www.amazon.com/?tag=koloonlinesto-20",
  },
  {
    id: 4,
    title: "Travel Makeup Bag",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    price: "$6.99",
    category: "Beauty",
    link:
      "https://www.amazon.com/?tag=koloonlinesto-20",
  },
  {
    id: 5,
    title: "Phone Holder Stand",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
    price: "$3.99",
    category: "Accessories",
    link:
      "https://www.amazon.com/?tag=koloonlinesto-20",
  },
  {
    id: 6,
    title: "USB Desk Fan",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    price: "$9.99",
    category: "Office",
    link:
      "https://www.amazon.com/?tag=koloonlinesto-20",
  },
];

export default function AmazonHaul() {
  return (
    <>
      <Head>
        <title>Amazon Haul Deals | Cheap Amazon Finds</title>

        <meta
          name="description"
          content="Discover the best Amazon Haul deals, cheap Amazon finds, viral TikTok products, gadgets, beauty products, and trending items under $20."
        />

        <meta
          name="keywords"
          content="Amazon Haul, Cheap Amazon Finds, Amazon Deals, Viral Amazon Products, TikTok Amazon Finds, Amazon Under 20"
        />

        <meta property="og:title" content="Amazon Haul Deals" />

        <meta
          property="og:description"
          content="Best cheap Amazon products and viral finds under $20."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content="https://koloonline.online/amazon-haul"
        />

        <link
          rel="canonical"
          href="https://koloonline.online/amazon-haul"
        />
      </Head>

      <main style={styles.main}>
        <section style={styles.hero}>
          <h1 style={styles.title}>Amazon Haul Deals</h1>

          <p style={styles.subtitle}>
            Discover trending Amazon products under $20.
          </p>
        </section>

        <section style={styles.grid}>
          {products.map((product) => (
            <div key={product.id} style={styles.card}>
              <img
                src={product.image}
                alt={product.title}
                style={styles.image}
              />

              <div style={styles.content}>
                <span style={styles.category}>{product.category}</span>

                <h2 style={styles.productTitle}>{product.title}</h2>

                <p style={styles.price}>{product.price}</p>

                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.button}
                >
                  Shop Now
                </a>
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}

const styles = {
  main: {
    background: "#f5f5f5",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "Arial",
  },

  hero: {
    textAlign: "center",
    marginBottom: "40px",
  },

  title: {
    fontSize: "42px",
    fontWeight: "bold",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "18px",
    color: "#555",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  card: {
    background: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "0.3s",
  },

  image: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
  },

  content: {
    padding: "20px",
  },

  category: {
    background: "#eee",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  productTitle: {
    fontSize: "20px",
    marginTop: "15px",
    marginBottom: "10px",
  },

  price: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "15px",
  },

  button: {
    display: "inline-block",
    background: "#111",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};
