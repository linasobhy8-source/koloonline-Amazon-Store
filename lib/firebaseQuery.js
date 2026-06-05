import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { isValid, getCache, setCache } from "./cache";

export async function getProductsFast() {
  if (isValid()) return getCache();

  const snap = await getDocs(collection(db, "products"));

  const data = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  setCache(data);

  return data;
}
