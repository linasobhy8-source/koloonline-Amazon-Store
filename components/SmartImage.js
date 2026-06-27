import Image from "next/image";
import { useMemo, useState, useCallback } from "react";

const FALLBACK =
  "https://via.placeholder.com/500x500?text=Koloonline";

export default function SmartImage({
  src,
  alt = "Product Image",
  priority = false,
}) {
  const [error, setError] = useState(false);

  const finalSrc = useMemo(() => {
    if (error) return FALLBACK;

    if (typeof src !== "string") {
      return FALLBACK;
    }

    const clean = src.trim();

    if (!clean) {
      return FALLBACK;
    }

    if (
      !clean.startsWith("https://") &&
      !clean.startsWith("http://")
    ) {
      return FALLBACK;
    }

    return clean;
  }, [src, error]);

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
        borderRadius: 8,
      }}
    >
      <Image
        src={finalSrc}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        quality={75}
        sizes="
          (max-width:640px) 100vw,
          (max-width:768px) 50vw,
          (max-width:1200px) 33vw,
          300px
        "
        onError={handleError}
        style={{
          objectFit: "contain",
        }}
      />
    </div>
  );
          }
