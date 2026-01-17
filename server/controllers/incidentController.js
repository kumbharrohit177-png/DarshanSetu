const Incident = require('../models/Incident');

// @desc    Report an incident
// @route   POST /api/incidents
// @access  Private
exports.reportIncident = async (req, res) => {
    try {
        const { type, location, description } = req.body;

        const incident = await Incident.create({
            reportedBy: req.user.id,
            type,
            location,
            description
        });

        // Real-time alert to police/medical dashboards
        if (req.io) {
            req.io.emit('new-incident', incident);
        }

        res.status(201).json(incident);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all incidents (filtered by status/type)
// @route   GET /api/incidents
// @access  Private (Admin/Police/Medical)
exports.getIncidents = async (req, res) => {
    try {
        const { status, type } = req.query;
        const query = {};
        if (status) query.status = status;
        if (type) query.type = type;

        const incidents = await Incident.find(query)
            .populate('reportedBy', 'name phone')
            .sort({ createdAt: -1 });

        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
