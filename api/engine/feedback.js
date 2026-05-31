import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProductBrain } from "../../ai/brain/self-learning";

export default async function handler(req, res) {
  const { id, event, product } = req.body;

  try {
    const newWeight = updateProductBrain(product, event);

    await updateDoc(doc(db, "products", id), {
      aiWeight: newWeight,
    });

    return res.status(200).json({
      success: true,
      newWeight,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
