import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../stylesheets/Map.css';

const Map = () => {
  useEffect(() => {
    // Coordinates for the center of the campus
    const campusCenter = [40.911117, -73.122142]; 

    // Bounds for the campus area (southwest and northeast corners)
    const campusBounds = [
    [40.889973, -73.147639], // Southwest corner
    [40.927587, -73.095441]  // Northeast corner
    ];

    // Prevent initializing the map multiple times
    if (L.DomUtil.get('map')._leaflet_id) {
    return;
    }

    // Initialize the map in the "map" div
    const map = L.map('map', {
    center: campusCenter,       // Set initial center of the map
    zoom: 5,                    // Set initial zoom level
    minZoom: 15,                // Set minimum zoom level
    maxBounds: campusBounds,    // Restrict map panning to campus bounds
    maxBoundsViscosity: 1.0     // Prevent panning outside bounds
    });

    // Log the current zoom level whenever the zoom changes
    map.on('zoomend', function() {
    console.log("Current zoom level:", map.getZoom());
    });
  
    // Add OpenStreetMap tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors' // Attribution for OSM
    }).addTo(map);
  
  }, []); // Empty dependency array ensures this effect runs only once
  
  // Render the map container
  return (
    <div id="map" style={{ height: '100%', width: '100%' }}></div>
  );
  };
  
  export default Map;