export default function handler(req, res) {
  const posts = [
    {
      id: 1,
      title: "Best Smart Watches 2026",
      slug: "best-smart-watches-2026",
      description: "Discover the best smart watches with health tracking and long battery life.",
      content: `
Smart watches are now essential in daily life.

They help with:
- Health tracking
- Sleep monitoring
- Fitness goals

Top recommendation: Smart Watch Pro 2026
      `,
      image: "https://m.media-amazon.com/images/I/61IMRs+o0iL._AC_SL1500_.jpg",
      affiliate: "https://www.amazon.eg/dp/B09V7Z4TJG?tag=onlinesh03f31-21"
    },

    {
      id: 2,
      title: "Top Amazon Gadgets 2026",
      slug: "top-amazon-gadgets-2026",
      description: "Best trending Amazon gadgets you should buy this year.",
      content: `
Amazon gadgets are trending in 2026.

Popular categories:
- Smart devices
- Home gadgets
- Tech accessories
      `,
      image: "https://m.media-amazon.com/images/I/71tV4O0rO0L._AC_SL1500_.jpg",
      affiliate: "https://www.amazon.eg/dp/B07ZNT7PRL?tag=onlinesh03f31-21"
    }
  ];

  res.status(200).json(posts);
}
