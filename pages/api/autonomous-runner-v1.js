import { db } from "../../config/firebase";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= CACHE ================= */
let cache = null;
let lastRun = 0;

const CACHE_TTL = 1000 * 60 * 5;

/* ================= SAFE FETCH ================= */
async function run(path, timeout = 10000) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://koloonline.online";

    const response = await fetch(
      `${baseUrl}${path}`,
      {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      }
    );

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timer);

    return {
      success: false,
      error:
        error?.message ||
        "Request failed",
    };
  }
}

/* ================= HANDLER ================= */
export default async function handler(
  req,
  res
) {
  const startedAt = Date.now();

  try {
    /* ================= METHOD CHECK ================= */
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        error: "Method Not Allowed",
      });
    }

    /* ================= MEMORY CACHE ================= */
    if (
      cache &&
      Date.now() - lastRun < CACHE_TTL
    ) {
      return res.status(200).json(cache);
    }

    /* ================= PIPELINE ================= */
    const flywheel = await run(
      "/api/growth-flywheel-v1"
    );

    const runtime =
      Date.now() - startedAt;

    /* ================= LOG ERRORS ONLY ================= */
    if (!flywheel?.success) {
      await addDoc(
        collection(db, "cron_logs"),
        {
          type: "autonomous_runner",
          status: "failed",
          runtime,
          error:
            flywheel?.error ||
            "Unknown error",
          timestamp:
            serverTimestamp(),
        }
      );
    }

    /* ================= CACHE HEADERS ================= */
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    const result = {
      success: true,
      runtime,
      timestamp: Date.now(),
      flywheel,
      message:
        "Autonomous system executed successfully",
    };

    cache = result;
    lastRun = Date.now();

    return res.status(200).json(result);

  } catch (error) {
    console.error(
      "AUTONOMOUS RUNNER ERROR:",
      error
    );

    try {
      await addDoc(
        collection(db, "cron_logs"),
        {
          type: "autonomous_runner",
          status: "crash",
          error:
            error?.message ||
            "Unknown error",
          timestamp:
            serverTimestamp(),
        }
      );
    } catch {}

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Internal Server Error",
    });
  }
          }
