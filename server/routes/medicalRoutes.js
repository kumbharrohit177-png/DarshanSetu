const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
    getResources, 
    getAvailableResources,
    addResource, 
    updateResourceStatus, 
    updateResourceLocation,
    seedResources 
} = require('../controllers/medicalController');

// Seed endpoint - make it accessible without auth for initial setup
router.post('/seed', seedResources);

router.route('/resources')
    .get(protect, authorize('medical', 'admin'), getResources)
    .post(protect, authorize('admin'), addResource);

router.get('/resources/available', protect, authorize('medical', 'admin'), getAvailableResources);

router.route('/resources/:id/status')
    .put(protect, authorize('medical', 'admin'), updateResourceStatus);

router.put('/resources/:id/location', protect, authorize('medical', 'admin'), updateResourceLocation);

module.exports = router;
