import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';

function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

export const initializeTaikoMap = (map, points) => {
  const markerPointMap = new Map();
  const pointmarkerMap = new Map();
  
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

        tooltipAnchor: [20, 50],
        shadowUrl: 'images/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [13, 40]
      });
    }
  });

  const mitsuIcon = L.icon({
      iconUrl: 'images/marker-mitsu-icon-simple-2x.png',
      iconSize: [25, 25],
      iconAnchor: [12, 12],
      tooltipAnchor: [20, 0],
      // shadowUrl: 'images/marker-shadow.png',
      // shadowSize: [41, 41],
      // shadowAnchor: [13, 40]
  });

  points
    .forEach(function(point) {
    var marker = L.marker([
      point.latitude,
      L.Util.wrapNum(point.longitude, [0,360], true)
    ], {
      title: point.name,
      icon: mitsuIcon
    }).bindTooltip(point.name);
    markerPointMap.set(marker, point);
    pointmarkerMap.set(point, marker);
    marker.on('click', function() {
      map.setView([point.latitude, L.Util.wrapNum(point.longitude, [0,360], true)]);
      markers.fire('active-points', {points: [point]});
    });
    markers.addLayer(marker);
  });

  // // Add the marker cluster group to the map
  map.addLayer(markers);

  // Handle cluster click event
  markers.on('clusterclick', function (e) {
    const point = e.latlng;
    map.setView([point.lat, L.Util.wrapNum(point.lng, [0,360], true)]);
    const points = e.sourceTarget.getAllChildMarkers().map(m => markerPointMap.get(m));
    markers.fire('active-points', { points: points });
  });

  function updateActiveStyles(e) {
    // Remove active class from all markers
    markers.eachLayer(function(layer) {
      if (layer instanceof L.Marker) {
        const icon = layer._icon;
        if (icon) icon.classList.remove('marker-active');
      }
    });
    // Remove active class from all cluster icons
    markers._featureGroup.eachLayer(function(layer) {
      if (layer instanceof L.MarkerCluster) {
        const icon = layer._icon;
        if (icon) icon.classList.remove('marker-active');
      }
    });

    // Add active class to selected markers
    (e.points || []).forEach(point => {
      const marker = pointmarkerMap.get(point);
      if (marker && marker._icon) {
        marker._icon.classList.add('marker-active');
      }
      // If marker is clustered, add marker-active to its cluster icon
      const parentCluster = markers.getVisibleParent(marker);
      if (parentCluster && parentCluster._icon) {
        parentCluster._icon.classList.add('marker-active');
      }
    });
  }

  markers.on('active-points', updateActiveStyles);

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

  markers.on('center-point', function (e) {
    const point = e.point;
    map.setView([point.latitude, L.Util.wrapNum(point.longitude, [0,360], true)], 10);
    markers.fire('active-points', { points: [e.point] });
    setTimeout(() => {
      updateVisibleMarkers();
    }, 500);
  });

  // Update visible markers
  const updateVisibleMarkers = () => {
    const contained = [];
    const bounds = map.getBounds();
    const center = map.getCenter();
    markers.eachLayer(function (l) {
      if (l instanceof L.Marker && bounds.contains(l.getLatLng())) {
        contained.push(markerPointMap.get(l));
      }
    });

    markers.fire('visible-points', { points: contained, center });
  }

  // Listen to moveend/zoomend with debounce
  map.on('moveend zoomend', debounce(updateVisibleMarkers, 200));
  updateVisibleMarkers();

  return markers;
}
