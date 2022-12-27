import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import * as L from 'leaflet';
import { LngLatLike } from 'maplibre-gl/dist/style-spec';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerCoords: number[] = [32.0945, 34.8630];

if (maplibregl.supported({ failIfMajorPerformanceCaveat: true })) {
  // Use MapLibre if its supported
  const lngLatMarker = [markerCoords[1], markerCoords[0]] as LngLatLike;

  const glMap = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets/style.json?key=' + MAPTILER_KEY,
    center: lngLatMarker,
    zoom: 13,
  });

  glMap.addControl(new maplibregl.NavigationControl({}));

  new maplibregl.Marker()
      .setLngLat(lngLatMarker)
      .addTo(glMap);
} else {
  // Ues leaflet fallback if not supported
  const leafletMap = L.map('map');

  leafletMap.setView(markerCoords as LatLngTuple, 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(leafletMap);

  L.circle(markerCoords as LatLngTuple, {
    color: 'blue',
    fillColor: 'lightblue',
    fillOpacity: 0.5,
    radius: 80,
  }).addTo(leafletMap);

  window.onload = () => {
    leafletMap.invalidateSize();
  };

  document.querySelector('.warning-div').classList.add('active');
}
