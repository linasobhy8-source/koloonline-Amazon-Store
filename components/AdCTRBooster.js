import { useEffect, useRef } from "react";

/* ================= CTR BOOSTER ENGINE ================= */
export default function AdCTRBooster({
  children,
  adsEnabled = true,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!adsEnabled) return;

    const el = containerRef.current;
    if (!el) return;

    /* ================= OBSERVER FOR VIEWABILITY ================= */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible-ad-zone");
          }
        });
      },
      { threshold: 0.4 }
    );

    const adSlots =
      el.querySelectorAll("[data-ad-slot]");

    adSlots.forEach((slot) => observer.observe(slot));

    return () => observer.disconnect();
  }, [adsEnabled]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}
