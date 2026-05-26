/* ================= AI GLOBAL CONTROL ================= */

export function aiGuard(req, res) {

  // OFF MODE
  if (process.env.AI_MODE !== "true") {

    // لو داخل API route
    if (res) {
      res.status(403).json({
        success: false,
        message: "AI Engines Disabled",
      });
    }

    return false;
  }

  return true;
}
