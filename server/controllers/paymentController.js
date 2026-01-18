const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay with credentials from environment variables
// If variables are missing, it will throw an error when used, which we handle.
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

// @desc    Create a new payment order
// @route   POST /api/payment/order
// @access  Private (Logged in users)
exports.createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        if (!process.env.RAZORPAY_KEY_ID) {
            // Fallback for demo mode if keys aren't set
            return res.status(200).json({
                success: true,
                demoMode: true,
                order_id: 'order_demo_' + Date.now(),
                amount: amount * 100,
                currency: currency,
                key: 'demo_key'
            });
        }

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);
        res.json({ success: true, ...order, key: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ message: "Something went wrong with payment initiation", error: error.message });
    }
};

// @desc    Verify payment signature
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!process.env.RAZORPAY_KEY_ID) {
            // Demo mode verification always succeeds
            return res.json({ success: true, message: "Demo Payment Verified" });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment is legit
            // Here you would typically save the donation/booking to the database
            res.json({ success: true, message: "Payment Verified" });
        } else {
            res.status(400).json({ success: false, message: "Invalid Signature" });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
