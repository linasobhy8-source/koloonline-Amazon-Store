import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  setDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

/* ================= COUNTRY ================= */

export function getCountry() {

  if (
    typeof window ===
    "undefined"
  ) {
    return "US";
  }

  const lang =
    navigator.language ||
    "en-US";

  if (
    lang.includes("ar")
  ) {
    return "EG";
  }

  if (
    lang.includes("pl")
  ) {
    return "PL";
  }

  if (
    lang.includes("en-CA")
  ) {
    return "CA";
  }

  return "US";
}

/* ================= SAFE URL ================= */

function getSafeUrl() {

  if (
    typeof window ===
    "undefined"
  ) {
    return "";
  }

  return (
    window.location.href
  );
}

/* ================= SAFE NUMBER ================= */

function safeNumber(v) {
  return Number(v || 0);
}

/* ================= MAIN TRACK ================= */

export async function trackEvent(
  type,
  data = {}
) {

  try {

    const eventData = {

      type,

      asin:
        data.asin || null,

      title:
        data.title || "",

      category:
        data.category ||
        "unknown",

      price:
        safeNumber(
          data.price
        ),

      country:
        getCountry(),

      url:
        getSafeUrl(),

      timestamp:
        serverTimestamp(),
    };

    /* ================= RAW EVENTS ================= */

    addDoc(
      collection(
        db,
        "events"
      ),
      eventData
    ).catch(() => {});

    /* ================= OVERVIEW ================= */

    const overviewRef =
      doc(
        db,
        "analytics",
        "overview"
      );

    updateDoc(
      overviewRef,
      {

        ...(type ===
          "view" && {
          totalViews:
            increment(1),
        }),

        ...(type ===
          "click" && {
          totalClicks:
            increment(1),
        }),

        ...(type ===
          "order" && {
          totalOrders:
            increment(1),
        }),

        ...(type ===
          "whatsapp" && {
          totalWhatsApp:
            increment(1),
        }),
      }
    ).catch(() => {

      setDoc(
        overviewRef,
        {

          totalViews:
            type === "view"
              ? 1
              : 0,

          totalClicks:
            type === "click"
              ? 1
              : 0,

          totalOrders:
            type === "order"
              ? 1
              : 0,

          totalWhatsApp:
            type ===
            "whatsapp"
              ? 1
              : 0,
        },
        {
          merge: true,
        }
      );

    });

    /* ================= PRODUCT ================= */

    if (data.asin) {

      const analyticsRef =
        doc(
          db,
          "analytics_products",
          data.asin
        );

      updateDoc(
        analyticsRef,
        {

          ...(type ===
            "view" && {
            views:
              increment(1),
          }),

          ...(type ===
            "click" && {
            clicks:
              increment(1),
          }),

          ...(type ===
            "order" && {
            orders:
              increment(1),
          }),

          ...(type ===
            "whatsapp" && {
            whatsapp:
              increment(1),
          }),
        }
      ).catch(() => {

        setDoc(
          analyticsRef,
          {

            asin:
              data.asin,

            category:
              data.category ||
              "unknown",

            views:
              type === "view"
                ? 1
                : 0,

            clicks:
              type ===
              "click"
                ? 1
                : 0,

            orders:
              type ===
              "order"
                ? 1
                : 0,

            whatsapp:
              type ===
              "whatsapp"
                ? 1
                : 0,
          },
          {
            merge: true,
          }
        );

      });

      /* ================= PRODUCT SCORE ================= */

      const productRef =
        doc(
          db,
          "products",
          data.asin
        );

      const scoreWeight =

        type === "view"
          ? 0.05
          : type ===
            "click"
          ? 0.3
          : type ===
            "whatsapp"
          ? 0.8
          : type ===
            "order"
          ? 2
          : 0;

      updateDoc(
        productRef,
        {

          ...(type ===
            "view" && {
            views:
              increment(1),
          }),

          ...(type ===
            "click" && {
            clicks:
              increment(1),
          }),

          ...(type ===
            "order" && {
            orders:
              increment(1),
          }),

          ...(type ===
            "whatsapp" && {
            whatsapp:
              increment(1),
          }),

          score:
            increment(
              scoreWeight
            ),

          updatedAt:
            Date.now(),
        }
      ).catch(() => {

        setDoc(
          productRef,
          {

            asin:
              data.asin,

            title:
              data.title ||
              "",

            category:
              data.category ||
              "unknown",

            image:
              data.image ||
              "",

            price:
              safeNumber(
                data.price
              ),

            views:
              type === "view"
                ? 1
                : 0,

            clicks:
              type ===
              "click"
                ? 1
                : 0,

            orders:
              type ===
              "order"
                ? 1
                : 0,

            whatsapp:
              type ===
              "whatsapp"
                ? 1
                : 0,

            score:
              scoreWeight,

            updatedAt:
              Date.now(),
          },
          {
            merge: true,
          }
        );

      });

    }

    /* ================= DEV LOG ================= */

    if (
      process.env
        .NODE_ENV ===
      "development"
    ) {

      console.log(
        "🔥 Tracking:",
        eventData
      );

    }

  } catch (err) {

    console.error(
      "❌ Tracking Error:",
      err
    );

  }
                        }
