const Slot = require('../models/Slot');

// @desc    Create new slots (Admin only)
// @route   POST /api/slots
// @access  Private/Admin
exports.createSlots = async (req, res) => {
    try {
        const { date, startTime, endTime, capacity, zone, temple } = req.body;

        if (!temple) {
            return res.status(400).json({ message: "Temple ID is required" });
        }

        // specialized logic to create multiple slots if needed, for now single
        const slot = await Slot.create({
            date,
            startTime,
            endTime,
            capacity,
            zone,
            temple
        });

        res.status(201).json(slot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get available slots for a date
// @route   GET /api/slots
// @access  Public
exports.getSlots = async (req, res) => {
    try {
        const { date, zone, temple } = req.query;
        const query = {};

        if (temple) {
            query.temple = temple;
        }

        if (date) {
            // Match date regardless of time
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        }

        if (zone) query.zone = zone;

        const slots = await Slot.find(query).sort({ startTime: 1 });
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update slot status (lock/unlock) or capacity
// @route   PUT /api/slots/:id
// @access  Private/Admin|Police
exports.updateSlot = async (req, res) => {
    try {
        const { isLocked, capacity } = req.body;
        const updateData = {};

        if (typeof isLocked !== 'undefined') updateData.isLocked = isLocked;
        if (capacity) updateData.capacity = capacity;

        const slot = await Slot.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        res.json(slot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// @desc    Bulk update capacity (for future use)
// @route   PUT /api/slots/bulk-capacity
// @access  Private/Admin
exports.updateSlotCapacity = async (req, res) => {
    // Placeholder for bulk updates if needed
    res.status(501).json({ message: 'Not implemented yet' });
}
