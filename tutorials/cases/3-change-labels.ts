/**
 * Vector maps allows us to change map styling on-the-fly and manipulate style properties without reloading.
 * To show case that - we will change countries layer expressions to change language of labels or hide
 * labels entirely
 */
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const map = new maplibregl.Map({
  container: 'map',
  style:
        'https://api.maptiler.com/maps/basic/style.json?key=' + MAPTILER_KEY,
  center: [10.0, 50.0],
  zoom: 1,
  interactive: false,
});

let isVisible = true;
const toggleLayer = () => {
  isVisible = !isVisible;
  map.setLayoutProperty('label_country', 'visibility', isVisible ? 'visible' : 'none');
};

const setLanguage = (languageCode: string) => {
  map.setLayoutProperty('label_country', 'text-field', [
    'format',
    ['get', 'name:' + languageCode],
  ]);
};


map.on('load', function() {
  ['en', 'he', 'ja'].forEach((lang) => {
    (document.querySelector(`.${lang}-button`) as HTMLButtonElement).onclick = () => {
      setLanguage(lang);
    };
  });

  (document.querySelector('.toggle-button') as HTMLButtonElement).onclick = () => {
    toggleLayer();
  };
});
