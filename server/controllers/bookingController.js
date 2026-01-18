const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const mongoose = require('mongoose');

// @desc    Book a slot
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { slotId, members, specialAssistance } = req.body;
        const slot = await Slot.findById(slotId).session(session);

        if (!slot) {
            throw new Error('Slot not found');
        }

        if (slot.isLocked) {
            throw new Error('Slot is currently locked due to crowd control');
        }

        const memberCount = members ? members.length + 1 : 1; // +1 for the user themselves if not included, but let's assume members includes everyone or just handle logic. 
        // Simpler logic: User + Members list.
        const totalPeople = 1 + (members ? members.length : 0);

        if (slot.bookedCount + totalPeople > slot.capacity) {
            throw new Error('Slot capacity exceeded');
        }

        slot.bookedCount += totalPeople;
        await slot.save({ session });

        const booking = await Booking.create([{
            user: req.user.id,
            slot: slotId,
            members,
            specialAssistance: specialAssistance || 'none',
            qrCode: `BOOK-${Date.now()}-${req.user.id}` // Placeholder QR generation
        }], { session });

        await session.commitTransaction();

        // Notify clients to refresh slot availability
        if (req.io) {
            req.io.emit('slot-update', { slotId: slot._id, bookedCount: slot.bookedCount });
        }

        res.status(201).json(booking[0]);
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate({
                path: 'slot',
                populate: {
                    path: 'temple',
                    model: 'Temple'
                }
            })
            .sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const booking = await Booking.findById(req.params.id).session(session);

        if (!booking) {
            throw new Error('Booking not found');
        }

        // Check ownership
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new Error('Not authorized to cancel this booking');
        }

        if (booking.status === 'cancelled') {
            throw new Error('Booking is already cancelled');
        }

        if (booking.status === 'completed' || booking.status === 'checked-in') {
            throw new Error('Cannot cancel a completed or checked-in booking');
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save({ session });

        // Update slot count
        const slot = await Slot.findById(booking.slot).session(session);
        if (slot) {
            const memberCount = booking.members ? booking.members.length + 1 : 1;
            slot.bookedCount = Math.max(0, slot.bookedCount - memberCount);
            await slot.save({ session });

            // Notify clients to refresh slot availability
            if (req.io) {
                req.io.emit('slot-update', { slotId: slot._id, bookedCount: slot.bookedCount });
            }
        }

        await session.commitTransaction();
        res.json(booking);
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};
