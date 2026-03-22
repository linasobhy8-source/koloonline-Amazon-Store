.products {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
}

.card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.card img {
  width: 100%;
  border-radius: 10px;
}

.buy-btn {
  background: orange;
  color: white;
  padding: 10px;
  border: none;
  width: 100%;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 8px;
}export default function handler(req, res) {
  res.status(200).json([
    {
      id: 1,
      title: "Smart Watch",
      price: 39.99,
      image: "https://m.media-amazon.com/images/I/61IMRs+o0iL._AC_SL1500_.jpg",
      link: "https://www.amazon.eg/dp/B09V7Z4TJG?tag=onlinesh03f31-21"
    },
    {
      id: 2,
      title: "Anker Speaker",
      price: 49.99,
      image: "https://m.media-amazon.com/images/I/71tV4O0rO0L._AC_SL1500_.jpg",
      link: "https://www.amazon.eg/dp/B07ZNT7PRL?tag=onlinesh03f31-21"
    }
  ]);
}