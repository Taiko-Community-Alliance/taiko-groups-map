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

//var myRepeatingMarkers = L.gridLayer.repeatedMarkers().addTo(map);
// function normalizeLongitudes(geojson) {
//   geojson.features.forEach(feature => {
//     const coords = feature.geometry.coordinates;

//     function fixCoordArray(arr) {
//       arr.forEach(pt => {
//         // Recursively handle nested arrays (MultiPolygons)
//         if (Array.isArray(pt[0])) {
//           fixCoordArray(pt);
//         } else {
//           // Normalize longitude: wrap from 0–360 to -180–180
//           pt[0] = L.Util.wrapNum(pt[0], [0,360], true);
//         }
//       });
//     }

//     fixCoordArray(coords);
//   });

//   return geojson;
// }

// const geojsonLayer = L.geoJSON(normalizeLongitudes(regionLayers), {
// 	style: feat => ({
// 		color:        feat.properties.stroke || '#555',
// 		weight:       0,//feat.properties['stroke-width'] || 2,
// 		opacity:      feat.properties['stroke-opacity'] ?? 1,
// 		fillColor:    feat.properties.fill || '#555',
// 		fillOpacity:  0.5,
// 		stroke: false,
// 	}),
// 	onEachFeature: (feat, layer) =>
// 		layer.bindPopup(`<strong>${feat.properties.name}</strong>`)
// }).addTo(map);

// map.fitBounds(geojsonLayer.getBounds());

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
	});
	sideBar.center = center;
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

sideBar.$events.addEventListener('visit', (e) => {
	map.setView([e.detail.point.latitude, e.detail.point.longitude], 10);
	allRegionLayers.fire('center-point', {
		point: e.detail.point
	});
});