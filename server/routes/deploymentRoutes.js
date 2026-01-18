const express = require('express');
const { getDeployments, addDeployment, updateDeployment, deleteDeployment } = require('../controllers/deploymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'police'));

router.route('/')
    .get(getDeployments)
    .post(addDeployment);

router.route('/:id')
    .put(updateDeployment)
    .delete(deleteDeployment);

module.exports = router;
