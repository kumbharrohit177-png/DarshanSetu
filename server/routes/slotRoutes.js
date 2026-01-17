const express = require('express');
const { createSlots, getSlots, updateSlot } = require('../controllers/slotController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getSlots)
    .post(protect, authorize('admin', 'police'), createSlots);

router.route('/:id')
    .put(protect, authorize('admin', 'police'), updateSlot);

module.exports = router;
