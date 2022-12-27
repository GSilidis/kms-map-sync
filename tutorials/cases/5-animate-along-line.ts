import maplibregl from 'maplibre-gl';
import { lineString, along } from '@turf/turf';
import { CircleLayerSpecification, LngLatLike } from 'maplibre-gl/dist/style-spec';
import { GeoJSONSource } from 'maplibre-gl';
import { GeoJSON, Position } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';

import routeGeoJSON from '../../assets/route.json';

const startPoint = routeGeoJSON.features[0].geometry.coordinates[0] as LngLatLike;
const endPoint =
   routeGeoJSON.features[0].geometry.coordinates[routeGeoJSON.features[0].geometry.coordinates.length -1] as LngLatLike;
const turfLineString = lineString(routeGeoJSON.features[0].geometry.coordinates);

const getGeoJSONPoint = (pointCoords: Position): GeoJSON => ({
  type: 'Point',
  coordinates: pointCoords,
});

const map = new maplibregl.Map({
  container: 'map',
  style:
        'https://api.maptiler.com/maps/streets/style.json?key=' + MAPTILER_KEY,
  center: startPoint,
  zoom: 17,
});

map.on('load', () => {
  // Add source for object location
  map.addSource('location', {
    type: 'geojson',
    data: getGeoJSONPoint(startPoint as Position),
  });

  // Add layer to display location
  map.addLayer({
    id: 'location-layer',
    type: 'circle',
    source: 'location',
    paint: {
      'circle-radius': 7,
      'circle-color': '#007aff',
      'circle-stroke-width': 3,
      'circle-stroke-color': '#f2f2f7',
    },
  } as CircleLayerSpecification);

  const source = map.getSource('location') as GeoJSONSource;

  let distanceAlongRoute = 0;
  const animationTickTimeout = 50;

  setInterval(() => {
    // Calculate distance from start using elapsed time and approximate speed (54 km/h = 15 m/s)
    distanceAlongRoute += 15 / (1000 / animationTickTimeout);

    // Use 'along' to calculate point in specified distance from line start
    const currentPosition = along(turfLineString, distanceAlongRoute / 1000); // Convert meters to km
    const currentLngLat = currentPosition.geometry.coordinates;

    // Set new location in source
    source.setData({
      type: 'Point',
      coordinates: currentLngLat,
    });

    // And center map on current location
    map.setCenter(currentLngLat as LngLatLike);

    // If reached destination - reset timer and start again
    if (currentLngLat[0].toFixed(6) === (endPoint as Position)[0].toFixed(6) &&
            currentLngLat[1].toFixed(6) === (endPoint as Position)[1].toFixed(6)) {
      distanceAlongRoute = 0;
    }
  }, animationTickTimeout);
});

