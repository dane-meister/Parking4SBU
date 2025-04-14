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
      [40.889973, -73.147639], //s-w corner
      [40.927587, -73.095441]  //n-e corner
    ];

    //prevent initialising the map multiple times
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

    mapRef.current.on('zoomend', function () {
      console.log("Current zoom level:", mapRef.current.getZoom());
    });

    //add OpenStreetMap tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current);
  }, []);

  const lotIcon = L.icon({
    iconUrl: '/images/lot-marker.png',  
    iconSize: [30, 30],     
    iconAnchor: [12, 41],    //point of the icon which will correspond to marker's location
    popupAnchor: [1, -34],   //point from which the popup should open relative to the iconAnchor
  });

  const buildingIcon = L.icon({
    iconUrl: '/images/building-marker.png', 
    iconSize: [30, 30],      
    iconAnchor: [12, 41],    
    popupAnchor: [1, -34]
  });



  useEffect(() => {
    const campusCenter = [40.911117, -73.122142];
    const defaultZoom = 15;

    //pan and zoom when lot is selected
    if (selectedLot && selectedLot.location) {
      const originalCoords = selectedLot.location.coordinates[0];
      const coords = [originalCoords[1], originalCoords[0]];
      console.log("Extracted coords (lat, lng):", coords);
      if (mapRef.current) {
        mapRef.current.setView(coords, 18, { animate: true });
        // Remove previous marker if it exists
        if (lotMarkerRef.current) {
          lotMarkerRef.current.remove();
        }
        lotMarkerRef.current = L.marker(coords, { icon: lotIcon }).addTo(mapRef.current);
      }
    } else {
      if (mapRef.current) {
        mapRef.current.setView(campusCenter, defaultZoom, { animate: true });
        if (lotMarkerRef.current) {
          lotMarkerRef.current.remove();
          lotMarkerRef.current = null;
        }
        console.log("Reset to campus center");
      }
    }
  }, [selectedLot]);


  useEffect(() => {
    if (selectedBuilding && selectedBuilding.location) {
      const coords = selectedBuilding.location.coordinates[0];
      // const coords = [originalCoords[1], originalCoords[0]];
      console.log("Building marker at:", coords);
      if (mapRef.current) {
        //pan the map if no lot is selected
        if (!selectedLot) {
          mapRef.current.setView(coords, 18, { animate: true });
        }
        if (buildingMarkerRef.current) {
          buildingMarkerRef.current.remove();
        }
        buildingMarkerRef.current = L.marker(coords, { icon: buildingIcon }).addTo(mapRef.current);
      }
    } else {
      console.log("no building selected");
      if (buildingMarkerRef.current) {
        buildingMarkerRef.current.remove();
        buildingMarkerRef.current = null;
      }
    }
  }, [selectedBuilding, selectedLot]);



  //render the map container
  return (
    <div id="map" style={{ height: '100%', width: '100%' }}></div>
  );
};

export default Map;