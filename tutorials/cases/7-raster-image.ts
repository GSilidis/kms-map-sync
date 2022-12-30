/**
 * Usually, drone images are saved in GeoTIFF format and served through TMS. However, to showcase ability of
 * Maplibre GL to show raster layers from single picture we will use png file containing aerial photograph of
 * Hare Island, Saint-Petersburg
 */
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const map = new maplibregl.Map({
  container: 'map',
  style:
        'https://api.maptiler.com/maps/bright-v2/style.json?key=' + MAPTILER_KEY,
  center: [30.316386, 59.949939],
  zoom: 15,
  maxZoom: 18,
  attributionControl: false,
  maxBounds: [
    [30.307672, 59.946680],
    [30.323450, 59.953455],
  ],
});

map.on('load', function() {
  const rasterSourceID = 'raster-source';

  // Adding custom attribution because attribution field is unavailable for image source type
  map.addControl(new maplibregl.AttributionControl({
    customAttribution: '<a href="https://openaerialmap.org/about/">&copy; OpenAerialMap</a>',
    compact: false,
  }));

  // Setting up source with raster image and setup it's location
  map.addSource(rasterSourceID, {
    'type': 'image',
    'url': './public/Fort.png',
    'coordinates': [
      [30.308672, 59.952455],
      [30.323350, 59.952455],
      [30.323350, 59.947680],
      [30.308672, 59.947680],
    ],
  });

  // Add raster layer for raster source
  map.addLayer({
    'id': 'raster-image-layer',
    'source': rasterSourceID,
    'type': 'raster',
  }, 'road_network'); // Insert before all roads
});
