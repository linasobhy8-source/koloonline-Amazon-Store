import { topPages } from "../data/topPages";

export async function getServerSideProps({ res }) {
const baseUrl = "https://koloonline.online";

const urls = topPages
.map(
(page) => " <url> <loc>${baseUrl}/top/${page.slug}</loc> <changefreq>weekly</changefreq> <priority>0.8</priority> </url>"
)
.join("");

const xml = "<?xml version="1.0" encoding="UTF-8"?> <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> ${urls} </urlset>";

res.setHeader("Content-Type", "application/xml");
res.write(xml);
res.end();

return {
props: {},
};
}

export default function SitemapTop() {
return null;
}
