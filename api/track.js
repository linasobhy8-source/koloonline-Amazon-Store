// ================= Express Router for Tracking =================
const express = require('express');
const router = express.Router();

// ================= Middleware to parse JSON =================
router.use(express.json());

// ================= POST /track =================
router.post('/track', (req, res) => {
  try {
    const { asin, type, country } = req.body;

    if (!asin || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing 'asin' or 'type' in request body"
      });
    }

    // هنا تضع المنطق الخاص بتسجيل الحدث
    // مثل حفظه في قاعدة بيانات أو إرسال لملف لوج
    console.log(`Tracking: ASIN=${asin}, Type=${type}, Country=${country || 'N/A'}`);

    return res.json({
      success: true,
      message: 'Tracking recorded successfully',
      data: { asin, type, country }
    });

  } catch (error) {
    console.error('❌ Tracking API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// ================= Export Router =================
module.exports = router;
