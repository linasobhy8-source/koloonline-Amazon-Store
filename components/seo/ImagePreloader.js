import { useEffect } from "react";

export default function ImagePreloader({ images = [] }) {
  useEffect(() => {
    images.forEach((url) => {
      const img = new Image();
      img.src = `/api/cdn/ai-image?url=${encodeURIComponent(url)}&w=600&q=80&priority=high`;
    });
  }, [images]);

  return null;
}
