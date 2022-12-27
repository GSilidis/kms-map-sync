import maplibregl from 'maplibre-gl';
import geojsonExtent from '@mapbox/geojson-extent';
import { LngLatBoundsLike } from 'maplibre-gl/dist/style-spec';
import { GeoJSON } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';

import trafficDataJSON from '../../assets/Accident_Locations.json';

const map = new maplibregl.Map({
  container: 'map',
  style:
        'https://api.maptiler.com/maps/toner-v2/style.json?key=' + MAPTILER_KEY,
  center: [-98.4155, 33.1559],
  zoom: 2,
  maxZoom: 17,
  maxPitch: 0,
  dragRotate: false,
});

map.addControl(new maplibregl.NavigationControl({ showCompass: false }));
map.addControl(new maplibregl.FullscreenControl({}));

map.on('load', function() {
  // Add geojson source with car accidents
  map.addSource('accidents', {
    'type': 'geojson',
    'data': trafficDataJSON,
    'attribution': '<a href="https://mapaspen-cityofaspen.opendata.arcgis.com/">&copy; City of Aspen GIS</a>',
  });

  // Fit map bounds to geojson
  map.fitBounds(geojsonExtent(trafficDataJSON as GeoJSON).slice(0, 4) as LngLatBoundsLike);

  // Add heatmap layer styling
  map.addLayer(
      {
        'id': 'accidents-layer',
        'type': 'heatmap',
        'source': 'accidents',
        'maxzoom': 18,
        'paint': {
          // Use for numeric values in your data. How heatmap map should change, depending on value in that field
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'Count_'],
            0,
            0,
            6,
            1,
          ],

          // Intensity of heatmap colors
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            1,
            9,
            3,
          ],

          // Colors for different points density and intensity
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(0,0,0,0)',
            0.2,
            'rgb(18,77,104)',
            0.4,
            'rgb(66,105,134)',
            0.6,
            'rgb(252,176,118)',
            0.8,
            'rgb(243,115,66)',
            1,
            'rgb(246,50,79)',
          ],

          // Radius of single point, depending on zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            9,
            2,
            13,
            5,
            18,
            13,
          ],

          // Opacity of heatmap layer
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            0,
            14,
            1,
          ],
        },
      },
      // Insert before all labels in style
      'water_way',
  );
});
