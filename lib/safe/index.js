const FALLBACK_IMAGE =
  "https://via.placeholder.com/500x500?text=Koloonline";

export function safeText(v) {
  if (v == null) return "";

  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }

  if (typeof v === "object") {
    if (v?.text) return String(v.text);
    if (v?.title) return String(v.title);
    if (v?.name) return String(v.name);
    if (v?.value) return String(v.value);

    return "";
  }

  return "";
}

export function safeImage(v) {
  if (!v) return FALLBACK_IMAGE;

  if (typeof v === "string") {
    return v.startsWith("http") ? v : FALLBACK_IMAGE;
  }

  if (typeof v === "object") {
    const img = v?.url || v?.image || v?.src;
    return typeof img === "string" ? img : FALLBACK_IMAGE;
  }

  return FALLBACK_IMAGE;
}

export function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function safeDeep(obj) {
  if (!obj || typeof obj !== "object") return {};
  return JSON.parse(JSON.stringify(obj));
}
