import Image from "next/image";
import { useState } from "react";
import { cdnImage } from "../lib/cdnImage";

const fallback =
  "https://via.placeholder.com/500x500?text=Koloonline";

export default function SmartImage({ src, alt }) {
  const [error, setError] = useState(false);

  const finalSrc = error
    ? fallback
    : cdnImage(src || fallback);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        overflow: "hidden",
      }}
    >
      <Image
        src={finalSrc}
        alt={alt || "image"}
        fill
        sizes="(max-width: 768px) 100vw, 500px"
        loading="lazy"
        quality={60}
        onError={() => setError(true)}
        style={{
          objectFit: "contain",
        }}
      />
    </div>
  );
}
