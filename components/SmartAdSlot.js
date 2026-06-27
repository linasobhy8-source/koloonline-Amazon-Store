import { useEffect, useState } from "react";

/* ================= SMART ADS SLOT (CTR BOOSTED) ================= */
export default function SmartAdSlot() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
    }, 1500); // 🔥 delay improves CTR

    return () => clearTimeout(t);
  }, []);

  if (!visible) {
    return (
      <div
        style={{
          height: 90,
          background: "#f5f5f5",
          borderRadius: 8,
        }}
      />
    );
  }

  return (
    <div
      data-ad-slot="true"
      style={{
        margin: "20px 0",
        padding: 10,
        border: "1px dashed #ccc",
        textAlign: "center",
        background: "#fff",
      }}
    >
      {/* Google AdSense will inject here */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1294940976431468"
        data-ad-slot="AUTO"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
