import { safeObject } from "./safeCore";

export async function getProductsFast() {
  const snap = await getDocs(collection(db, "products"));

  return snap.docs.map((doc) =>
    safeObject({
      id: doc.id,
      ...doc.data(),
    })
  );
}
