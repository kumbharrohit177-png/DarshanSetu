const express = require('express');
const { 
    reportIncident, 
    getIncidents, 
    updateIncidentStatus, 
    dispatchResource,
    getPrioritizedResources,
    updateResponseStatus
} = require('../controllers/incidentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, reportIncident)
    .get(protect, authorize('admin', 'police', 'medical'), getIncidents);

router.route('/:id/status')
    .put(protect, authorize('admin', 'police', 'medical'), updateIncidentStatus);

router.route('/:id/dispatch')
    .post(protect, authorize('admin', 'police', 'medical'), dispatchResource);

router.route('/:id/resources')
    .get(protect, authorize('admin', 'police', 'medical'), getPrioritizedResources);

router.route('/:id/response-status')
    .put(protect, authorize('admin', 'police', 'medical'), updateResponseStatus);

module.exports = router;
