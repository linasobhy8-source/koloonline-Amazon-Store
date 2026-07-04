import { normalizeProduct as baseNormalize } from "./safeProduct";

/* ================= WRAPPER ================= */
/*
  هذا الملف فقط لحل خطأ build:
  Can't resolve '../../lib/normalizeProduct'
  
  وهو مجرد إعادة تصدير للـ safeProduct الأساسي
*/

export const normalizeProduct = (product = {}) => {
  return baseNormalize(product);
};

/* ================= OPTIONAL DEFAULT EXPORT ================= */
export default normalizeProduct;
