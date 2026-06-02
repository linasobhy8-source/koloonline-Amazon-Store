import Image from "next/image";
import { optimizeAmazonImage } from "../lib/amazonImage";

const fallback =
  "https://via.placeholder.com/500x500?text=Koloonline";

export default function SmartImage({ src, alt }) {
  const finalSrc = optimizeAmazonImage(src);

  return (
    <div style={{
      width: "100%",
      background: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 10,
      overflow: "hidden"
    }}>
      <Image
        src={finalSrc || fallback}
        alt={alt || "product image"}
        width={500}
        height={500}
        loading="lazy"
        priority={false}
        quality={75}
        placeholder="blur"
        blurDataURL={fallback}
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
