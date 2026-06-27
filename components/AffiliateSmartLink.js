import Link from "next/link";
import { useMemo } from "react";

/* ================= AFFILIATE ENGINE (LEVEL 2) ================= */
const AFF_TAG = "koloonline-20";

/* ================= HELPERS ================= */
function buildAffiliateUrl(href) {
  if (!href || typeof href !== "string") return "#";

  try {
    const isAmazon = href.includes("amazon");

    if (!isAmazon) return href;

    const hasTag = href.includes("tag=");

    if (hasTag) return href;

    const separator = href.includes("?") ? "&" : "?";

    return `${href}${separator}tag=${AFF_TAG}`;
  } catch {
    return href;
  }
}

/* ================= COMPONENT ================= */
export default function AffiliateSmartLink({
  href,
  children,
  external = false,
  className = "",
}) {
  const finalHref = useMemo(
    () => buildAffiliateUrl(href),
    [href]
  );

  if (external) {
    return (
      <a
        href={finalHref}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className={className}
        style={{
          color: "#007185",
          textDecoration: "none",
          fontWeight: 500,
          transition: "0.2s",
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={finalHref} legacyBehavior>
      <a
        className={className}
        style={{
          color: "#007185",
          textDecoration: "none",
          fontWeight: 500,
          transition: "0.2s",
        }}
      >
        {children}
      </a>
    </Link>
  );
}
