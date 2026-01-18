const cron = require('node-cron');
const Slot = require('../models/Slot');
const { getIO } = require('../controllers/alertController');

// CONSTANTS
const CROWD_DENSITY_THRESHOLD_PER_SQM = 2.5; // Example: > 2.5 people/sqm is "Overcrowded"
const SLOT_CAPACITY_BUFFER = 0.95; // Lock slot if 95% full

// Simulated function to get "Live" density from sensors (Randomized for demo)
const getLiveCrowdDensity = () => {
    // Randomize density between 0.5 to 3.0
    return (Math.random() * (3.0 - 0.5) + 0.5).toFixed(2);
};

const runCrowdControl = async () => {
    console.log('[CrowdControl] Running automated check...');

    try {
        const io = getIO(); // Get Socket.IO instance to broadcast alerts

        // 1. Check & Lock High Occupancy Slots
        const slots = await Slot.find({
            isLocked: false,
            bookingDate: { $gte: new Date() }
        });

        for (const slot of slots) {
            const occupancyRatio = slot.bookedCount / slot.capacity;

            if (occupancyRatio >= SLOT_CAPACITY_BUFFER) {
                slot.isLocked = true;
                await slot.save();
                console.log(`[CrowdControl] Locked Slot ${slot._id} due to high occupancy (${(occupancyRatio * 100).toFixed(1)}%)`);

                if (io) {
                    io.emit('slot-update', { slotId: slot._id, isLocked: true, reason: 'High Occupancy' });
                }
            }
        }

        // 2. Check Live Crowd Density
        const currentDensity = getLiveCrowdDensity();
        console.log(`[CrowdControl] Current Live Density: ${currentDensity} ppl/sqm`);

        if (currentDensity > CROWD_DENSITY_THRESHOLD_PER_SQM) {
            // TRIGGER EMERGENCY LOCKDOWN OR ALERT
            console.warn('[CrowdControl] CRITICAL DENSITY ALERT! Initiating safety protocols.');

            if (io) {
                // DISABLED PER USER REQUEST
                /*
                io.emit('new-incident', {
                    _id: `sys_alert_${Date.now()}`,
                    type: 'crowd',
                    description: `Automated: High Crowd Density detected (${currentDensity} ppl/sqm). Please slow down entry.`,
                    status: 'open',
                    severity: 'high',
                    location: 'Main Entrance (Sensor 1)',
                    timestamp: new Date()
                });
                */
            }
        }

    } catch (error) {
        console.error('[CrowdControl] Error in background job:', error);
    }
};

// Scheduled Task: Run every 10 seconds for demo purposes (In prod, might be every minute)
const startCrowdControlService = () => {
    // Schedule: */10 * * * * * (Every 10 seconds)
    cron.schedule('*/30 * * * * *', runCrowdControl);
    console.log('[CrowdControl] Service Started - Monitoring every 30s');
};

module.exports = { startCrowdControlService, runCrowdControl };
