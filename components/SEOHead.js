import Head from "next/head";

function safeString(value, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

export default function SEOHead(props) {
  const title = safeString(
    props?.title,
    "Koloonline"
  );

  const description = safeString(
    props?.description,
    "Best Amazon Deals"
  );

  const image = safeString(
    props?.image,
    "https://via.placeholder.com/1200x630?text=Koloonline"
  );

  const url = safeString(
    props?.url,
    "https://koloonline.online"
  );

  return (
    <Head>
      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      <link
        rel="canonical"
        href={url}
      />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:image"
        content={image}
      />

      <meta
        property="og:url"
        content={url}
      />

      <meta
        property="og:type"
        content="website"
      />
    </Head>
  );
          }
