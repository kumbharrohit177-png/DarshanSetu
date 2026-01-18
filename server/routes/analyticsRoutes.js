const express = require('express');
const router = express.Router();
const { getDashboardStats, getZoneDensity, getFootfallTrends } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('admin', 'police'), getDashboardStats);
router.get('/zones', protect, authorize('admin', 'police'), getZoneDensity);
router.get('/trends', protect, authorize('admin', 'police'), getFootfallTrends);

module.exports = router;
