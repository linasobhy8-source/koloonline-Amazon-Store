export default function handler(req, res) {
  res.status(200).json([
    {
      asin: "B09V7Z4TJG",
      title: "Smart Watch Pro",
      price: 49.99,
      image: "https://m.media-amazon.com/images/I/61IMRs+o0iL._AC_SL1500_.jpg"
    },
    {
      asin: "B0C4GPPD1H",
      title: "Fitness Tracker",
      price: 39.99,
      image: "https://m.media-amazon.com/images/I/61u48FEs0rL._AC_SL1000_.jpg"
    }
  ]);
}
