import { contentFactory } from "./contentFactory";
import { builderEngine } from "./builderEngine";
import { pricingEngine } from "./pricingEngine";

export async function moneyLoop(data) {
  console.log("💰 MONEY LOOP STARTED");

  /* 1️⃣ CREATE NEW PRODUCTS */
  const products = await builderEngine(data);

  /* 2️⃣ CREATE CONTENT + SEO PAGES */
  const content = await contentFactory(products);

  /* 3️⃣ OPTIMIZE PRICING */
  const pricing = await pricingEngine(products);

  const score =
    products.length * 10 +
    content.seoPages * 5 +
    pricing.optimizationScore;

  return {
    products,
    content,
    pricing,
    score,
  };
}
