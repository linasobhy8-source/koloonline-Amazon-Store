export function generateBlogSEO(post) {
  const title = post?.title || "Best Amazon Deals";
  const desc =
    post?.excerpt ||
    post?.content?.slice(0, 160) ||
    "Read this Amazon shopping guide";

  return {
    title: `${title} | Koloonline`,
    description: desc,
    canonical: `https://koloonline.online/blog/${post?.id}`,
  };
}
