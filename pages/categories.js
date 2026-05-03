import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const snap = await getDocs(collection(db, "products"));

    const cats = new Set();

    snap.forEach((doc) => {
      const data = doc.data();
      if (data.category) cats.add(data.category);
    });

    setCategories([...cats]);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🛍️ Categories</h1>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <Link key={cat} href={`/category/${cat}`}>
            <div style={card}>
              {cat.toUpperCase()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const card = {
  padding: 20,
  background: "#f5f5f5",
  borderRadius: 10,
  cursor: "pointer",
};
