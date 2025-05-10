import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../stylesheets/Map.css';


const Map = ({ selectedLot, selectedBuilding }) => {
  const mapRef = useRef(null);
  const lotMarkerRef = useRef(null);
  const buildingMarkerRef = useRef(null);

  useEffect(() => {
    //center of the campus
    const campusCenter = [40.911117, -73.122142];
    

    //bounds for the campus area 
    const campusBounds = [
      [40.889973, -73.147639], // s-w corner
      [40.927587, -73.095441]  // n-e corner
    ];

    // prevent initializing the map multiple times
    if (L.DomUtil.get('map')._leaflet_id) {
      return;
    }

    mapRef.current = L.map('map', {
      center: campusCenter,
      zoom: 5,
      minZoom: 15,
      maxBounds: campusBounds,
      maxBoundsViscosity: 1.0
    });

    // add OpenStreetMap tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current);
  }, []);

  const lotIcon = L.icon({
    iconUrl: '/images/lot-marker.png',  
    iconSize: [30, 30],     
    iconAnchor: [12, 41],    // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34],   // point from which the popup should open relative to the iconAnchor
  });

  const buildingIcon = L.icon({
    iconUrl: '/images/building-marker.png', 
    iconSize: [30, 30],      
    iconAnchor: [12, 41],    
    popupAnchor: [1, -34]
  });

  useEffect(() => {
    // center of the campus
    const campusCenter = [40.911117, -73.122142];
    const defaultZoom = 15;
  
    if (selectedLot && selectedLot.location) {
      const coordinates = selectedLot.location.coordinates;
      if (!coordinates || coordinates.length === 0) return;
      let coord;
      if (selectedLot.closest_point) {
        coord = [selectedLot.closest_point[0], selectedLot.closest_point[1]]; // lat, lng
      } else if (coordinates.length > 0) {
        coord = [coordinates[0][0], coordinates[0][1]]; // fallback
      }
      if (mapRef.current) {
        mapRef.current.setView(coord, 18, { animate: true });
        if (lotMarkerRef.current) {
          lotMarkerRef.current.remove();
        }
        lotMarkerRef.current = L.marker(coord, { icon: lotIcon }).addTo(mapRef.current);
      }
    } else {
      if (mapRef.current) {
        mapRef.current.setView(campusCenter, defaultZoom, { animate: true });
        if (lotMarkerRef.current) {
          lotMarkerRef.current.remove();
          lotMarkerRef.current = null;
        }
      }
    }
  }, [lotIcon, selectedBuilding, selectedLot]);

  useEffect(() => {
    if (selectedBuilding && selectedBuilding.location) {
      const coords = selectedBuilding.location.coordinates[0];
      if (mapRef.current) {
        // pan the map if no lot is selected
        if (!selectedLot) {
          mapRef.current.setView(coords, 18, { animate: true });
        }
        if (buildingMarkerRef.current) {
          buildingMarkerRef.current.remove();
        }
        buildingMarkerRef.current = L.marker(coords, { icon: buildingIcon }).addTo(mapRef.current);
      }
    } 
    else if (buildingMarkerRef.current) {
        buildingMarkerRef.current.remove();
        buildingMarkerRef.current = null;
    }
  }, [buildingIcon, selectedBuilding, selectedLot]);



  // render the map container
  return (
    <div id="map" style={{ height: '100%', width: '100%' }}></div>
  );
};

export default Map;