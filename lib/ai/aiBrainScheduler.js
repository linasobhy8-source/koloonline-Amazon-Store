import { autonomousLoop } from "./autonomousLoop";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase";

/* ================= MASTER AI SCHEDULER ================= */
export async function runBrain() {
  try {
    console.log("🧠 AI Brain Running...");

    /* STEP 1: Load products */
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    /* STEP 2: Run autonomous loop */
    const result = await autonomousLoop(products);

    console.log("🚀 Autonomous Cycle Complete", result);

    return result;

  } catch (e) {
    console.error("Brain Error:", e);
    return { success: false, error: e.message };
  }
}
