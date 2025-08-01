import L from 'leaflet';
import 'leaflet.sidepanel';
// See rollup-plugin-fetch-csv-json.js and fetch-csv-json.js
import points from 'TAIKO_GROUPS_DATA_CSV_URL';
import '@csstools/normalize.css/normalize.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet.sidepanel/dist/leaflet.sidepanel.css';
import './map-styles.css';
import { initializeTaikoMap } from './map';

// Create map
const map = L.map('map').setView([37.7749, L.Util.wrapNum(-122.4194, [0,360], true)], 3); 

// Add a main tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// exclude points without latitude, longitude, or name
const validPoints = points.filter(({latitude,longitude,name}) => latitude && longitude && name);
const mapMarkerLayer = initializeTaikoMap(map, validPoints);
map.addLayer(mapMarkerLayer);

// Side Panel Stuff

// Initialize the side panel
const sidepanel = L.control.sidepanel('panelID', {
	panelPosition: 'left',
	startTab: 'tab-1'
}).addTo(map);

mapMarkerLayer.addEventListener('openSidepanel', function({content}) {
	document.getElementById('tab1-content').innerHTML = content;
	const panel = document.getElementById('panelID');
	if (!L.DomUtil.hasClass(panel, 'opened')) {
		L.DomUtil.addClass(panel, 'opened');
		L.DomUtil.removeClass(panel, 'closed');
	}
});