import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import { regionToInternalName } from './util';

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
  const pointClustergroupMap = new Map();

  const regions = points.reduce((acc, {region}) => {
    if(acc.includes(region)) return acc;
    acc.push(region);
    return acc;
  },[]);

  // Create cluster group for each region
  const regionalClusterMarkers = regions.map((region) => {
    const pointsInRegion = points.filter(({region: r}) => r === region);
    const regionClassName = 'marker-region-' + regionToInternalName(region);
    // Create a set of markers for each
    // This prevents markers from different regions from being grouped together.
    const markers = L.markerClusterGroup({
      maxClusterRadius: 15,
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      animateAddingMarkers: true,
      spiderLegPolylineOptions: {
        color: '#222',
        weight: 0,
        opacity: 0,
      },
      spiderfyDistanceMultiplier: 0.01,
      iconCreateFunction: function(cluster) {
        const childCount = cluster.getChildCount();
  
        return L.divIcon({
          className: 'marker-cluster-basic ' + regionClassName,
          html: `
            <div style="position: relative; text-align: center;">
              <img src="images/marker-mitsu-icon-cluster-2x.png" class="" title="$" alt="Marker" tabindex="0" style="width: 25px; height: 41px;">
              <div class="marker-cluster-count-text">
                ${childCount}
              </div>
            </div>
          `,
          iconSize: [25, 41], // size of the original marker image
          iconAnchor: [12, 41], // anchor the bottom point of the icon to the coordinates
          popupAnchor: [0,-45],
          shadowUrl: 'images/marker-shadow.png',
          shadowSize: [41, 41],
          shadowAnchor: [13, 40]
        });
      }
    });
  
    const mitsuIcon = L.divIcon({
      className: 'marker-cluster-basic ' + regionClassName,
      html: `
        <div style="position: relative; text-align: center;">
          <img src="images/marker-mitsu-icon-cluster-2x.png" class="" title="" alt="Marker" tabindex="0" style="width: 25px; height: 41px;">
          <div class="marker-cluster-count-text">
            1
          </div>
        </div>
      `,
      iconSize: [25, 41], // size of the original marker image
      iconAnchor: [12, 41], // anchor the bottom point of the icon to the coordinates
      popupAnchor: [0,-45],
      shadowUrl: 'images/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [13, 40]
    });

  
    const markersToadd = pointsInRegion
      .map(function(point) {
        const marker = L.marker([
          point.latitude,
          point.longitude
        ], {
          title: point.name,
          icon: mitsuIcon
        }).bindPopup(point.name, {className: 'popup-name-list'}).on('popupclose', (e) => {
          // markers.fire('active-points', { points: [] });
        });
        marker.on('click', function() {
          markers.fire('active-points', {points: [point]});
        });
        return marker;
      });
  
      
    // Update marker/point maps
    markersToadd.forEach((marker,i) => {
      markerPointMap.set(marker, pointsInRegion[i]);
      pointmarkerMap.set(pointsInRegion[i], marker);
      pointClustergroupMap.set(pointsInRegion[i], markers);
    });
  
    // Add new markers to cluster group
    markers.addLayers(markersToadd);

    return markers;
  });

  function updateActiveStyles(regionLayers, e) {
    regionLayers.eachLayer(function(regionLayer) {
      // Remove active class from all markers
      regionLayer.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
          const icon = layer._icon;
          if (icon) icon.classList.remove('marker-active');
        }
      });
      // Remove active class from all cluster icons
      regionLayer._featureGroup.eachLayer(function(layer) {
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
        const parentCluster = regionLayer.getVisibleParent(marker);
        if (parentCluster && parentCluster._icon) {
          parentCluster._icon.classList.add('marker-active');
        }
      });
    });
  }

  // Update visible markers
  function updateVisibleMarkers(regionLayers) {
    const contained = [];
    const bounds = map.getBounds();
    const center = map.getCenter();
    regionLayers.eachLayer(function (regionLayer) {
      regionLayer.eachLayer(function (l) {
        if (l instanceof L.Marker && bounds.contains(l.getLatLng())) {
          contained.push(markerPointMap.get(l));
        }
      });
    });
    regionLayers.fire('visible-points', { points: contained, center });
  }
  
  const allRegionLayers = L.layerGroup(regionalClusterMarkers);

  regionalClusterMarkers.forEach((markers) => {
    // Handle cluster click event
    markers.on('clusterclick', function(e) {
      const points = e.sourceTarget.getAllChildMarkers().map(m => markerPointMap.get(m));
      markers.fire('active-points', { points: points });
      const groupNames = e.sourceTarget.getAllChildMarkers().map(m => markerPointMap.get(m)?.name).sort((a,b) => a.localeCompare(b));
      const popUpText = groupNames.join('<br>');
      // TODO - Why does popupclose fire multiple times?
      e.sourceTarget.bindPopup(popUpText, {offset: [0, -38], className: 'popup-name-list'}).openPopup().on('popupclose', (_e) => {
        e.sourceTarget.unbindPopup();
        // allRegionLayers.fire('active-points', { points: [] });
      });
    });

    markers.on('active-points', (e) => {
      allRegionLayers.fire('active-points', e); // Maybe correct?
    })

  });

  allRegionLayers.on('active-points', updateActiveStyles.bind(null, allRegionLayers));

  // Listen to moveend/zoomend with debounce
  map.on('moveend zoomend', debounce(updateVisibleMarkers.bind(null, allRegionLayers), 200));
  updateVisibleMarkers(allRegionLayers);

  allRegionLayers.on('center-point', function(e) {
    const group = new L.featureGroup([pointmarkerMap.get(e.point)]);
    // Assuming we're on desktop, we add padding to the pan
    const offset = window.innerWidth >= 1024 ? 400 : 0;
    map.flyToBounds(group.getBounds(), {maxZoom: 8, duration: 0.4, paddingTopLeft: [offset, 0]});
    allRegionLayers.fire('active-points', { points: [e.point] });
    setTimeout(() => {
      updateVisibleMarkers(allRegionLayers);
      const marker = pointClustergroupMap.get(e.point)?.getVisibleParent(pointmarkerMap.get(e.point));
      // Hacky way to determine difference between marker and cluster marker
      const isClusterMarker = typeof marker._markers !== 'undefined';
      if(isClusterMarker) {
        marker.bindPopup(e.point.name, {className: 'popup-name-list', offset: [0, -38]}).openPopup().on('popupclose', (_e) => {
          marker.unbindPopup();
        });
      } else {
        marker.openPopup();
      }
    }, 500);
  });
  
  allRegionLayers.on('fit-bounds', function(e) {
    const markers = e.points.map((point) => pointmarkerMap.get(point));
    const group = new L.featureGroup(markers);
    // Assuming we're on desktop, we add padding to the pan
    const offset = window.innerWidth >= 1024 ? 400 : 0;
    map.flyToBounds(group.getBounds(), {maxZoom: 8, duration: 0.4, paddingTopLeft: [offset, 0]});
  });

  allRegionLayers.on('filter-points', function(e) {
    const toRemove = points.filter((point, i) => !e.points.includes(point)).map((point) => [pointmarkerMap.get(point), pointClustergroupMap.get(point)]);
    const toAdd = points.filter((point, i) => e.points.includes(point)).map((point) => [pointmarkerMap.get(point), pointClustergroupMap.get(point)]);

    toRemove.forEach(([marker, cluster]) => marker.removeFrom(cluster));
    toAdd.forEach(([marker, cluster]) => marker.addTo(cluster));
    regionalClusterMarkers.forEach((cluster) => {
      // cluster.removeLayers(toRemove);
      cluster.refreshClusters()
    });
  });

  // Add the marker cluster group to the map 
  map.addLayer(allRegionLayers);

  return allRegionLayers;
}
