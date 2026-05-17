export function generateInternalLinks({
  currentItem,
  allItems = [],
  limit = 8,
}) {
  if (!currentItem || !allItems.length) return [];

  const currentTitle =
    currentItem.title?.toLowerCase() || "";

  const currentCategory =
    currentItem.category?.toLowerCase() || "";

  const currentKeywords = currentTitle
    .split(" ")
    .filter((word) => word.length > 3);

  const scored = allItems
    .filter((item) => {
      if (!item?.title) return false;

      if (item.asin === currentItem.asin)
        return false;

      return true;
    })
    .map((item) => {
      const itemTitle =
        item.title?.toLowerCase() || "";

      const itemCategory =
        item.category?.toLowerCase() || "";

      let score = 0;

      // Same category boost
      if (
        currentCategory &&
        itemCategory === currentCategory
      ) {
        score += 5;
      }

      // Keyword matching
      currentKeywords.forEach((word) => {
        if (itemTitle.includes(word)) {
          score += 2;
        }
      });

      return {
        ...item,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}
