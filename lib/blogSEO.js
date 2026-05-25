/* ================= BLOG SEO ================= */

export function generateBlogSEO(post) {

  const title =
    post?.title ||
    "Best Amazon Deals";

  const description =
    post?.excerpt ||
    post?.content?.slice(0, 160) ||
    "Read this Amazon shopping guide";

  const slug =
    post?.slug ||
    post?.id ||
    "post";

  return {

    title:
      `${title} | Koloonline`,

    description,

    canonical:
      `https://koloonline.online/blog/${slug}`,

    openGraph: {
      title,
      description,
      url:
        `https://koloonline.online/blog/${slug}`,
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
