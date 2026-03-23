export default function handler(req, res) {

  const posts = [];

  const topics = [
    "Best Smart Watches 2026",
    "Top Amazon Gadgets",
    "Best Wireless Earbuds",
    "Home Tech Must Haves",
    "Cheap Amazon Deals",
    "Fitness Trackers Review",
    "Smart Home Devices Guide"
  ];

  for(let i = 0; i < 50; i++){

    const t = topics[i % topics.length];

    posts.push({
      id: i,
      title: t + " #" + (i+1),
      slug: t.toLowerCase().replaceAll(" ","-") + "-" + i,
      description: "AI generated SEO article about " + t,
      content: `
        <h1>${t}</h1>
        <p>This is a high quality SEO optimized article about ${t}.</p>
        <p>Best products, reviews, and buying guide included.</p>
      `
    });
  }

  res.status(200).json(posts);
}
