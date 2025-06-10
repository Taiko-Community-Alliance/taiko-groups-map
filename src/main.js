import L from 'leaflet';
import 'leaflet.markercluster';
import points from './data.json';
import '@csstools/normalize.css/normalize.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './map-styles.css';

var map = L.map('map').setView([37.7749, L.Util.wrapNum(-122.4194, [0,360], true)], 4); 

//var myRepeatingMarkers = L.gridLayer.repeatedMarkers().addTo(map);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// // Initialize the marker cluster group
const markers = L.markerClusterGroup({
  maxClusterRadius: 30,
	spiderfyOnMaxZoom: false,
	showCoverageOnHover: false,
	zoomToBoundsOnClick: false
});

const validPoints = points.filter(({lat,lon,name}) => lat && lon && name);


// generates an html description for a point, which possibly includes a website
function getDescription(point) {
  var description = `<h3>${point.name}</h3><p>${point.city}, ${point.country}`;
  if (point.website) {
    description += ` - <a href="${point.website}" target="_blank">Website</a>`;
  }
  description += `</p>`;
  return description;
}

validPoints.forEach(function(point) {
	var marker = L.marker([point.lat, L.Util.wrapNum(point.lon, [0,360], true)], {title: point.name}).bindTooltip(point.name);
  // @TODO
	// marker.on('click', function() {
	// 	document.getElementById('tab1-content').innerHTML = getDescription(point);
	// 	openSidepanel();
	// });
	markers.addLayer(marker);
});

// // Add the marker cluster group to the map
map.addLayer(markers);

// @TODO
// // Initialize the side panel
// const sidepanel = L.control.sidepanel('panelID', {
// 	panelPosition: 'left',
// 	startTab: 'tab-1'
// }).addTo(map);

// function openSidepanel() {
// 	const panel = document.getElementById('panelID');
// 	if (!L.DomUtil.hasClass(panel, 'opened')) {
// 		L.DomUtil.addClass(panel, 'opened');
// 		L.DomUtil.removeClass(panel, 'closed');
// 	}
// }

// // Handle cluster click event to show combined content in sidepanel
// markers.on('clusterclick', function (a) {
//   const content = a.layer.getAllChildMarkers().map(m => {
//     const point = validPoints.find(p => p.name === m.options.title);
//     const description = point ? getDescription(point) : '';
//     return description;
//   }).join('');
//   document.getElementById('tab1-content').innerHTML = content;
//   openSidepanel();
// });

// // Add tooltips to clusters
// markers.on('clustermouseover', function (a) {
// 	a.layer.bindTooltip(`${a.layer.getChildCount()} groups`).openTooltip();
// });