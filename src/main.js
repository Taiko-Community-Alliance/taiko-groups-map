import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.sidepanel';
// See rollup-plugin-fetch-csv-json.js and fetch-csv-json.js
import points from 'TAIKO_GROUPS_DATA_CSV_URL';
import '@csstools/normalize.css/normalize.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
// import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.sidepanel/dist/leaflet.sidepanel.css';
import './map-styles.css';

var map = L.map('map').setView([37.7749, L.Util.wrapNum(-122.4194, [0,360], true)], 3); 

//var myRepeatingMarkers = L.gridLayer.repeatedMarkers().addTo(map);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.jpg', {
// 	minZoom: 1,
// 	maxZoom: 16,
// 	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// 	ext: 'jpg'
// }).addTo(map);

const markerPointMap = new Map();

// // Initialize the marker cluster group
const markers = L.markerClusterGroup({
  maxClusterRadius: 15,
	spiderfyOnMaxZoom: false,
	showCoverageOnHover: false,
	zoomToBoundsOnClick: false,
	spiderLegPolylineOptions: {
		color: '#222',
		weight: 0,
		opacity: 0,
	},
	spiderfyDistanceMultiplier: 0.01,
	iconCreateFunction: function(cluster) {
		const markers = cluster.getAllChildMarkers();
		const cities = Array.from(new Set(markers.map(m => markerPointMap.get(m)?.city).filter(Boolean)));
		const states = Array.from(new Set(markers.map(m => markerPointMap.get(m)?.state).filter(Boolean)));
		cluster.cities = cities;
		cluster.states = states;
		var childCount = cluster.getChildCount();

		return L.divIcon({
			className: 'marker-cluster-basic',
			html: `
				<div style="position: relative; text-align: center;">
					<img src="images/marker-mitsu-icon-cluster-2x.png" class="" title="${cities}" alt="Marker" tabindex="0" style="width: 25px; height: 41px;">
					<div class="marker-cluster-count-text">
						${childCount}
					</div>
				</div>
			`,
			iconSize: [25, 41], // size of the original marker image
			iconAnchor: [12, 41], // anchor the bottom point of the icon to the coordinates

			tooltipAnchor: [20, 0],
			shadowUrl: 'images/marker-shadow.png',
			shadowSize: [41, 41],
			shadowAnchor: [13, 40]
		});
	}
});

const validPoints = points.filter(({latitude,longitude,name}) => latitude && longitude && name);

// generates an html description for a point, which possibly includes a website
function getDescription(point) {
  var description = `<h3>${point.name}</h3><p>${[point.city, point.state, point.country].filter(Boolean).join(', ')}</p>`;
  if (point.website) {
    description += `<a href="${point.website}" target="_blank">${point.website}</a>`;
  }
  description += `</p>`;
  return description;
}

const mitsuIcon = L.icon({
    iconUrl: 'images/marker-mitsu-icon-simple-2x.png',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    tooltipAnchor: [20, 0],
    // shadowUrl: 'images/marker-shadow.png',
    // shadowSize: [41, 41],
    // shadowAnchor: [13, 40]
});

validPoints.forEach(function(point) {
	var marker = L.marker([
		point.latitude,
		L.Util.wrapNum(point.longitude, [0,360], true)
	], {
		title: point.name,
		icon: mitsuIcon
	}).bindTooltip(point.name);
	markerPointMap.set(marker, point);
	marker.on('click', function() {
		document.getElementById('tab1-content').innerHTML = getDescription(point);
		openSidepanel();
	});
	markers.addLayer(marker);
});

// // Add the marker cluster group to the map
map.addLayer(markers);

// Initialize the side panel
const sidepanel = L.control.sidepanel('panelID', {
	panelPosition: 'left',
	startTab: 'tab-1'
}).addTo(map);

function openSidepanel() {
	const panel = document.getElementById('panelID');
	if (!L.DomUtil.hasClass(panel, 'opened')) {
		L.DomUtil.addClass(panel, 'opened');
		L.DomUtil.removeClass(panel, 'closed');
	}
}

// Handle cluster click event to show combined content in sidepanel
markers.on('clusterclick', function (e) {
	e.sourceTarget.spiderfy();
  const content = e.sourceTarget.getAllChildMarkers().map(m => {

    const point = markerPointMap.get(m);
    const description = point ? getDescription(point) : '';
    return description;
  }).join('');
  document.getElementById('tab1-content').innerHTML = content;
  openSidepanel();
});

// Add tooltips to clusters
markers.on('clustermouseover', function (e) {

	let cities = e.sourceTarget.cities;
	let toolTipDescription = cities.slice(0, 3).join(', ');
	if (cities.length > 3) {
		toolTipDescription += ', ...';
	}
	if(e.sourceTarget.states.length == 1) {
		toolTipDescription += ` ${e.sourceTarget.states[0]}`;
	}
	e.sourceTarget.bindTooltip(`<i>${toolTipDescription}</i>`, {offset: [20,0]}).openTooltip();
});