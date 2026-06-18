import Image from "next/image";
import { useMemo, useState, useCallback } from "react";

const FALLBACK =
  "https://via.placeholder.com/500x500?text=Koloonline";

export default function SmartImage({
  src,
  alt = "Product Image",
}) {
  const [error, setError] = useState(false);

  /* ================= SAFE IMAGE ================= */
  const finalSrc = useMemo(() => {
    try {
      if (error) return FALLBACK;

      if (typeof src !== "string") {
        return FALLBACK;
      }

      const clean = src.trim();

      if (!clean) {
        return FALLBACK;
      }

      if (
        !clean.startsWith("http://") &&
        !clean.startsWith("https://")
      ) {
        return FALLBACK;
      }

      return clean;
    } catch (err) {
      console.error(
        "SmartImage Error:",
        err
      );

      return FALLBACK;
    }
  }, [src, error]);

  /* ================= ERROR HANDLER ================= */
  const handleError = useCallback(() => {
    setError(true);
  }, []);

  /* ================= DEBUG ================= */
  if (typeof window === "undefined") {
    console.log(
      "SMART IMAGE:",
      finalSrc,
      typeof finalSrc
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        background: "#f5f5f5",
      }}
    >
      <Image
        src={finalSrc}
        alt={String(alt || "Product Image")}
        fill
        sizes="(max-width:768px) 100vw, 500px"
        quality={65}
        unoptimized
        onError={handleError}
        style={{
          objectFit: "contain",
        }}
      />
    </div>
  );
}
