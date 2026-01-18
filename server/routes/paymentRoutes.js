const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');

// Note: In a real app, middleware like 'protect' should be used to secure these routes.
// For now, allow public access for easier testing or add 'protect' if auth is ready.
const { protect } = require('../middleware/authMiddleware');

router.post('/order', createOrder);
router.post('/verify', verifyPayment);

module.exports = router;
