const Temple = require('../models/Temple');

// @desc    Get all temples
// @route   GET /api/temples
// @access  Public
exports.getTemples = async (req, res) => {
    try {
        const temples = await Temple.find({});
        res.json(temples);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a temple
// @route   POST /api/temples
// @access  Private/Admin
exports.createTemple = async (req, res) => {
    try {
        const { name, location, description, imageUrl, openingHours } = req.body;
        const temple = await Temple.create({
            name,
            location,
            description,
            imageUrl,
            openingHours
        });
        res.status(201).json(temple);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
