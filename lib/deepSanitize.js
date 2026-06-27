export const deepSanitize = (obj) => {
  if (obj == null) return "";

  if (
    typeof obj === "string" ||
    typeof obj === "number" ||
    typeof obj === "boolean"
  ) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepSanitize).join(" ");
  }

  if (typeof obj === "object") {
    // Firebase Timestamp fix
    if (obj?.seconds) return obj.seconds;

    return Object.values(obj)
      .map(deepSanitize)
      .join(" ");
  }

  return "";
};
