const socketIo = require('socket.io');

let io;

const setSocketIo = (socketIoInstance) => {
    io = socketIoInstance;
};

const sendAlert = async (req, res) => {
    try {
        const { message, severity, zone } = req.body;

        if (!message || !severity) {
            return res.status(400).json({ message: 'Message and severity are required' });
        }

        // Broadcast to all clients
        // varying event name based on zone could be an enhancement, but for now global broadcast
        if (io) {
            io.emit('crowd-alert', {
                message,
                severity, // 'info', 'warning', 'critical'
                zone: zone || 'All Zones',
                timestamp: new Date()
            });
            console.log(`Alert broadcasted: ${message} [${severity}]`);
            return res.status(200).json({ message: 'Alert broadcasted successfully' });
        } else {
            console.error('Socket.io instance not initialized in alertController');
            return res.status(500).json({ message: 'Internal Server Error: Socket not initialized' });
        }

    } catch (error) {
        console.error('Error sending alert:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getIO = () => io;

module.exports = {
    setSocketIo,
    sendAlert,
    getIO
};
