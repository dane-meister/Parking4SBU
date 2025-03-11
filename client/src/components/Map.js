import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../stylesheets/Map.css';

const Map = () => {
    useEffect(() => {
      // Define campus center and bounds
      const campusCenter = [40.911117, -73.122142]; 
      const campusBounds = [
        [40.889973, -73.147639], // Southwest corner
        [40.927587, -73.095441]  // Northeast corner
      ];

      if (L.DomUtil.get('map')._leaflet_id) {
        return;
      }
  
      // Initialize the map in the "map" div
      const map = L.map('map', {
        center: campusCenter,
        zoom: 20,
        minZoom: 16,
        maxBounds: campusBounds,         // Restrict the map's view to these bounds
        maxBoundsViscosity: 1.0            // Fully restrict panning outside bounds
      });

      map.on('zoomend', function() {
        console.log("Current zoom level:", map.getZoom());
      });
  
      // Add OSM tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
  
      // Optionally, add a marker at the campus center
      // L.marker(campusCenter).addTo(map);
    }, []);
  
    return (
      <div id="map" style={{ height: '100%', width: '100%' }}></div>
    );
  };
  
  export default Map;