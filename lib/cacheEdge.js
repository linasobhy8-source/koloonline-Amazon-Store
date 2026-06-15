import { getProductsFast } from "./firebaseQuery";

export default async function handler(req, res) {
  try {
    const data = await getProductsFast();

    const safeData = Array.isArray(data)
      ? data.map((item) => ({
          id: String(item?.id || ""),
          title: String(item?.title || ""),
          description: String(item?.description || ""),
          image: String(item?.image || ""),
          price: String(item?.price || ""),
        }))
      : [];

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=3600"
    );

    return res.status(200).json(safeData);
  } catch (err) {
    console.error("API Error:", err);

    return res.status(500).json({ error: "Internal Server Error" });
  }
}
