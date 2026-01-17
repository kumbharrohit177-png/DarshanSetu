const express = require('express');
const { getTemples, createTemple } = require('../controllers/templeController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getTemples)
    .post(protect, authorize('admin'), createTemple);

module.exports = router;
