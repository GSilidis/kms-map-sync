/**
 * Most common use case for online maps is adding single point to an interactive map
 * In this tutorial we are comparing how to do this in GIS-specialist oriented OpenLayers and general public-oriented
 * Leaflet
 */
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngTuple } from 'leaflet';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import 'ol/ol.css';

const markerCoords: number[] = [32.0945, 34.8630];

// Leaflet

const leafletMap = L.map('map1');

leafletMap.setView(markerCoords as LatLngTuple, 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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

// OpenLayers

const mercatorMarkerCoords: Coordinate = fromLonLat([markerCoords[1], markerCoords[0]]);

const olMap = new Map({
  target: 'map2',
  layers: [
    new TileLayer({
      source: new XYZ({
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }),
    }),
  ],
  view: new View({
    center: mercatorMarkerCoords,
    zoom: 13,
  }),
});

const olMarkerLayer = new VectorLayer({
  source: new VectorSource({
    features: [
      new Feature({ geometry: new Point(mercatorMarkerCoords) }),
    ],
  }),
});

olMap.addLayer(olMarkerLayer);
