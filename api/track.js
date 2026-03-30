const express = require('express');
const router = express.Router();

// Tracking API endpoint
router.post('/track', (req, res) => {
    // Logic for tracking
    res.json({ status: 'tracking success' });
});

module.exports = router;
