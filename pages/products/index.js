import { getProductsFast } from "../../lib/firebaseQuery";

let cache = null;
let last = 0;

export default async function handler(req, res) {
  const now = Date.now();

  if (cache && now - last < 1000 * 60 * 5) {
    return res.status(200).json(cache);
  }

  const data = await getProductsFast();

  cache = data;
  last = now;

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=3600"
  );

  return res.status(200).json(data);
}
