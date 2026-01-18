const Slot = require('../models/Slot');
const Booking = require('../models/Booking');

// @desc    Get dashboard overview stats
// @route   GET /api/analytics/dashboard
// @access  Private (Admin/Police)
exports.getDashboardStats = async (req, res) => {
    try {
        const { templeId } = req.query;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Filter Slots by Date and Temple
        const slotQuery = {
            date: { $gte: today, $lt: tomorrow }
        };
        if (templeId) {
            slotQuery.temple = templeId;
        }

        const slots = await Slot.find(slotQuery).select('_id');
        const slotIds = slots.map(s => s._id);

        // 1. Total Bookings for Today (via Slots)
        const totalBookings = await Booking.countDocuments({
            slot: { $in: slotIds },
            status: { $ne: 'cancelled' } // Optionally exclude cancelled
        });

        // 2. Checked-in Status
        const checkedInCount = await Booking.countDocuments({
            slot: { $in: slotIds },
            status: { $in: ['checked_in', 'completed'] }
        });

        // 3. Current Active Crowd (Mock Data)
        // Adjust mock data based on templeId for visual confirmation
        let minCrowd = 1200;
        let maxCrowd = 3800;

        if (templeId) {
            // make it deterministic based on templeId char code for demo
            const seed = templeId.charCodeAt(templeId.length - 1);
            minCrowd = 500 + (seed * 10);
            maxCrowd = 1500 + (seed * 20);
        }

        const activeCrowd = Math.floor(Math.random() * (maxCrowd - minCrowd + 1)) + minCrowd;

        // 4. Occupancy Rate (Mock Data)
        const occupancyRate = Math.floor(Math.random() * (85 - 45 + 1)) + 45;

        res.json({
            date: today.toISOString().split('T')[0],
            totalBookings, // Real Data
            checkedInCount, // Real Data
            activeCrowd,    // Mock Data
            occupancyRate   // Mock Data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Zone-wise Density
// @route   GET /api/analytics/zones
// @access  Private (Admin/Police)
exports.getZoneDensity = async (req, res) => {
    try {
        const { templeId } = req.query;

        // Mocking Zone Data since Slot model has 'zone' default 'Main Temple'
        // In real app, we would aggregate by 'zone' field in Slots
        // And filter by templeId if provided

        // Let's generate some realistic looking data
        // For distinctness, if a templeId is provided, we can slightly vary the random seed or names if we wanted,
        // but for now keeping the zones consistent as per "Zone Density" usually refers to standard zones.

        const zones = [
            { name: "Main Sanctum", capacity: 500, current: 0 },
            { name: "North Gate", capacity: 1000, current: 0 },
            { name: "East Gate", capacity: 800, current: 0 },
            { name: "Temple Gardens", capacity: 1500, current: 0 },
            { name: "Queue Complex", capacity: 2000, current: 0 }
        ];

        // Randomize varying load factors for demo
        const densityData = zones.map(zone => {
            // Use templeId to influence 'random' values so switching temples shows different data
            const seed = templeId ? templeId.charCodeAt(templeId.length - 1) : 0;
            const randomFactor = Math.random();
            // In a real scenario, this would come from database aggregation

            const loadFactor = 0.3 + (randomFactor * 0.6); // Random between 30% and 90%
            return {
                ...zone,
                current: Math.floor(zone.capacity * loadFactor),
                percentFull: Math.floor(loadFactor * 100)
            };
        });

        res.json(densityData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Footfall Trends (Hourly)
// @route   GET /api/analytics/trends
// @access  Private (Admin/Police)
exports.getFootfallTrends = async (req, res) => {
    try {
        // Mock hourly trend for visualization
        const hours = Array.from({ length: 15 }, (_, i) => i + 6); // 6 AM to 8 PM

        const trends = hours.map(hour => {
            // Peak hours around 10 AM and 6 PM
            let baseTraffic = 100;
            if (hour >= 9 && hour <= 11) baseTraffic = 300; // Morning Peak
            if (hour >= 17 && hour <= 19) baseTraffic = 250; // Evening Peak

            const randomVar = Math.floor(Math.random() * 50);
            return {
                time: `${hour}:00`,
                visitors: baseTraffic + randomVar,
                capacity: 400
            };
        });

        res.json(trends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
