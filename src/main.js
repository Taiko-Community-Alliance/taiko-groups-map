import L from 'leaflet';
// See rollup-plugin-fetch-csv-json.js and fetch-csv-json.js
import points from 'TAIKO_GROUPS_DATA_CSV_URL';
import '@csstools/normalize.css/normalize.css';
import 'leaflet/dist/leaflet.css';
import './map-styles.css';
import { initializeTaikoMap } from './map';
import { createSideBar } from './sidebar';
import { reactive } from 'vue';
import { regionToInternalName } from './util';

// Create map
const map = L.map('map')
	// Initial view of the map
	.setView([
		37.7749,
		L.Util.wrapNum(-122.4194, [0,360], true)]
	, 3); // Zoom level 

// Add a main tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// 51 is a magic longitude for us to mark as the edge of our map
// Ideally we want all markers to repeat around the globe
// But until that's fixed, we want to make sure europe (around long 0)
// isn't broken up (causing user to pan all the way east and west to see groups in Europe)
const LONG_WRAP = [51,360+51];

// exclude points without latitude, longitude, or name
const rxPoints = reactive(points
	.filter(({latitude,longitude,name}) => latitude && longitude && name)
	.map((point, i) => ({
		...point,
		visible: true,
		active: false,
		index: i,
		longitude: L.Util.wrapNum(point.longitude, LONG_WRAP, true),
		regionInternalName: regionToInternalName(point.region),
	})));
	
// Create a map marker layer
const allRegionLayers = initializeTaikoMap(map, rxPoints);

// Side Panel Stuff

// Initialize the side panel
const sideBar = createSideBar(map, rxPoints);

allRegionLayers.addEventListener('visible-points', function({points, center}) {
	rxPoints.forEach(p => {
		p.visible = points.includes(p);
		// Force points that aren't visible to be inactive
		if(!p.visible) p.active = false;
	});
});

allRegionLayers.addEventListener('active-points', function({points}) {
	rxPoints.forEach(p => {
		p.active = points.includes(p);
	});

	const panel = document.getElementById('side-panel');
	if (!L.DomUtil.hasClass(panel, 'opened')) {
		L.DomUtil.addClass(panel, 'opened');
		L.DomUtil.removeClass(panel, 'closed');
	}
});

sideBar.$events.addEventListener('zoom-to-points', (e) => {
	allRegionLayers.fire('fit-bounds', {
		points: e.detail.points
	});
});

sideBar.$events.addEventListener('filter-points', (e) => {
	allRegionLayers.fire('filter-points', {
		points: e.detail.points
	});
});

sideBar.$events.addEventListener('visit', (e) => {
	allRegionLayers.fire('center-point', {
		point: e.detail.point
	});
});