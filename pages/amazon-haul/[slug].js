import Head from "next/head";

export default function HaulPage({
page,
}) {
return (
<>
<Head>
<title>{page.title}</title>
<meta
name="description"
content={page.description}
/>
</Head>

  <main>
    <h1>{page.title}</h1>
    <p>{page.content}</p>
  </main>
</>

);
}
