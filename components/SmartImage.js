import Image from "next/image";
import { useMemo, useState, useCallback } from "react";

/* ================= FALLBACK ================= */
const FALLBACK_IMAGE =
  "https://via.placeholder.com/500x500?text=Koloonline";

/* ================= SMART IMAGE (PRODUCTION READY) ================= */
export default function SmartImage({
  src,
  alt = "Product Image",
  priority = false,
  sizes = "(max-width:768px) 100vw, 300px",
}) {
  const [error, setError] = useState(false);

  /* ================= VALIDATION + SANITIZATION ================= */
  const finalSrc = useMemo(() => {
    try {
      if (error) return FALLBACK_IMAGE;

      if (!src || typeof src !== "string") {
        return FALLBACK_IMAGE;
      }

      const clean = src.trim();

      if (!clean) return FALLBACK_IMAGE;

      if (
        !clean.startsWith("http://") &&
        !clean.startsWith("https://")
      ) {
        return FALLBACK_IMAGE;
      }

      return clean;
    } catch (e) {
      console.error("SmartImage Error:", e);
      return FALLBACK_IMAGE;
    }
  }, [src, error]);

  /* ================= ERROR HANDLER ================= */
  const handleError = useCallback(() => {
    setError(true);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        background: "#f5f5f5",
        borderRadius: 10,
      }}
    >
      <Image
        src={finalSrc}
        alt={typeof alt === "string" ? alt : "Product Image"}
        fill
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        quality={75}
        sizes={sizes}
        onError={handleError}
        style={{
          objectFit: "contain",
        }}
      />
    </div>
  );
          }
