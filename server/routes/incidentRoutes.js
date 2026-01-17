const express = require('express');
const { reportIncident, getIncidents } = require('../controllers/incidentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, reportIncident)
    .get(protect, authorize('admin', 'police', 'medical'), getIncidents);

module.exports = router;
