
/* ================= BASIC LOGGER ================= */
function log(message, data) {
  console.log(`[SEO PUSH] ${message}`, data || "");
}

/* ================= SIMULATED INDEX QUEUE ================= */
const indexQueue = [];

/* ================= ADD TO INDEX QUEUE ================= */
export function pushToIndexing(data = []) {
  if (!Array.isArray(data) || data.length === 0) {
    log("No data to index");
    return;
  }

  data.forEach((item) => {
    if (!item?.url) return;

    indexQueue.push({
      url: item.url,
      type: item.type || "product",
      priority: item.priority || 1,
      timestamp: Date.now(),
    });
  });

  log("Queued items for indexing", indexQueue.length);

  return indexQueue;
}

/* ================= PROCESS INDEXING BATCH ================= */
export async function processIndexQueue() {
  if (!indexQueue.length) {
    log("Queue empty");
    return;
  }

  const batch = indexQueue.splice(0, 10);

  log("Processing batch", batch.length);

  // هنا مستقبلًا ممكن تضيف:
  // - IndexNow API
  // - Google ping
  // - Bing ping

  return {
    processed: batch.length,
    status: "simulated",
  };
}

/* ================= GET STATUS ================= */
export function getIndexQueueStatus() {
  return {
    queueSize: indexQueue.length,
    items: indexQueue,
  };
}
