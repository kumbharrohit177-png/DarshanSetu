const MedicalResource = require('../models/MedicalResource');

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

/**
 * Get crowd density at a location (simulated - in production, use real sensor data)
 * @param {number} lat 
 * @param {number} lng 
 * @returns {number} Density factor (0-1, where 1 is maximum congestion)
 */
function getCrowdDensityAtLocation(lat, lng) {
    // Simulate crowd density based on location
    // In production, this would query real-time sensor data or heatmap data
    const baseDensity = 0.3; // Base density
    const randomVariation = Math.random() * 0.4; // 0-0.4 variation
    return Math.min(1, baseDensity + randomVariation);
}

/**
 * Calculate traffic/crowd penalty for a route
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Penalty multiplier (1.0 = no penalty, higher = more delay)
 */
function calculateTrafficPenalty(lat1, lon1, lat2, lon2) {
    // Get density at start, midpoint, and end
    const midLat = (lat1 + lat2) / 2;
    const midLng = (lon1 + lon2) / 2;
    
    const densityStart = getCrowdDensityAtLocation(lat1, lon1);
    const densityMid = getCrowdDensityAtLocation(midLat, midLng);
    const densityEnd = getCrowdDensityAtLocation(lat2, lon2);
    
    const avgDensity = (densityStart + densityMid + densityEnd) / 3;
    
    // Convert density to time penalty (1.0 = no delay, 2.0 = double time)
    return 1.0 + (avgDensity * 1.5); // Max 2.5x time penalty
}

/**
 * Calculate estimated travel time considering distance and traffic
 * @param {number} distance Distance in meters
 * @param {number} trafficPenalty Traffic/crowd penalty multiplier
 * @param {string} resourceType Type of resource (ambulance, first_aid_team, etc.)
 * @returns {number} Estimated time in seconds
 */
function calculateEstimatedTime(distance, trafficPenalty, resourceType) {
    // Validate inputs
    if (isNaN(distance) || isNaN(trafficPenalty) || distance < 0 || trafficPenalty <= 0) {
        return 0; // Return 0 if invalid
    }
    
    // Base speeds (in m/s)
    const speeds = {
        'ambulance': 15, // ~54 km/h average in urban areas
        'first_aid_team': 1.5, // Walking speed
        'medical_booth': 0 // Stationary
    };
    
    const baseSpeed = speeds[resourceType] || 5; // Default 5 m/s
    const effectiveSpeed = baseSpeed / trafficPenalty;
    
    if (effectiveSpeed <= 0) {
        return 0; // Avoid division by zero
    }
    
    const time = distance / effectiveSpeed;
    return isNaN(time) || !isFinite(time) ? 0 : time; // Time in seconds
}

/**
 * Find the best resource to dispatch for an incident
 * @param {Object} incidentLocation {lat, lng}
 * @param {string} incidentSeverity 'low' | 'medium' | 'high' | 'critical'
 * @param {Array} availableResources Array of MedicalResource objects
 * @returns {Object} {resource, distance, estimatedTime, route}
 */
async function findBestResource(incidentLocation, incidentSeverity = 'medium', availableResources = []) {
    if (!availableResources || availableResources.length === 0) {
        throw new Error('No available resources');
    }

    const incidentLat = incidentLocation.lat;
    const incidentLng = incidentLocation.lng;
    
    // Validate incident location
    if (isNaN(incidentLat) || isNaN(incidentLng) || 
        !isFinite(incidentLat) || !isFinite(incidentLng)) {
        throw new Error('Invalid incident location coordinates');
    }

    // Calculate priority scores for each resource
    const scoredResources = availableResources.map(resource => {
        if (!resource.location || !resource.location.lat || !resource.location.lng) {
            return null;
        }

        const resourceLat = resource.location.lat;
        const resourceLng = resource.location.lng;

        // Calculate straight-line distance
        const distance = calculateDistance(incidentLat, incidentLng, resourceLat, resourceLng);

        // Calculate traffic/crowd penalty
        const trafficPenalty = calculateTrafficPenalty(resourceLat, resourceLng, incidentLat, incidentLng);

        // Calculate estimated time
        const estimatedTime = calculateEstimatedTime(distance, trafficPenalty, resource.type);

        // Priority scoring
        let priorityScore = 0;

        // Distance factor (closer = better, max 100 points)
        const maxDistance = 5000; // 5km max consideration
        const distanceScore = Math.max(0, 100 * (1 - distance / maxDistance));
        priorityScore += distanceScore * 0.4; // 40% weight

        // Resource type priority (ambulance preferred for critical, teams for minor)
        let typeScore = 50;
        if (incidentSeverity === 'critical' || incidentSeverity === 'high') {
            if (resource.type === 'ambulance') typeScore = 100;
            else if (resource.type === 'first_aid_team') typeScore = 60;
            else typeScore = 30;
        } else {
            if (resource.type === 'first_aid_team') typeScore = 80;
            else if (resource.type === 'ambulance') typeScore = 70;
            else typeScore = 50;
        }
        priorityScore += typeScore * 0.3; // 30% weight

        // Availability factor (available > en_route)
        const availabilityScore = resource.status === 'available' ? 100 : 50;
        priorityScore += availabilityScore * 0.2; // 20% weight

        // Time factor (faster = better, max 100 points)
        const maxTime = 1800; // 30 minutes max consideration
        const timeScore = Math.max(0, 100 * (1 - estimatedTime / maxTime));
        priorityScore += timeScore * 0.1; // 10% weight

        // Generate route points (simplified - in production, use routing API)
        const routePoints = generateRoutePoints(resourceLat, resourceLng, incidentLat, incidentLng);

        return {
            resource,
            distance,
            estimatedTime,
            trafficPenalty,
            priorityScore,
            routePoints
        };
    }).filter(result => result !== null);

    // Sort by priority score (highest first)
    scoredResources.sort((a, b) => b.priorityScore - a.priorityScore);

    return scoredResources[0]; // Return best match
}

/**
 * Generate route points between two locations (simplified)
 * In production, use a routing service like OSRM, Mapbox, or Google Directions API
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {Array} Array of {lat, lng} points
 */
function generateRoutePoints(lat1, lon1, lat2, lon2) {
    // Validate inputs
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2) ||
        !isFinite(lat1) || !isFinite(lon1) || !isFinite(lat2) || !isFinite(lon2)) {
        // Return empty array if invalid
        return [];
    }
    
    // Simplified: return start, midpoint, and end
    // In production, use a proper routing service
    const midLat = (lat1 + lat2) / 2;
    const midLng = (lon1 + lon2) / 2;
    
    const points = [
        { lat: lat1, lng: lon1 },
        { lat: midLat, lng: midLng },
        { lat: lat2, lng: lon2 }
    ];
    
    // Validate all points are valid numbers
    return points.filter(p => 
        !isNaN(p.lat) && !isNaN(p.lng) && 
        isFinite(p.lat) && isFinite(p.lng)
    );
}

/**
 * Get all available resources sorted by priority for an incident
 * @param {Object} incidentLocation {lat, lng}
 * @param {string} incidentSeverity 
 * @returns {Array} Sorted array of resources with scores
 */
async function getPrioritizedResources(incidentLocation, incidentSeverity = 'medium') {
    const availableResources = await MedicalResource.find({
        status: { $in: ['available', 'en_route'] }
    });

    if (availableResources.length === 0) {
        return [];
    }

    const incidentLat = incidentLocation.lat;
    const incidentLng = incidentLocation.lng;

    const scoredResources = availableResources.map(resource => {
        if (!resource.location || !resource.location.lat || !resource.location.lng) {
            return null;
        }

        const resourceLat = resource.location.lat;
        const resourceLng = resource.location.lng;
        const distance = calculateDistance(incidentLat, incidentLng, resourceLat, resourceLng);
        const trafficPenalty = calculateTrafficPenalty(resourceLat, resourceLng, incidentLat, incidentLng);
        const estimatedTime = calculateEstimatedTime(distance, trafficPenalty, resource.type);
        const routePoints = generateRoutePoints(resourceLat, resourceLng, incidentLat, incidentLng);

        // Calculate priority score
        const maxDistance = 5000;
        const distanceScore = Math.max(0, 100 * (1 - distance / maxDistance));
        let typeScore = 50;
        if (incidentSeverity === 'critical' || incidentSeverity === 'high') {
            if (resource.type === 'ambulance') typeScore = 100;
            else if (resource.type === 'first_aid_team') typeScore = 60;
        } else {
            if (resource.type === 'first_aid_team') typeScore = 80;
            else if (resource.type === 'ambulance') typeScore = 70;
        }
        const availabilityScore = resource.status === 'available' ? 100 : 50;
        const maxTime = 1800;
        const timeScore = Math.max(0, 100 * (1 - estimatedTime / maxTime));
        const priorityScore = distanceScore * 0.4 + typeScore * 0.3 + availabilityScore * 0.2 + timeScore * 0.1;

        return {
            resource,
            distance,
            estimatedTime,
            trafficPenalty,
            priorityScore,
            routePoints
        };
    }).filter(result => result !== null);

    scoredResources.sort((a, b) => b.priorityScore - a.priorityScore);
    return scoredResources;
}

module.exports = {
    findBestResource,
    getPrioritizedResources,
    calculateDistance,
    calculateTrafficPenalty,
    calculateEstimatedTime,
    generateRoutePoints
};
