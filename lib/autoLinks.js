import { FEATURE_FLAGS } from "../config/featureFlags";

/* ================= AUTO LINKS DISABLED ================= */
export function generateAutoLinks(text) {
  if (!FEATURE_FLAGS.AUTO_LINKS) {
    return text; // ❌ no modifications
  }

  // (لو عايزة تشغليه لاحقًا حطّي logic هنا)
  return text;
}
