import Image from "next/image";
import { optimizeAmazonImage } from "../lib/amazonImage";

export default function SmartImage({ src, alt }) {
  const finalSrc = optimizeAmazonImage(src);

  return (
    <Image
      src={finalSrc}
      alt={alt || "product image"}
      width={500}
      height={500}
      loading="lazy"
      quality={90}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+"
      style={{
        width: "100%",
        height: "auto",
        objectFit: "contain",
        background: "#fff",
      }}
    />
  );
}
