import Head from "next/head";

export default function SEOHead({ title, description, image, url }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
    </Head>
  );
}
