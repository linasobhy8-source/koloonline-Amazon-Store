import { useEffect } from "react";

export default function ImagePreloader({ images = [] }) {
  useEffect(() => {
    if (!Array.isArray(images)) return;

    images.forEach((url) => {
      if (typeof url !== "string" || !url.trim()) return;

      const img = new window.Image();

      img.src =
        `/api/cdn/ai-image?url=${encodeURIComponent(url)}` +
        "&w=600&q=80&priority=high";
    });
  }, [images]);

  return null;
}
