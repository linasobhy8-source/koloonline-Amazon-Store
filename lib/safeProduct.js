const SITE_URL = "https://koloonline.online";


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



export const safeNumber = (v) => {

  const n = Number(v);

  return Number.isFinite(n)
    ? n
    : 0;

};



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
