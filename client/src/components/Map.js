import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../stylesheets/Map.css';

const Map = () => {
    useEffect(() => {
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
        zoom: 5,
        minZoom: 15,
        maxBounds: campusBounds,          
        maxBoundsViscosity: 1.0           
      });

      map.on('zoomend', function() {
        console.log("Current zoom level:", map.getZoom());
      });
  
      // Add OSM tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
  
    }, []);
  
    return (
      <div id="map" style={{ height: '100%', width: '100%' }}></div>
    );
  };
  
  export default Map;