const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const alertController = require('./controllers/alertController');

dotenv.config();

const app = express();
console.log('Force Restart: Schema Update Reflected');
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://tranquil-florentine-f9bc55.netlify.app",
      "https://darshan-setu-client.onrender.com", // Future proofing
      process.env.CLIENT_URL
    ].filter(Boolean),
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Initialize Socket.IO in Alert Controller
alertController.setSocketIo(io);

// Start Automated Crowd Control Service
const { startCrowdControlService } = require('./services/crowdControlService');
startCrowdControlService();

// Middleware
app.use(cors());
app.use(express.json());

// Make io accessible to our routers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/temple-crowd-management', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit process in dev/production to allow retry or viewing logs without crash loop if possible, 
    // though usually we want to crash if DB fails. keeping it simple.
  }
};
connectDB();

// Routes Configuration
const authRoutes = require('./routes/authRoutes');
const slotRoutes = require('./routes/slotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const templeRoutes = require('./routes/templeRoutes');
const deploymentRoutes = require('./routes/deploymentRoutes');
const medicalRoutes = require('./routes/medicalRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/temples', templeRoutes);
app.use('/api/deployments', deploymentRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.post('/api/alerts/send', alertController.sendAlert);

app.get('/', (req, res) => {
  res.send('Temple Crowd Management API');
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', (room) => {
    socket.join(room);
  });

  socket.on('update-location', (data) => {
    // Broadcast location update to all clients (or specifically to 'staff' room if implemented)
    // data should contain { userId, role, lat, lng, timestamp }
    io.emit('pilgrim-location-update', data);
  });

  // Medical resource location updates
  socket.on('medical-resource-location', async (data) => {
    // data should contain { resourceId, lat, lng, zone }
    try {
      const MedicalResource = require('./models/MedicalResource');
      const resource = await MedicalResource.findById(data.resourceId);
      if (resource) {
        resource.location = {
          lat: data.lat,
          lng: data.lng,
          zone: data.zone || resource.location?.zone,
          lastUpdated: new Date()
        };
        resource.lastUpdated = new Date();
        await resource.save();

        // Broadcast to all medical dashboards
        io.emit('medical-resource-location-update', {
          resourceId: resource._id,
          location: resource.location
        });
      }
    } catch (error) {
      console.error('Error updating medical resource location:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
