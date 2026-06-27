import Link from "next/link";

/* ================= AFFILIATE CTR BOOSTER LINK ================= */
export default function AffiliateSmartLink({
  href,
  children,
  external = false,
  trackingTag = "koloonline-20",
}) {
  const finalHref = href?.includes("amazon")
    ? `${href}?tag=${trackingTag}`
    : href;

  if (external) {
    return (
      <a
        href={finalHref}
        target="_blank"
        rel="nofollow sponsored noopener"
        style={{ color: "#007185" }}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={finalHref}>
      <span style={{ color: "#007185" }}>
        {children}
      </span>
    </Link>
  );
}
