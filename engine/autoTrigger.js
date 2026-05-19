export async function autoTrigger(opportunities) {
  try {
    for (const item of opportunities) {
      if (item.score >= 80) {
        await fetch("/api/auto-create-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keyword: item.keyword,
            type: "blog",
          }),
        });
      }
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
