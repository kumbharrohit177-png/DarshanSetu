const MedicalResource = require('../models/MedicalResource');

// @desc    Get all medical resources
// @route   GET /api/medical/resources
// @access  Private (Medical/Admin)
exports.getResources = async (req, res) => {
    try {
        const resources = await MedicalResource.find().sort({ type: 1, name: 1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get available resources with live status
// @route   GET /api/medical/resources/available
// @access  Private (Medical/Admin)
exports.getAvailableResources = async (req, res) => {
    try {
        const resources = await MedicalResource.find({
            status: { $in: ['available', 'en_route'] }
        }).sort({ type: 1, name: 1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new medical resource
// @route   POST /api/medical/resources
// @access  Private (Admin)
exports.addResource = async (req, res) => {
    try {
        const { name, type, location, contactNumber } = req.body;
        const resource = await MedicalResource.create({
            name,
            type,
            location,
            contactNumber
        });
        res.status(201).json(resource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update resource status (e.g., set to busy/available)
// @route   PUT /api/medical/resources/:id/status
// @access  Private (Medical)
exports.updateResourceStatus = async (req, res) => {
    try {
        const { status, location } = req.body;
        const resource = await MedicalResource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        if (status) resource.status = status;
        if (location) {
            resource.location = {
                ...resource.location,
                ...location,
                lastUpdated: new Date()
            };
        }

        // If becoming available, clear assignment
        if (status === 'available') {
            resource.assignedIncident = null;
            resource.currentRoute = undefined;
        }

        resource.lastUpdated = Date.now();
        await resource.save();

        // Real-time update
        if (req.io) {
            req.io.emit('medical-resource-update', resource);
        }

        res.json(resource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update resource location in real-time
// @route   PUT /api/medical/resources/:id/location
// @access  Private (Medical)
exports.updateResourceLocation = async (req, res) => {
    try {
        const { lat, lng, zone } = req.body;
        const resource = await MedicalResource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        resource.location = {
            lat,
            lng,
            zone: zone || resource.location?.zone,
            lastUpdated: new Date()
        };
        resource.lastUpdated = Date.now();
        await resource.save();

        // Real-time update
        if (req.io) {
            req.io.emit('medical-resource-location-update', {
                resourceId: resource._id,
                location: resource.location
            });
        }

        res.json(resource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Seed initial resources (for demo)
// @route   POST /api/medical/seed
// @access  Public (Dev)
exports.seedResources = async (req, res) => {
    try {
        await MedicalResource.deleteMany();

        const resources = [
            { name: "Ambulance A1", type: "ambulance", status: "available", location: { zone: "North Gate", lat: 18.12, lng: 73.12 }, contactNumber: "9998887771" },
            { name: "Ambulance A2", type: "ambulance", status: "available", location: { zone: "South Parking", lat: 18.10, lng: 73.10 }, contactNumber: "9998887772" },
            { name: "Ambulance A3", type: "ambulance", status: "available", location: { zone: "East Gate", lat: 18.13, lng: 73.13 }, contactNumber: "9998887775" },
            { name: "First Aid Team Alpha", type: "first_aid_team", status: "available", location: { zone: "Sanctum", lat: 18.11, lng: 73.11 }, contactNumber: "9998887773" },
            { name: "First Aid Team Beta", type: "first_aid_team", status: "available", location: { zone: "Main Hall", lat: 18.115, lng: 73.115 }, contactNumber: "9998887776" },
            { name: "Medical Booth North", type: "medical_booth", status: "available", location: { zone: "North Gate", lat: 18.121, lng: 73.121 }, contactNumber: "9998887774" },
            { name: "Medical Booth South", type: "medical_booth", status: "available", location: { zone: "South Gate", lat: 18.105, lng: 73.105 }, contactNumber: "9998887777" }
        ];

        await MedicalResource.insertMany(resources);
        res.json({ message: "Medical Resources Seeded" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
