export async function getServerSideProps({ res }) {
  res.writeHead(302, {
    Location: "/api/sitemap-products.xml",
  });

  res.end();

  return {
    props: {},
  };
}

export default function SitemapProducts() {
  return null;
}
