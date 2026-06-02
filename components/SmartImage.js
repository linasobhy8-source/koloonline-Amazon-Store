import Image from "next/image";
import { cdnImage } from "../lib/cdnImage";

const fallback =
  "https://via.placeholder.com/500x500?text=Koloonline";

export default function SmartImage({ src, alt }) {
  const final = cdnImage(src);

  return (
    <Image
      src={final || fallback}
      alt={alt || "image"}
      width={500}
      height={500}
      loading="lazy"
      quality={60}
      placeholder="blur"
      blurDataURL={fallback}
      style={{
        width: "100%",
        height: "auto",
        objectFit: "contain",
      }}
    />
  );
}
