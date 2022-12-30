/**
 * This tutorial shows interaction with map objects. Here, we are querying all buildings under the mouse cursor and
 * adding this buildings to another layer with different styling
 */
import maplibregl from 'maplibre-gl';
import { GeoJSONSource } from 'maplibre-gl';
import { GeoJSON, Feature } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';

const map = new maplibregl.Map({
  container: 'map',
  style:
        'https://api.maptiler.com/maps/basic/style.json?key=' + MAPTILER_KEY,
  center: [-0.1258, 51.5066],
  pitch: 45,
  zoom: 15,
});

const getGeoJsonWithFeatures = (features: Feature[]): GeoJSON => {
  return {
    type: 'FeatureCollection',
    features,
  };
};

map.on('load', function() {
  const highlightSourceID = 'highlight-buildings';

  // Setting up empty source
  map.addSource(highlightSourceID, {
    type: 'geojson',
    data: getGeoJsonWithFeatures([]),
  });

  // Add styling
  map.addLayer({
    'id': 'highlight-buildings-layer',
    'source': highlightSourceID,
    'type': 'fill-extrusion',
    'paint': {
      'fill-extrusion-color': 'blue', // Color of highlighted building
      'fill-extrusion-height': {
        'type': 'identity',
        'property': 'render_height', // Field containing height of object in floors
      },
      'fill-extrusion-base': {
        'type': 'identity',
        'property': 'render_min_height', // Field containing height in floors from first floor to ground level
      },
      'fill-extrusion-opacity': .8, // Opacity of highlighted building
    },
  });

  map.on('mousemove', function(e) {
    // On mouse move - query features under cursor
    const features = map.queryRenderedFeatures(e.point, { layers: ['building'] });
    const highlightSource = map.getSource(highlightSourceID) as GeoJSONSource;

    if (features.length) {
      // If features in building layers found - set first building as data
      highlightSource.setData(getGeoJsonWithFeatures([features[0]]));
    } else {
      // Clear source otherwise
      highlightSource.setData(getGeoJsonWithFeatures([]));
    }
  });
});
