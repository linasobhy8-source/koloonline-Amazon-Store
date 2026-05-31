export async function seoAutopilot(products = []) {
  return products.map(p => ({
    slug: `/product/${p.id}`,
    seo: `Best deal for ${p.title}`,
  }));
}
