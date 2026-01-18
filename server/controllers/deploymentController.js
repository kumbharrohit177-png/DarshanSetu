const Deployment = require('../models/Deployment');

// @desc    Get all deployments
// @route   GET /api/deployments
// @access  Private (Police/Admin)
exports.getDeployments = async (req, res) => {
    try {
        const deployments = await Deployment.find().sort({ createdAt: -1 });
        res.json(deployments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new deployment
// @route   POST /api/deployments
// @access  Private (Police/Admin)
exports.addDeployment = async (req, res) => {
    try {
        const { type, quantity, location, notes } = req.body;
        const deployment = await Deployment.create({
            type,
            quantity,
            location,
            notes,
            assignedBy: req.user.id
        });

        if (req.io) {
            req.io.emit('deployment-update', deployment);
        }

        res.status(201).json(deployment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update deployment status
// @route   PUT /api/deployments/:id
// @access  Private (Police/Admin)
exports.updateDeployment = async (req, res) => {
    try {
        const { status, quantity, location } = req.body;
        const deployment = await Deployment.findById(req.params.id);

        if (!deployment) {
            return res.status(404).json({ message: 'Deployment not found' });
        }

        deployment.status = status || deployment.status;
        deployment.quantity = quantity || deployment.quantity;
        deployment.location = location || deployment.location;

        const updatedDeployment = await deployment.save();

        if (req.io) {
            req.io.emit('deployment-update', updatedDeployment);
        }

        res.json(updatedDeployment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete deployment
// @route   DELETE /api/deployments/:id
// @access  Private (Police/Admin)
exports.deleteDeployment = async (req, res) => {
    try {
        const deployment = await Deployment.findById(req.params.id);
        if (!deployment) {
            return res.status(404).json({ message: 'Deployment not found' });
        }
        await deployment.deleteOne();
        res.json({ message: 'Deployment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
