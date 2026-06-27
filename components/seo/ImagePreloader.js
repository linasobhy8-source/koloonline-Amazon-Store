import { useEffect, useRef } from "react";

export default function ImagePreloader({ images = [] }) {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    if (!Array.isArray(images) || images.length === 0) return;

    loadedRef.current = true;

    const validImages = images.filter(
      (url) => typeof url === "string" && url.trim()
    );

    validImages.forEach((url) => {
      const img = new window.Image();

      img.decoding = "async";
      img.loading = "eager";

      img.src = `/api/cdn/ai-image?url=${encodeURIComponent(
        url
      )}&w=600&q=80&priority=high`;
    });
  }, [images]);

  return null;
}
