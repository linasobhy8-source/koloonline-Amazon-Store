import { db } from "../../config/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const logsRef = collection(db, "cron_logs");

    const q = query(
      logsRef,
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const snap = await getDocs(q);

    const logs = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      success: true,
      logs,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
