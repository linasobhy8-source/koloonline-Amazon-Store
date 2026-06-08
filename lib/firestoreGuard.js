// lib/firestoreGuard.js

export function sanitizeProductInput(data = {}) {
  return {
    title: safeText(data.title),
    description: safeText(data.description),
    image: safeImage(data.image),
    price: safeNumber(data.price),
    category: safeText(data.category || "general"),
    createdAt: Date.now(),
  };
}

function safeText(v) {
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.join(" ");
  if (typeof v === "object" && v) return v.text || v.value || "";
  return "";
}

function safeImage(v) {
  if (typeof v === "string") return v;
  if (typeof v === "object" && v) return v.url || "";
  return "";
}

function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
