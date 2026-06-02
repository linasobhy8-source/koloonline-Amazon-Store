import Image from "next/image";
import { optimizeAmazonImage } from "../lib/amazonImage";

const fallback =
  "/placeholder.png"; // 👈 الأفضل محلي مش CDN

export default function SmartImage({ src, alt, priority = false }) {
  const finalSrc = optimizeAmazonImage(src);

  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderRadius: 12,
        overflow: "hidden",
        containIntrinsicSize: "500px", // 👈 مهم للأداء
      }}
    >
      <Image
        src={finalSrc || fallback}
        alt={alt || "product image"}

        /* ================= PERFORMANCE ================= */
        width={500}
        height={500}
        loading={priority ? "eager" : "lazy"}
        priority={priority} // 👈 أهم صورة فقط
        quality={70} // أقل = أسرع (أفضل للتجربة)
        placeholder="blur"
        blurDataURL={fallback}

        /* ================= SPEED OPTIMIZATION ================= */
        sizes="(max-width: 768px) 100vw, 500px"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
          transform: "translateZ(0)", // 👈 GPU acceleration
        }}
      />
    </div>
  );
          }
