import Image from "next/image";
import { optimizeAmazonImage } from "../lib/amazonImage";
import { useState } from "react";

const fallback =
  "https://via.placeholder.com/500x500?text=Koloonline";

export default function SmartImage({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(
    optimizeAmazonImage(src) || fallback
  );

  return (
    <Image
      src={imgSrc}
      alt={alt || "product image"}
      width={500}
      height={500}

      /* ================= PERFORMANCE ================= */
      loading="lazy"
      priority={false}

      /* ================= QUALITY OPTIMIZATION ================= */
      quality={85}

      /* ================= AMAZON FIX ================= */
      unoptimized={true}

      /* ================= ERROR HANDLING ================= */
      onError={() => setImgSrc(fallback)}

      /* ================= CLEAN UI ================= */
      style={{
        width: "100%",
        height: "auto",
        objectFit: "contain",
        background: "#ffffff",
        borderRadius: "8px",
      }}
    />
  );
        }
