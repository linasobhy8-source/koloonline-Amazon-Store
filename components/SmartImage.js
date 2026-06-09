import Image from "next/image";
import { useMemo, useState, useCallback } from "react";
import { cdnImage } from "../lib/cdnImage";

const fallback =
  "https://via.placeholder.com/500x500?text=Koloonline";

export default function SmartImage({ src, alt }) {
  const [error, setError] = useState(false);

  /* ================= MEMOIZED FINAL SRC ================= */
  const finalSrc = useMemo(() => {
    if (error) return fallback;
    return cdnImage(src || fallback);
  }, [src, error]);

  /* ================= STABLE HANDLER ================= */
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
        background: "#f5f5f5", // improves perceived loading
      }}
    >
      <Image
        src={finalSrc}
        alt={alt || "image"}
        fill
        sizes="(max-width: 768px) 100vw, 500px"
        loading="lazy"
        quality={65}
        placeholder="blur"
        blurDataURL={fallback}
        onError={handleError}
        style={{
          objectFit: "contain",
          transition: "0.2s ease-in-out",
        }}
      />
    </div>
  );
}
