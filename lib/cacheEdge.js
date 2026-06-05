import { getProductsFast } from "./firebaseQuery";

export default async function handler(req, res) {
  const data = await getProductsFast();

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=3600"
  );

  return res.status(200).json(data);
}
