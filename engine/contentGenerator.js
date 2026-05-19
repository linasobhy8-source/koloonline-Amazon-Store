export async function createNewContent(keyword) {
  return {
    title: `Best ${keyword} Guide 2026`,
    status: "created",
    seo: {
      keyword,
      optimized: true,
    },
  };
}
