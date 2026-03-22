export default function handler(req, res) {

  const products = [
    {
      id: "1",
      title: "Room Humidity Device",
      price: 499,
      image: "https://via.placeholder.com/300",
      description: "Improves air humidity naturally",
      link: "https://amazon.com/dp/XXX?tag=koloonlinesto-20"
    },
    {
      id: "2",
      title: "Nike Metcon 3",
      price: 1299,
      image: "https://via.placeholder.com/300",
      description: "High performance training shoes",
      link: "https://amazon.com/dp/YYY?tag=koloonlinesto-20"
    }
  ];

  res.status(200).json(products);
}