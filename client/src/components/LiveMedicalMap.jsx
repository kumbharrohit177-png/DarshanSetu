import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Ambulance, Activity, MapPin } from 'lucide-react';
import 'leaflet.heat'; // Import heatmap plugin
import socket from '../utils/socket';

// Fix for default Leaflet icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons for different resources
const ambulanceIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2618/2618585.png', // Placeholder URL - ideally use local assets or SVGs converted to Data URI
    iconSize: [35, 35],
    iconAnchor: [17, 17],
    popupAnchor: [0, -10]
});

const incidentIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/564/564619.png', // Alert icon placeholder
    iconSize: [35, 35],
    iconAnchor: [17, 17],
    popupAnchor: [0, -10],
    className: 'animate-pulse'
});

const teamIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png', // Medical Team placeholder
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -10]
});

// Component to auto-center map
const MapAutoFit = ({ resources, incidents }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const points = [];

        // Collect all resource locations
        resources.forEach(r => {
            if (r.location && r.location.lat) points.push([r.location.lat, r.location.lng]);
        });

        // Collect all incident locations
        incidents.forEach(i => {
            // ... extraction logic same as render ...
            let pos = null;
            const gpsMatch = i.location?.match(/GPS: ([0-9.-]+),\s*([0-9.-]+)/);
            if (gpsMatch) {
                pos = [parseFloat(gpsMatch[1]), parseFloat(gpsMatch[2])];
            } else if (i.location?.match(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/)) {
                const parts = i.location.split(',');
                pos = [parseFloat(parts[0]), parseFloat(parts[1])];
            } else {
                // fallback from ID
                const idSum = i._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                pos = [18.12 + ((idSum % 100) / 10000) * (idSum % 2 === 0 ? 1 : -1), 73.12 + ((idSum % 50) / 5000) * (idSum % 3 === 0 ? 1 : -1)];
            }
            if (pos) points.push(pos);
        });

        if (points.length > 0) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18, animate: true });
        }
    }, [resources, incidents, map]);

    return null;
};

const LiveMedicalMap = ({ resources, incidents, pilgrims, onDispatch }) => {
    // Default Center (Fallback)
    const defaultCenter = [18.12, 73.12];

    const pilgrimIcon = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', // User/Person Icon
        iconSize: [25, 25],
        iconAnchor: [12, 12],
        popupAnchor: [0, -10],
        className: 'pilgrim-marker-icon drop-shadow-md' // Standard shadow
    });

    const HeatmapLayer = ({ points }) => {
        const map = useMap();

        useEffect(() => {
            if (!points || points.length === 0) return;

            // Format: [lat, lng, intensity]
            const heatPoints = points.map(p => [p.lat, p.lng, p.intensity || 0.5]);

            const heat = L.heatLayer(heatPoints, {
                radius: 25,
                blur: 15,
                maxZoom: 17,
                gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
            }).addTo(map);

            return () => {
                map.removeLayer(heat);
            };
        }, [points, map]);

        return null;
    };

    // GENERATE DUMMY HEATMAP DATA FOR DEMO
    // Creates a cloud of points around the center to simulate specific high-density zones
    const generateHeatmapData = () => {
        const baseLat = 18.12;
        const baseLng = 73.12;
        const points = [];

        // Zone A: Temple Entrance (High Density)
        for (let i = 0; i < 40; i++) {
            points.push({
                lat: baseLat + (Math.random() * 0.002 - 0.001),
                lng: baseLng + (Math.random() * 0.002 - 0.001),
                intensity: 0.8
            });
        }

        // Zone B: Queue Complex (Medium Density)
        for (let i = 0; i < 30; i++) {
            points.push({
                lat: baseLat + 0.003 + (Math.random() * 0.003 - 0.0015),
                lng: baseLng + 0.003 + (Math.random() * 0.003 - 0.0015),
                intensity: 0.5
            });
        }

        // Add real pilgrims to heatmap
        if (pilgrims) {
            pilgrims.forEach(p => {
                points.push({ lat: p.lat, lng: p.lng, intensity: 1.0 });
            });
        }

        return points;
    };

    const heatmapPoints = generateHeatmapData();

    // Simulation State
    const [activeResources, setActiveResources] = useState([]);

    // Initialize with dummy data if needed + sync with props
    useEffect(() => {
        if (resources && resources.length > 0) {
            setActiveResources(resources);
        } else {
            // Generate Dummy Simulation Data if no backend data
            const dummyResources = [
                { _id: 'sim-1', name: 'Ambulance A-1', type: 'ambulance', status: 'available', location: { lat: 18.121, lng: 73.121 }, contactNumber: '102' },
                { _id: 'sim-2', name: 'Ambulance A-2', type: 'ambulance', status: 'busy', location: { lat: 18.118, lng: 73.124 }, contactNumber: '102' },
                { _id: 'sim-3', name: 'Med Team Alpha', type: 'first_aid_team', status: 'available', location: { lat: 18.122, lng: 73.119 }, contactNumber: 'Internal' },
                { _id: 'sim-4', name: 'Med Team Bravo', type: 'first_aid_team', status: 'available', location: { lat: 18.119, lng: 73.122 }, contactNumber: 'Internal' },
                { _id: 'sim-5', name: 'Booth Main', type: 'medical_booth', status: 'available', location: { lat: 18.1205, lng: 73.1205 }, contactNumber: 'Security' }
            ];

            // Generate Simulated Pilgrims for Map Activity
            const simPilgrims = Array.from({ length: 15 }).map((_, i) => ({
                _id: `pilgrim-sim-${i}`,
                name: `Pilgrim ${i + 1}`,
                type: 'pilgrim_sim',
                location: {
                    lat: 18.12 + (Math.random() * 0.006 - 0.003),
                    lng: 73.12 + (Math.random() * 0.006 - 0.003)
                }
            }));

            setActiveResources([...dummyResources, ...simPilgrims]);
        }
    }, [resources]);

    // Listen for real-time location updates
    useEffect(() => {
        socket.on('medical-resource-location-update', (data) => {
            setActiveResources(prev => prev.map(res =>
                res._id === data.resourceId
                    ? { ...res, location: data.location }
                    : res
            ));
        });

        socket.on('medical-resource-update', (updatedResource) => {
            setActiveResources(prev => prev.map(res =>
                res._id === updatedResource._id
                    ? updatedResource
                    : res
            ));
        });

        return () => {
            socket.off('medical-resource-location-update');
            socket.off('medical-resource-update');
        };
    }, []);

    // Animation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveResources(prev => prev.map(res => {
                // Random walk logic: Move slightly
                const latDelta = (Math.random() - 0.5) * 0.0004; // Small step
                const lngDelta = (Math.random() - 0.5) * 0.0004;

                // Keep somewhat bounds-checked or just random walk
                return {
                    ...res,
                    location: {
                        lat: res.location.lat + latDelta,
                        lng: res.location.lng + lngDelta
                    }
                };
            }));
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, []);


    return (
        <div className="h-full w-full rounded-xl overflow-hidden shadow-inner border border-gray-400 z-0 relative bg-white">
            <MapContainer center={defaultCenter} zoom={16} scrollWheelZoom={true} style={{ height: "100%", width: "100%", background: '#f8f9fa' }}>
                {/* Realism: Standard Street View (Google-like Layout) */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <HeatmapLayer points={heatmapPoints} />

                {/* Animated Resources */}
                {activeResources.map((res) => {
                    if (!res.location || !res.location.lat) return null;
                    let iconToUse = res.type === 'ambulance' ? ambulanceIcon :
                        res.type === 'medical_booth' ? teamIcon : teamIcon;

                    // Draw route if resource has a current route
                    const hasRoute = res.currentRoute && res.currentRoute.routePoints && res.currentRoute.routePoints.length > 0;
                    const routePoints = hasRoute ? res.currentRoute.routePoints.map(p => [p.lat, p.lng]) : null;

                    return (
                        <React.Fragment key={res._id}>
                            <Marker position={[res.location.lat, res.location.lng]} icon={iconToUse}>
                                <Popup>
                                    <div className="text-center min-w-[180px]">
                                        <h3 className="font-bold text-gray-800">{res.name}</h3>
                                        <p className="text-xs uppercase font-bold text-gray-500">{res.type.replace('_', ' ')}</p>
                                        <div className={`mt-1 px-2 py-1 rounded text-xs font-bold text-white ${res.status === 'available' ? 'bg-green-600' :
                                            res.status === 'en_route' ? 'bg-yellow-600' :
                                                'bg-red-600'
                                            }`}>
                                            {res.status.toUpperCase().replace('_', ' ')}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{res.contactNumber}</p>
                                        {res.location?.zone && (
                                            <p className="text-xs text-gray-400 mt-1">📍 {res.location.zone}</p>
                                        )}
                                        {res.currentRoute && res.currentRoute.estimatedArrival && (
                                            <p className="text-xs text-blue-600 mt-1">
                                                ETA: {new Date(res.currentRoute.estimatedArrival).toLocaleTimeString()}
                                            </p>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                            {hasRoute && routePoints && (
                                <Polyline
                                    positions={routePoints}
                                    color="#2563eb" // Blue-600 for standard map visibility
                                    weight={5}
                                    opacity={0.8}
                                    dashArray="5, 8"
                                />
                            )}
                        </React.Fragment>
                    );
                })}

                {/* Pilgrims (Real + Simulated) */}
                {(pilgrims && pilgrims.length > 0 ? pilgrims : activeResources.filter(r => r.type === 'pilgrim_sim')).map((p) => (
                    <Marker key={p.userId || p._id} position={[p.lat || p.location.lat, p.lng || p.location.lng]} icon={pilgrimIcon}>
                        <Popup>
                            <div className="text-center">
                                <h3 className="font-bold text-gray-800 text-xs">Pilgrim: {p.name}</h3>
                                <p className="text-[10px] text-gray-500">Live Location</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Incidents & Dispatch Lines */}
                {incidents.map((incident) => {
                    let pos = null;
                    const gpsMatch = incident.location?.match(/GPS: ([0-9.-]+),\s*([0-9.-]+)/);
                    if (gpsMatch) {
                        pos = [parseFloat(gpsMatch[1]), parseFloat(gpsMatch[2])];
                    } else if (incident.location?.match(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/)) {
                        const parts = incident.location.split(',');
                        pos = [parseFloat(parts[0]), parseFloat(parts[1])];
                    } else {
                        // Fallback position logic (deterministic based on ID for stability)
                        const idSum = incident._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        pos = [
                            18.12 + ((idSum % 100) / 10000) * (idSum % 2 === 0 ? 1 : -1),
                            73.12 + ((idSum % 50) / 5000) * (idSum % 3 === 0 ? 1 : -1)
                        ];
                    }

                    // Check for assigned resources to draw lines
                    const assignedResourceIds = incident.assignedResources || [];

                    return (
                        <React.Fragment key={incident._id}>
                            <Marker position={pos} icon={incidentIcon}>
                                <Popup>
                                    <div className="text-center min-w-[150px]">
                                        <h3 className="font-bold text-red-600">INCIDENT</h3>
                                        <p className="text-sm font-semibold mb-1">{incident.type.toUpperCase()}</p>
                                        <p className="text-xs text-gray-600 mb-2">{incident.description}</p>

                                        {incident.status === 'open' && (
                                            <button
                                                onClick={() => onDispatch(incident)}
                                                className="w-full bg-blue-600 text-white text-xs font-bold py-1 px-2 rounded hover:bg-blue-700 transition-colors"
                                            >
                                                DISPATCH UNIT
                                            </button>
                                        )}
                                        {incident.status === 'investigating' && (
                                            <div className="text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 rounded px-1 py-0.5">
                                                RESPONSE EN ROUTE
                                            </div>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>

                            {/* Draw Lines to Assigned Resources */}
                            {assignedResourceIds.map(resId => {
                                // In a real app, assignedResources would be populated. 
                                // Depending on backend, it might be an ID or object.
                                // If object: use resId.location
                                // If ID: look up in 'resources' prop.
                                const resource = typeof resId === 'object' ? resId : resources.find(r => r._id === resId);

                                if (resource && resource.location) {
                                    return (
                                        <Polyline
                                            key={`line-${incident._id}-${resource._id}`}
                                            positions={[pos, [resource.location.lat, resource.location.lng]]}
                                            color="#ef4444" // Red-500
                                            dashArray="10, 10"
                                            weight={3}
                                            className="animate-pulse-slow"
                                        />
                                    );
                                }
                                return null;
                            })}
                        </React.Fragment>
                    );
                })}
            </MapContainer>

            <div className="absolute top-2 right-2 z-[400] bg-white/90 backdrop-blur text-gray-800 p-2 rounded shadow-lg text-xs border border-gray-200">
                <div className="font-bold text-gray-700 mb-2 text-[10px] uppercase tracking-wider">Legend</div>
                <div className="flex items-center gap-2 mb-1"><img src="https://cdn-icons-png.flaticon.com/512/2618/2618585.png" width="16" /> Ambulance</div>
                <div className="flex items-center gap-2 mb-1"><img src="https://cdn-icons-png.flaticon.com/512/564/564619.png" width="16" /> Incident</div>
                <div className="flex items-center gap-2 mb-1"><img src="https://cdn-icons-png.flaticon.com/512/3063/3063176.png" width="16" /> Medical Team/Booth</div>
                <div className="flex items-center gap-2 mb-1"><img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" width="16" /> Pilgrim</div>
                <div className="flex items-center gap-2 text-blue-500 font-bold mb-1">
                    <span className="w-4 h-0.5 bg-blue-400 border border-blue-400 border-dashed block"></span> Active Route
                </div>
                <div className="flex items-center gap-2 text-red-500 font-bold">
                    <span className="w-4 h-0.5 bg-red-400 border border-red-400 border-dashed block"></span> Dispatch Line
                </div>
            </div>
        </div>
    );
};

export default LiveMedicalMap;
