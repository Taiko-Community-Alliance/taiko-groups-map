import L from 'leaflet';
import 'leaflet.sidepanel';
// See rollup-plugin-fetch-csv-json.js and fetch-csv-json.js
import points from 'TAIKO_GROUPS_DATA_CSV_URL';
import '@csstools/normalize.css/normalize.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet.sidepanel/dist/leaflet.sidepanel.css';
import './map-styles.css';
import { initializeTaikoMap } from './map';
import { createSideBar } from './sidebar';
import { reactive } from 'vue';

// Create map
const map = L.map('map').setView([37.7749, L.Util.wrapNum(-122.4194, [0,360], true)], 3); 

// Add a main tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// exclude points without latitude, longitude, or name
const rxPoints = reactive(points
	.filter(({latitude,longitude,name}) => latitude && longitude && name)
	.map((point, i) => ({
		...point,
		visible: true,
		active: false,
		index: i
	})));
	
// Create a map marker layer
const mapMarkerLayer = initializeTaikoMap(map, rxPoints);
map.addLayer(mapMarkerLayer);

// Side Panel Stuff

// Initialize the side panel
const sideBar = createSideBar(map, rxPoints);

mapMarkerLayer.addEventListener('visible-points', function({points, center}) {
	rxPoints.forEach(p => {
		p.visible = points.includes(p);
	});
	sideBar.center = center;
});

sideBar.$events.addEventListener('visit', (e) => {
	mapMarkerLayer.fire('center-point', {
		point: e.detail.point
	});
});

mapMarkerLayer.addEventListener('active-points', function({points}) {

	rxPoints.forEach(p => {
		p.active = points.includes(p);
	});

	const panel = document.getElementById('side-panel');
	if (!L.DomUtil.hasClass(panel, 'opened')) {
		L.DomUtil.addClass(panel, 'opened');
		L.DomUtil.removeClass(panel, 'closed');
	}
});