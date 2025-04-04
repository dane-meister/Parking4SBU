import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../stylesheets/Map.css';


const Map = ({ selectedLot }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

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

    // // Initialize the map in the "map" div
    // const map = L.map('map', {
    // center: campusCenter,       // Set initial center of the map
    // zoom: 5,                    // Set initial zoom level
    // minZoom: 15,                // Set minimum zoom level
    // maxBounds: campusBounds,    // Restrict map panning to campus bounds
    // maxBoundsViscosity: 1.0     // Prevent panning outside bounds
    // });

    mapRef.current = L.map('map', {
      center: campusCenter,
      zoom: 5,
      minZoom: 15,
      maxBounds: campusBounds,
      maxBoundsViscosity: 1.0
    });

    // // Log the current zoom level whenever the zoom changes
    // map.on('zoomend', function() {
    // console.log("Current zoom level:", map.getZoom());
    // });

    mapRef.current.on('zoomend', function () {
      console.log("Current zoom level:", mapRef.current.getZoom());
    });


    //   // Add OpenStreetMap tile layer to the map
    //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; OpenStreetMap contributors' // Attribution for OSM
    //   }).addTo(map);

    // }, []); // Empty dependency array ensures this effect runs only once

    // Add OpenStreetMap tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current);
  }, []);

  const customIcon = L.icon({
    iconUrl: '/images/location-marker2.png',  
    iconSize: [30, 30],     
    iconAnchor: [12, 41],    // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34],   // Point from which the popup should open relative to the iconAnchor
  });



  useEffect(() => {
    const campusCenter = [40.911117, -73.122142];
    const defaultZoom = 15;

    // When selectedLot changes and has a valid location, pan and zoom
    if (selectedLot && selectedLot.location) {
      const originalCoords = selectedLot.location.coordinates[0];
      const coords = [originalCoords[1], originalCoords[0]];
      console.log("Extracted coords (lat, lng):", coords);
      if (mapRef.current) {
        mapRef.current.setView(coords, 18, { animate: true });
        // Remove previous marker if it exists
        if (markerRef.current) {
          markerRef.current.remove();
        }
        markerRef.current = L.marker(coords, { icon: customIcon }).addTo(mapRef.current);
      }
    } else {
      if (mapRef.current) {
        mapRef.current.setView(campusCenter, defaultZoom, { animate: true });
        if (markerRef.current) {
          markerRef.current.remove();
          markerRef.current = null;
        }
        console.log("Reset to campus center");
      }
    }
  }, [selectedLot]);


  // Render the map container
  return (
    <div id="map" style={{ height: '100%', width: '100%' }}></div>
  );
};

export default Map;