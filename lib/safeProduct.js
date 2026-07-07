const SITE_URL = "https://koloonline.online";


/* ================= SAFE TEXT ================= */

export const safeText = (v) => {

  if (v == null) return "";


  if (typeof v === "string") {
    return v.trim();
  }


  if (
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return String(v);
  }


  if (Array.isArray(v)) {
    return v.map(safeText).join(" ");
  }


  if (typeof v === "object") {

    return (
      safeText(v.title) ||
      safeText(v.name) ||
      safeText(v.value) ||
      ""
    );

  }


  return "";

};



/* ================= SAFE NUMBER ================= */

export const safeNumber = (v) => {

  const n = Number(v);

  return Number.isFinite(n)
    ? n
    : 0;

};



/* ================= SAFE IMAGE ================= */

export const safeImage = (img) => {


  if (
    typeof img === "string" &&
    img.startsWith("http")
  ) {

    return img;

  }



  if (
    Array.isArray(img) &&
    img.length
  ) {

    return safeImage(img[0]);

  }



  if (
    typeof img === "object" &&
    img
  ) {

    return (

      img.url ||
      img.src ||
      img.image ||
      `${SITE_URL}/logo.png`

    );

  }



  return `${SITE_URL}/logo.png`;

};



/* ================= NORMALIZE PRODUCT ================= */

export const normalizeProduct = (product = {}) => {

  return {


    id:
      product.id ||
      product.asin ||
      "",



    asin:
      product.asin ||
      "",



    title:
      safeText(product.title) ||
      "Amazon Product",



    description:
      safeText(product.description),



    image:
      safeImage(
        product.image ||
        product.images
      ),



    images:
      Array.isArray(product.images)
        ? product.images
        : [],



    price:
      safeNumber(product.price),



    rating:
      safeNumber(product.rating),



    category:
      safeText(product.category),



    link:
      product.link || "",



    views:
      safeNumber(product.views),



    clicks:
      safeNumber(product.clicks),



    orders:
      safeNumber(product.orders),



    viralBoost:
      Boolean(product.viralBoost),



    slug:
      product.slug ||
      product.asin ||
      product.id ||
      ""

  };

};
