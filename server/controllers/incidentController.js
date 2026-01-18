const Incident = require('../models/Incident');
const Booking = require('../models/Booking');

// @desc    Report an incident
// @route   POST /api/incidents
// @access  Private
exports.reportIncident = async (req, res) => {
    try {
        let { type, location, description } = req.body;

        // Auto-detect location context from booking (Contextual Location)
        let bookingContext = null;
        try {
            console.log("🔍 [SOS Debug] User ID:", req.user ? req.user.id : 'No User');
            const activeBooking = await Booking.findOne({
                user: req.user.id,
                status: { $in: ['booked', 'checked-in', 'completed'] },
            })
                .populate({
                    path: 'slot',
                    populate: { path: 'temple', model: 'Temple' }
                })
                .sort({ createdAt: -1 }); // Get most recent

            console.log("🔍 [SOS Debug] Active Booking Found:", activeBooking ? activeBooking._id : 'None');

            if (activeBooking && activeBooking.slot) {
                const placeName = activeBooking.slot.temple ? activeBooking.slot.temple.name : 'Temple Zone';
                const zoneName = activeBooking.slot.zone || 'General Area';
                bookingContext = `Booking: ${placeName} (${zoneName})`;
                console.log("📍 [SOS Debug] Context:", bookingContext);
            } else {
                console.log("⚠️ [SOS Debug] Booking found but no slot/temple?", activeBooking);
            }
        } catch (err) {
            console.error("Error fetching booking for location:", err);
        }

        // Determine Final Location
        // Prioritize Booking Context. Hide coordinates if booking exists.
        if (bookingContext) {
            // Check if input is raw coordinates
            if (location && location.match(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/)) {
                location = `${bookingContext} [GPS: ${location}]`;
            } else if (!location || location === 'Unknown Location (No GPS)') {
                location = bookingContext;
            } else {
                location = `${bookingContext} - ${location}`;
            }
        }
        // Fallback: If no booking context, use a realistic simulated location
        else if (!location || location === 'Unknown Location') {
            const simulatedLocations = [
                { name: 'Siddhivinayak Temple (Main Hall)', coords: '19.017, 72.830' },
                { name: 'Kashi Vishwanath (Gate 2)', coords: '25.310, 83.010' },
                { name: 'Tirupati Balaji (Queuing Complex)', coords: '13.628, 79.419' },
                { name: 'Somnath Temple (Sea View)', coords: '20.888, 70.401' },
                { name: 'Jagannath Puri (North Gate)', coords: '19.813, 85.831' }
            ];
            const randomLoc = simulatedLocations[Math.floor(Math.random() * simulatedLocations.length)];
            const randomOffsetLat = (Math.random() - 0.5) * 0.002;
            const randomOffsetLng = (Math.random() - 0.5) * 0.002;

            // Parse base coords to add slight randomness for authenticity
            const [baseLat, baseLng] = randomLoc.coords.split(', ').map(Number);
            const finalLat = (baseLat + randomOffsetLat).toFixed(6);
            const finalLng = (baseLng + randomOffsetLng).toFixed(6);

            location = `Near ${randomLoc.name} [GPS: ${finalLat}, ${finalLng}]`;
            console.log("🎲 [SOS Debug] Generated Simulated Location:", location);
        }

        console.log("📝 Final Incident Location:", location);

        // Append User Name to Description if not present
        if (req.user && req.user.name) {
            description = `SOS from ${req.user.name}: ${description}`;
        }

        // Extract coordinates from location string if available
        let coordinates = null;
        if (location) {
            const gpsMatch = location.match(/GPS: ([0-9.-]+),\s*([0-9.-]+)/);
            if (gpsMatch) {
                coordinates = {
                    lat: parseFloat(gpsMatch[1]),
                    lng: parseFloat(gpsMatch[2])
                };
            } else if (location.match(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/)) {
                const parts = location.split(',').map(s => s.trim());
                coordinates = {
                    lat: parseFloat(parts[0]),
                    lng: parseFloat(parts[1])
                };
            }
        }

        let incident = await Incident.create({
            reportedBy: req.user.id,
            type,
            location,
            coordinates,
            description,
            severity: req.body.severity || 'medium'
        });

        // Add initial log entry
        incident.responseLog.push({
            timestamp: new Date(),
            action: 'reported',
            notes: `Incident reported by ${req.user.name || 'User'}`
        });
        await incident.save();

        incident = await incident.populate('reportedBy', 'name phone');

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
// @desc    Dispatch a resource to an incident
// @route   POST /api/incidents/:id/dispatch
// @access  Private (Police/Medical)
exports.dispatchResource = async (req, res) => {
    try {
        const { resourceId, useAutoRouting } = req.body;
        const incidentId = req.params.id;

        const incident = await Incident.findById(incidentId);
        if (!incident) {
            return res.status(404).json({ message: 'Incident not found' });
        }

        const MedicalResource = require('../models/MedicalResource');
        const routingService = require('../services/routingService');

        let resource;
        let routeInfo = null;

        // Auto-routing: Find best resource automatically
        if (useAutoRouting) {
            // If no coordinates, try to extract from location string
            if (!incident.coordinates && incident.location) {
                const gpsMatch = incident.location.match(/GPS: ([0-9.-]+),\s*([0-9.-]+)/);
                if (gpsMatch) {
                    incident.coordinates = {
                        lat: parseFloat(gpsMatch[1]),
                        lng: parseFloat(gpsMatch[2])
                    };
                } else if (incident.location.match(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/)) {
                    const parts = incident.location.split(',');
                    incident.coordinates = {
                        lat: parseFloat(parts[0]),
                        lng: parseFloat(parts[1])
                    };
                }
            }

            const availableResources = await MedicalResource.find({
                status: { $in: ['available', 'en_route'] }
            });

            if (availableResources.length === 0) {
                return res.status(404).json({
                    message: 'No available medical resources found. Please ensure resources are seeded and marked as available.'
                });
            }

            if (incident.coordinates &&
                !isNaN(incident.coordinates.lat) && !isNaN(incident.coordinates.lng) &&
                isFinite(incident.coordinates.lat) && isFinite(incident.coordinates.lng)) {

                const bestMatch = await routingService.findBestResource(
                    incident.coordinates,
                    incident.severity || 'medium',
                    availableResources
                );

                if (bestMatch && bestMatch.resource) {
                    resource = bestMatch.resource;

                    // Validate route info before using
                    if (!isNaN(bestMatch.estimatedTime) && isFinite(bestMatch.estimatedTime) &&
                        bestMatch.routePoints && bestMatch.routePoints.length > 0) {
                        const validRoutePoints = bestMatch.routePoints.filter(p =>
                            p && !isNaN(p.lat) && !isNaN(p.lng) &&
                            isFinite(p.lat) && isFinite(p.lng)
                        );

                        if (validRoutePoints.length > 0) {
                            routeInfo = {
                                distance: bestMatch.distance,
                                estimatedTime: bestMatch.estimatedTime,
                                routePoints: validRoutePoints
                            };
                        }
                    }
                } else {
                    // Fallback: use first available resource
                    resource = availableResources[0];
                }
            } else {
                // No valid coordinates, use first available resource
                resource = availableResources[0];
            }
        } else {
            // Manual dispatch
            if (!resourceId) {
                return res.status(400).json({ message: 'Resource ID is required for manual dispatch' });
            }

            resource = await MedicalResource.findById(resourceId);
            if (!resource) {
                return res.status(404).json({ message: 'Resource not found' });
            }

            if (resource.status === 'busy' || resource.status === 'maintenance') {
                return res.status(400).json({ message: `Resource is currently ${resource.status}. Please select an available resource.` });
            }

            // Calculate route if coordinates available
            if (incident.coordinates && resource.location &&
                !isNaN(incident.coordinates.lat) && !isNaN(incident.coordinates.lng) &&
                !isNaN(resource.location.lat) && !isNaN(resource.location.lng)) {
                const distance = routingService.calculateDistance(
                    resource.location.lat,
                    resource.location.lng,
                    incident.coordinates.lat,
                    incident.coordinates.lng
                );
                const trafficPenalty = routingService.calculateTrafficPenalty(
                    resource.location.lat,
                    resource.location.lng,
                    incident.coordinates.lat,
                    incident.coordinates.lng
                );
                const estimatedTime = routingService.calculateEstimatedTime(
                    distance,
                    trafficPenalty,
                    resource.type
                );

                // Only generate route if we have valid numbers
                if (!isNaN(distance) && !isNaN(estimatedTime) && isFinite(estimatedTime) && estimatedTime > 0) {
                    const routePoints = routingService.generateRoutePoints(
                        resource.location.lat,
                        resource.location.lng,
                        incident.coordinates.lat,
                        incident.coordinates.lng
                    );

                    // Validate route points
                    const validRoutePoints = routePoints.filter(p =>
                        !isNaN(p.lat) && !isNaN(p.lng) &&
                        isFinite(p.lat) && isFinite(p.lng)
                    );

                    if (validRoutePoints.length > 0) {
                        routeInfo = {
                            distance,
                            estimatedTime,
                            routePoints: validRoutePoints
                        };
                    }
                }
            }
        }

        // Update Incident
        if (!incident.assignedResources.includes(resource._id)) {
            incident.assignedResources.push(resource._id);
        }

        if (incident.status === 'open') {
            incident.status = 'en_route';
            incident.dispatchedAt = new Date();
        }

        // Add response log entry
        incident.responseLog.push({
            timestamp: new Date(),
            action: 'dispatched',
            resourceId: resource._id,
            notes: `Resource ${resource.name} dispatched to incident`,
            location: incident.coordinates || null
        });

        await incident.save();

        // Update Resource
        resource.status = 'en_route';
        resource.assignedIncident = incidentId;

        // Only set route if we have valid data
        if (routeInfo && incident.coordinates &&
            !isNaN(routeInfo.estimatedTime) && isFinite(routeInfo.estimatedTime) &&
            routeInfo.estimatedTime > 0 && routeInfo.routePoints &&
            routeInfo.routePoints.length > 0) {

            const estimatedArrival = new Date(Date.now() + routeInfo.estimatedTime * 1000);

            // Validate all route points are valid numbers
            const validRoutePoints = routeInfo.routePoints.filter(p =>
                p && !isNaN(p.lat) && !isNaN(p.lng) &&
                isFinite(p.lat) && isFinite(p.lng)
            );

            if (!isNaN(estimatedArrival.getTime()) && validRoutePoints.length > 0) {
                resource.currentRoute = {
                    destination: {
                        lat: incident.coordinates.lat,
                        lng: incident.coordinates.lng
                    },
                    estimatedArrival: estimatedArrival,
                    routePoints: validRoutePoints
                };
            }
        }

        await resource.save();

        // Add to response history
        resource.responseHistory.push({
            incidentId: incidentId,
            dispatchedAt: new Date(),
            responseTime: routeInfo ? routeInfo.estimatedTime : null,
            distance: routeInfo ? routeInfo.distance : null
        });
        await resource.save();

        if (req.io) {
            req.io.emit('incident-update', await incident.populate('assignedResources'));
            req.io.emit('medical-resource-update', resource);

            // NOTIFY THE PILGRIM (Reporter)
            // We broadcast to all, but the client NotificationToast will filter based on user ID if needed, 
            // OR we can rely on the fact that we are broadcasting a general "Help is coming" message if we don't have private rooms set up yet.
            // For now, we will emit a generic event that the client can listen to, and we can include the pilgrimId in the data 
            // so the client can check "if (this.userId === data.pilgrimId)".

            // Dynamic ETA Calculation
            // For Demo/UX realism: Cap ETA at 10 minutes max provided the user request.
            // If calculated time is > 10 mins, force it to be between 5-9 mins.
            let calcEta = routeInfo && routeInfo.estimatedTime ? Math.ceil(routeInfo.estimatedTime / 60) : 0;

            if (calcEta === 0 || calcEta > 10) {
                calcEta = Math.floor(Math.random() * (9 - 5 + 1)) + 5; // Random 5-9 mins
            }

            const etaMinutes = calcEta;

            req.io.emit('pilgrim-notification', {
                targetUserId: incident.reportedBy,
                message: `🚑 Ambulance & MedKit dispatched! Arriving in ${etaMinutes} mins.`,
                severity: 'info', // Frontend converts -> success
                timestamp: new Date(),
                eta: etaMinutes,
                incidentId: incident._id // useful for tracking
            });
        }

        // UX/Demo Fix: Ensure the API response also reflects the realistic demo time
        if (routeInfo) {
            routeInfo.estimatedTime = 300 + Math.floor(Math.random() * 300); // 5-10 mins in seconds
        }

        res.json({
            incident,
            resource,
            routeInfo
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get prioritized resources for an incident
// @route   GET /api/incidents/:id/resources
// @access  Private (Police/Medical)
exports.getPrioritizedResources = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);
        if (!incident) {
            return res.status(404).json({ message: 'Incident not found' });
        }

        if (!incident.coordinates) {
            return res.status(400).json({ message: 'Incident location not available' });
        }

        const routingService = require('../services/routingService');
        const prioritizedResources = await routingService.getPrioritizedResources(
            incident.coordinates,
            incident.severity || 'medium'
        );

        res.json(prioritizedResources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update incident response status
// @route   PUT /api/incidents/:id/response-status
// @access  Private (Police/Medical)
exports.updateResponseStatus = async (req, res) => {
    try {
        const { status, resourceId, notes, location } = req.body;
        const incident = await Incident.findById(req.params.id);

        if (!incident) {
            return res.status(404).json({ message: 'Incident not found' });
        }

        const validStatuses = ['en_route', 'on_scene', 'resolved'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        incident.status = status;

        // Add response log entry
        incident.responseLog.push({
            timestamp: new Date(),
            action: status,
            resourceId: resourceId || null,
            notes: notes || null,
            location: location || incident.coordinates || null
        });

        // Update timestamps
        if (status === 'on_scene' && !incident.arrivedAt) {
            incident.arrivedAt = new Date();
        } else if (status === 'resolved') {
            incident.resolvedAt = new Date();
            if (incident.dispatchedAt) {
                incident.totalResponseTime = Math.floor(
                    (incident.resolvedAt - incident.dispatchedAt) / 1000
                );
            }

            // Update resource status
            if (resourceId) {
                const MedicalResource = require('../models/MedicalResource');
                const resource = await MedicalResource.findById(resourceId);
                if (resource) {
                    resource.status = 'available';
                    resource.assignedIncident = null;
                    resource.currentRoute = undefined;

                    // Update response history
                    const historyEntry = resource.responseHistory.find(
                        h => h.incidentId.toString() === incident._id.toString()
                    );
                    if (historyEntry) {
                        historyEntry.completedAt = new Date();
                        if (historyEntry.dispatchedAt) {
                            historyEntry.responseTime = Math.floor(
                                (historyEntry.completedAt - historyEntry.dispatchedAt) / 1000
                            );
                        }
                    }
                    await resource.save();
                }
            }
        }

        await incident.save();

        if (req.io) {
            req.io.emit('incident-update', await incident.populate('assignedResources'));
        }

        res.json(incident);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateIncidentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const incident = await Incident.findById(req.params.id);

        if (!incident) {
            return res.status(404).json({ message: 'Incident not found' });
        }

        incident.status = status;
        // Add log or logic for whoever resolved it
        await incident.save();

        if (req.io) {
            req.io.emit('incident-update', incident);
        }

        res.json(incident);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
